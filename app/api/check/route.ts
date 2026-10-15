import { NextRequest, NextResponse } from "next/server";
import { evaluateFramePolicy } from "@/lib/frame-policy";
import { privateHostsAllowed, resolvesToPrivateAddress } from "@/lib/server/network";
import type { CheckResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function json(result: CheckResult, status = 200) {
  return NextResponse.json(result, { status, headers: { "Cache-Control": "no-store" } });
}

function errorCode(error: unknown): string {
  const err = error as { code?: string; cause?: { code?: string }; name?: string };
  return err?.cause?.code ?? err?.code ?? err?.name ?? "UNKNOWN";
}

/**
 * Reads the response headers of the target page (no body) so the client can tell the user *why* a
 * site can't be embedded. This only inspects X-Frame-Options / CSP frame-ancestors; it never tries
 * to strip or bypass them.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const target = request.nextUrl.searchParams.get("url");
  const originParam = request.nextUrl.searchParams.get("origin");

  if (!target) return json({ state: "unknown", message: "Missing url parameter." }, 400);

  let current: URL;
  try {
    current = new URL(target);
  } catch {
    return json({ state: "unknown", message: "Invalid URL." }, 400);
  }

  let embedderOrigin = request.nextUrl.origin;
  if (originParam) {
    try {
      embedderOrigin = new URL(originParam).origin;
    } catch {
      /* fall back to the request origin */
    }
  }

  const allowPrivate = privateHostsAllowed();

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (current.protocol !== "http:" && current.protocol !== "https:") {
        return json({ state: "skipped", reason: "Unsupported protocol." });
      }
      if (current.username || current.password) {
        return json({ state: "skipped", reason: "Credentials in URLs are not supported." });
      }

      if (!allowPrivate) {
        let isPrivate: boolean;
        try {
          isPrivate = await resolvesToPrivateAddress(current.hostname);
        } catch (error) {
          return json({
            state: "unreachable",
            code: errorCode(error),
            message: `Could not resolve ${current.hostname}.`,
          });
        }
        if (isPrivate) {
          return json({
            state: "skipped",
            reason: "Private network addresses are not checked by this server.",
          });
        }
      }

      const response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          "user-agent": USER_AGENT,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.9",
        },
      });
      // Headers are all we need; don't download the page.
      void response.body?.cancel().catch(() => undefined);

      const location = response.headers.get("location");
      if (response.status >= 300 && response.status < 400 && location) {
        current = new URL(location, current);
        continue;
      }

      const policy = evaluateFramePolicy(
        {
          xFrameOptions: response.headers.get("x-frame-options"),
          contentSecurityPolicy: response.headers.get("content-security-policy"),
        },
        embedderOrigin,
      );

      if (policy.blocked) {
        return json({
          state: "blocked",
          by: policy.by,
          header: policy.header,
          value: policy.value,
          status: response.status,
          finalUrl: current.href,
        });
      }
      return json({ state: "ok", status: response.status, finalUrl: current.href });
    }

    return json({ state: "unknown", message: "Too many redirects." });
  } catch (error) {
    const code = errorCode(error);
    if (code === "ENOTFOUND" || code === "EAI_AGAIN" || code === "ECONNREFUSED") {
      return json({
        state: "unreachable",
        code,
        message:
          code === "ECONNREFUSED"
            ? `${current.host} refused the connection.`
            : `${current.hostname} could not be found.`,
      });
    }
    if (code === "TimeoutError" || code === "AbortError") {
      return json({ state: "unknown", message: "The site took too long to answer the header check." });
    }
    return json({ state: "unknown", message: `Header check failed (${code}).` });
  }
}
