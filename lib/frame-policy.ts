/**
 * Pure helpers that interpret the response headers browsers use to decide whether a page may be
 * displayed inside a frame. We only *detect* the restriction so we can explain it; we never try to
 * work around it.
 */

export interface FramePolicyInput {
  xFrameOptions: string | null;
  contentSecurityPolicy: string | null;
}

export type FramePolicyResult =
  | { blocked: false }
  | {
      blocked: true;
      by: "x-frame-options" | "csp";
      header: string;
      value: string;
    };

function getDirective(policy: string, name: string): string[] | null {
  for (const part of policy.split(";")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    const directive = tokens[0];
    if (directive && directive.toLowerCase() === name) return tokens.slice(1);
  }
  return null;
}

function defaultPort(protocol: string): string {
  return protocol === "https:" ? "443" : protocol === "http:" ? "80" : "";
}

function matchesHostSource(source: string, embedder: URL): boolean {
  let rest = source;
  let scheme: string | null = null;

  const schemeMatch = /^([a-z][a-z0-9+.-]*):\/\//i.exec(rest);
  if (schemeMatch) {
    scheme = `${(schemeMatch[1] ?? "").toLowerCase()}:`;
    rest = rest.slice(schemeMatch[0].length);
  }
  rest = rest.split("/")[0] ?? "";

  let port: string | null = null;
  const portMatch = /:(\d+|\*)$/.exec(rest);
  if (portMatch) {
    port = portMatch[1] ?? null;
    rest = rest.slice(0, rest.length - portMatch[0].length);
  }

  const host = rest.toLowerCase();
  if (!host) return false;

  if (scheme) {
    const ok =
      scheme === embedder.protocol || (scheme === "http:" && embedder.protocol === "https:");
    if (!ok) return false;
  }

  if (port && port !== "*") {
    const embedderPort = embedder.port || defaultPort(embedder.protocol);
    if (port !== embedderPort) return false;
  }

  const hostname = embedder.hostname.toLowerCase();
  if (host === "*") return true;
  if (host.startsWith("*.")) return hostname.endsWith(host.slice(1));
  return hostname === host;
}

function allowsAncestor(tokens: string[], embedderOrigin: string): boolean {
  if (tokens.length === 0) return false; // an empty source list behaves like 'none'
  let embedder: URL;
  try {
    embedder = new URL(embedderOrigin);
  } catch {
    return false;
  }

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (lower === "'none'" || lower === "'self'") continue; // we are never the page's own origin
    if (lower === "*") return true;
    if (/^[a-z][a-z0-9+.-]*:$/.test(lower)) {
      if (lower === embedder.protocol) return true;
      continue;
    }
    if (matchesHostSource(token, embedder)) return true;
  }
  return false;
}

export function evaluateFramePolicy(
  input: FramePolicyInput,
  embedderOrigin: string,
): FramePolicyResult {
  // When a CSP frame-ancestors directive exists, browsers ignore X-Frame-Options.
  if (input.contentSecurityPolicy) {
    let sawDirective = false;
    // Multiple CSP headers are joined with commas by the Fetch API.
    for (const policy of input.contentSecurityPolicy.split(",")) {
      const tokens = getDirective(policy, "frame-ancestors");
      if (tokens === null) continue;
      sawDirective = true;
      if (!allowsAncestor(tokens, embedderOrigin)) {
        return {
          blocked: true,
          by: "csp",
          header: "Content-Security-Policy",
          value: `frame-ancestors ${tokens.join(" ") || "'none'"}`,
        };
      }
    }
    if (sawDirective) return { blocked: false };
  }

  if (input.xFrameOptions) {
    const values = input.xFrameOptions
      .split(",")
      .map((v) => v.trim().toUpperCase())
      .filter(Boolean);
    const blocking = values.find((v) => v === "DENY" || v === "SAMEORIGIN");
    if (blocking) {
      return {
        blocked: true,
        by: "x-frame-options",
        header: "X-Frame-Options",
        value: blocking,
      };
    }
  }

  return { blocked: false };
}
