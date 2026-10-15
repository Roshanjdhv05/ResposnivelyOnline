import { NextRequest, NextResponse } from "next/server";
import { privateHostsAllowed, resolvesToPrivateAddress } from "@/lib/server/network";
import { generateBridgeScript } from "@/lib/sync/client-bridge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 20_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE, PATCH",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const urlParam = request.nextUrl.searchParams.get("url");
  const uid = request.nextUrl.searchParams.get("uid") || "";

  if (!urlParam) {
    return new NextResponse("Missing url parameter.", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(urlParam);
  } catch {
    return new NextResponse("Invalid URL parameter.", { status: 400 });
  }

  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    return new NextResponse("Only http: and https: URLs can be previewed.", { status: 400 });
  }

  const allowPrivate = privateHostsAllowed();
  if (!allowPrivate) {
    let isPrivate = false;
    try {
      isPrivate = await resolvesToPrivateAddress(targetUrl.hostname);
    } catch {
      return new NextResponse(`Could not resolve hostname: ${targetUrl.hostname}`, {
        status: 502,
      });
    }
    if (isPrivate) {
      return new NextResponse("Private network addresses are not accessible in production.", {
        status: 403,
      });
    }
  }

  try {
    const upstream = await fetch(targetUrl.href, {
      method: "GET",
      headers: {
        "user-agent": USER_AGENT,
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    const contentType = upstream.headers.get("content-type") || "";
    const isHtml =
      contentType.includes("text/html") || contentType.includes("application/xhtml+xml");

    function rewriteHtmlUrls(html: string, baseUrlStr: string): string {
      let baseObj: URL;
      try {
        baseObj = new URL(baseUrlStr);
      } catch {
        return html;
      }

      function resolveUrl(val: string): string {
        if (!val) return val;
        const trimmed = val.trim();
        if (
          trimmed.startsWith("#") ||
          trimmed.startsWith("javascript:") ||
          trimmed.startsWith("data:") ||
          trimmed.startsWith("mailto:") ||
          trimmed.startsWith("tel:") ||
          trimmed.startsWith("blob:")
        ) {
          return val;
        }
        try {
          return new URL(trimmed, baseObj).href;
        } catch {
          return val;
        }
      }

      // 1. Rewrite src, href, action, poster, data-src attributes
      let rewritten = html.replace(
        /\b(src|href|action|poster|data-src)=["']([^"']+)["']/gi,
        (match, attr, val) => {
          return `${attr}="${resolveUrl(val)}"`;
        },
      );

      // 2. Rewrite srcset & data-srcset attributes
      rewritten = rewritten.replace(
        /\b(srcset|data-srcset)=["']([^"']+)["']/gi,
        (match, attr, val) => {
          const candidates = val.split(",").map((item: string) => {
            const parts = item.trim().split(/\s+/);
            if (parts[0]) {
              parts[0] = resolveUrl(parts[0]);
            }
            return parts.join(" ");
          });
          return `${attr}="${candidates.join(", ")}"`;
        },
      );

      // 3. Neutralize target="_top" and target="_parent" so links don't break out of the previewer
      rewritten = rewritten.replace(/\btarget=["']?(_top|_parent)["']?/gi, 'target="_self"');

      // 4. Upgrade protocol-relative URLs
      rewritten = rewritten.replace(/(href=["'])\/\//gi, "$1https://");
      rewritten = rewritten.replace(/(src=["'])\/\//gi, "$1https://");

      return rewritten;
    }

    if (isHtml) {
      const rawHtml = await upstream.text();
      const finalUrl = upstream.url || targetUrl.href;

      // Rewrite relative URLs to absolute so assets and subpages don't 404
      let modifiedHtml = rewriteHtmlUrls(rawHtml, finalUrl);

      // Injected client bridge for bidirectional interaction and scroll synchronization
      const syncScript = generateBridgeScript({
        targetUrl: finalUrl,
        uid,
      });

      const baseTag = `<base href="${finalUrl}">`;
      const viewportTag = !/<meta\b[^>]*name=["']?viewport["']?/i.test(rawHtml)
        ? '<meta name="viewport" content="width=device-width, initial-scale=1">'
        : "";

      // Remove existing <base> tags so our injected <base href="${finalUrl}"> is authoritative
      modifiedHtml = modifiedHtml.replace(/<base\b[^>]*\/?>/gi, "");

      // Remove CSP meta tags
      modifiedHtml = modifiedHtml.replace(
        /<meta\b[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*\/?>/gi,
        "",
      );
      // Remove X-Frame-Options meta tags
      modifiedHtml = modifiedHtml.replace(
        /<meta\b[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*\/?>/gi,
        "",
      );

      // Remove SRI integrity attributes so checksum mismatch doesn't block scripts or stylesheets
      modifiedHtml = modifiedHtml.replace(/\s+integrity=["'][^"']*["']/gi, "");

      // Remove crossorigin attributes from link and script tags
      modifiedHtml = modifiedHtml.replace(
        /(<(?:link|script)\b[^>]*?)\s+crossorigin(?:=["'][^"']*["'])?/gi,
        "$1",
      );

      // CSS patch: force elements hidden by entrance-animation libraries to be visible.
      // Sites set opacity:0 / visibility:hidden and animate them in via IntersectionObserver or
      // scroll events. Inside an iframe those observers may never fire, leaving content blank.
      const visibilityFixStyle = `<style id="rwp-proxy-vis-fix">
/* Force HTML & Body visible in iframes */
html, body {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
/* Force scroll-reveal / entrance-animation hidden elements visible */
[data-aos],[data-wow],[data-sr],
.wow,.aos-init,.is-hidden,.fade-up,.fade-in,.reveal,.sr-only-until-loaded {
  opacity:1!important;visibility:visible!important;transform:none!important;
  transition-duration:0ms!important;animation:none!important;
}
div[style*="opacity:0"],div[style*="opacity: 0"],div[style*="opacity: 0."],div[style*="opacity:0."],
section[style*="opacity:0"],section[style*="opacity: 0"],section[style*="opacity: 0."],section[style*="opacity:0."],
main[style*="opacity:0"],main[style*="opacity: 0"],main[style*="opacity: 0."],main[style*="opacity:0."],
article[style*="opacity:0"],article[style*="opacity: 0"],
header[style*="opacity:0"],header[style*="opacity: 0"],
footer[style*="opacity:0"],footer[style*="opacity: 0"] {
  opacity:1!important;transform:none!important;
}
[style*="visibility:hidden"],[style*="visibility: hidden"]{visibility:visible!important;opacity:1!important;}
.page-loader,.site-loader,.loader-overlay,#loader,#page-loader,#site-loader{display:none!important;}
</style>`;

      const injectedHead = `\n  ${baseTag}${viewportTag ? `\n  ${viewportTag}` : ""}\n  ${visibilityFixStyle}\n  ${syncScript}`;

      if (/<head\b[^>]*>/i.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(/(<head\b[^>]*>)/i, `$1${injectedHead}`);
      } else if (/<html\b[^>]*>/i.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(/(<html\b[^>]*>)/i, `$1\n<head>${injectedHead}\n</head>`);
      } else {
        modifiedHtml = `${baseTag}\n${viewportTag}\n${syncScript}\n${modifiedHtml}`;
      }

      const headers = new Headers();
      headers.set("Content-Type", "text/html; charset=utf-8");
      headers.set("Cache-Control", "no-store, max-age=0");
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
      headers.set("Access-Control-Allow-Headers", "*");

      // Ensure browser renders HTML even if upstream returned an error status code
      const responseStatus = upstream.ok ? upstream.status : 200;

      return new NextResponse(modifiedHtml, {
        status: responseStatus,
        headers,
      });
    }

    // Pass through non-HTML assets (CSS, JS, images, fonts, JSON)
    const buffer = await upstream.arrayBuffer();
    const headers = new Headers();
    if (contentType) headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=86400");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    headers.set("Access-Control-Allow-Headers", "*");

    return new NextResponse(buffer, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Preview Error</title></head><body style="font-family:system-ui,-apple-system,sans-serif;padding:2.5rem;color:#e4e4e7;background:#09090b;text-align:center;"><div style="max-width:400px;margin:3rem auto;padding:2rem;background:#18181b;border:1px solid #27272a;border-radius:12px;"><h3 style="margin-bottom:0.75rem;font-size:1.1rem;color:#f43f5e;">Unable to load preview</h3><p style="color:#a1a1aa;font-size:0.875rem;line-height:1.5;">${message}</p><p style="margin-top:1rem;color:#71717a;font-size:0.75rem;">Check your internet connection or URL.</p></div></body></html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}
