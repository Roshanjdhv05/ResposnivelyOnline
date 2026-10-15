import dns from "node:dns/promises";
import net from "node:net";

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  const [a = 0, b = 0] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

export function isPrivateAddress(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::" || lower === "::1") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local fc00::/7
    if (/^fe[89ab]/.test(lower)) return true; // link local fe80::/10
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(lower);
    if (mapped?.[1]) return isPrivateIPv4(mapped[1]);
    return false;
  }
  return true; // unknown format: be conservative
}

/**
 * Resolves a hostname and reports whether it points at a private / loopback / link-local address.
 * Used to stop the header-check endpoint from being used to probe internal networks when this app
 * is deployed publicly.
 */
export async function resolvesToPrivateAddress(hostname: string): Promise<boolean> {
  const bare = hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(bare)) return isPrivateAddress(bare);
  if (bare === "localhost" || bare.endsWith(".localhost")) return true;
  const records = await dns.lookup(bare, { all: true });
  return records.some((record) => isPrivateAddress(record.address));
}

/** Local/private targets are allowed in development, or when explicitly enabled. */
export function privateHostsAllowed(): boolean {
  return process.env.ALLOW_PRIVATE_HOSTS === "true" || process.env.NODE_ENV !== "production";
}
