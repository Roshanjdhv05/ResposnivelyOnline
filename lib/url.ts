export type UrlResult =
  | { ok: true; url: string; host: string; autoNormalized: boolean }
  | { ok: false; error: string };

const BLOCKED_SCHEMES =
  /^(javascript|data|vbscript|file|blob|about|mailto|tel|ftp|chrome|view-source):/i;
const EXPLICIT_SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9-]{2,}$/i;

function looksLocal(hostPort: string): boolean {
  const host = hostPort.replace(/:\d+$/, "").toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "[::1]" ||
    IPV4.test(host)
  );
}

/**
 * Validates and normalizes user input into an http(s) URL.
 * - Adds https:// when no scheme is given (http:// for localhost / IP addresses).
 * - Rejects non-http(s) schemes, spaces, embedded credentials and malformed hosts.
 */
export function normalizeUrl(input: string): UrlResult {
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Enter a website address to preview." };
  if (/\s/.test(raw)) return { ok: false, error: "Web addresses can't contain spaces." };
  if (BLOCKED_SCHEMES.test(raw)) {
    return { ok: false, error: "Only http:// and https:// addresses can be previewed." };
  }

  let candidate = raw;
  let autoNormalized = false;

  if (!EXPLICIT_SCHEME.test(raw)) {
    const withoutSlashes = raw.replace(/^\/\//, "");
    const hostPort = withoutSlashes.split(/[/?#]/)[0] ?? "";
    candidate = `${looksLocal(hostPort) ? "http" : "https"}://${withoutSlashes}`;
    autoNormalized = true;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "That doesn't look like a valid web address." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http:// and https:// addresses can be previewed." };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, error: "Addresses with embedded credentials aren't supported." };
  }

  const hostname = parsed.hostname;
  const validHost =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.startsWith("[") ||
    IPV4.test(hostname) ||
    DOMAIN.test(hostname);
  if (!validHost) {
    return {
      ok: false,
      error: "That doesn't look like a valid domain. Try something like example.com.",
    };
  }

  return { ok: true, url: parsed.href, host: parsed.host, autoNormalized };
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
