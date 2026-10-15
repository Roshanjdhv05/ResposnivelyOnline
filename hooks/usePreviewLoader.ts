"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { hostOf } from "@/lib/url";
import { LOAD_TIMEOUT_MS } from "@/lib/preview-engine";
import type { EmbedCheckState } from "@/lib/types";

export type PreviewErrorKind = "blocked" | "unreachable" | "timeout" | "mixed-content";

export interface PreviewError {
  kind: PreviewErrorKind;
  host: string;
  /** Technical detail, e.g. "X-Frame-Options: DENY". */
  detail?: string;
}

export type PreviewStatus = "idle" | "loading" | "loaded" | "error";

interface Options {
  url: string | null;
  runId: number;
  check: EmbedCheckState;
  uid?: string;
}

export function toProxyUrl(url: string | null, uid?: string): string | null {
  if (!url) return null;
  if (url.startsWith("/api/proxy")) return url;
  const params = new URLSearchParams({ url });
  if (uid) params.set("uid", uid);
  return `/api/proxy?${params.toString()}`;
}

function isMixedContent(url: string): boolean {
  return (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    url.startsWith("http://")
  );
}

/**
 * Tracks the lifecycle of one iframe: loading, loaded, or one of several well-explained errors.
 * Each device owns its own loader, so previews load, fail and retry independently.
 */
export function usePreviewLoader({ url, runId, check, uid }: Options) {
  const [reloadCount, setReloadCount] = useState(0);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [timedOutKey, setTimedOutKey] = useState<string | null>(null);
  const [ignoreKey, setIgnoreKey] = useState<string | null>(null);

  const urlKey = `${url ?? ""}|${runId}`;
  const loadKey = `${urlKey}|${reloadCount}`;

  const result = check.result;
  const unreachable =
    check.status === "done" && result?.state === "unreachable" && ignoreKey !== urlKey
      ? result
      : null;

  const error = useMemo<PreviewError | null>(() => {
    if (!url) return null;
    const host = hostOf(url);
    if (isMixedContent(url)) return { kind: "mixed-content", host };
    if (timedOutKey === loadKey) return { kind: "timeout", host };
    return null;
  }, [url, timedOutKey, loadKey]);

  const shouldLoad = !!url && !error;
  const loaded = loadedKey === loadKey;

  useEffect(() => {
    if (!shouldLoad || loaded) return;
    const timer = setTimeout(() => setTimedOutKey(loadKey), 30_000);
    return () => clearTimeout(timer);
  }, [shouldLoad, loaded, loadKey]);

  const status: PreviewStatus = !url
    ? "idle"
    : error
      ? "error"
      : loaded
        ? "loaded"
        : "loading";

  const onLoad = useCallback(() => setLoadedKey(loadKey), [loadKey]);
  const reload = useCallback(() => setReloadCount((n) => n + 1), []);
  const tryAnyway = useCallback(() => setIgnoreKey(urlKey), [urlKey]);

  // Loads target URL through /api/proxy with injected client-bridge script for synchronized interactions.
  // Strips X-Frame-Options and Content-Security-Policy headers so all websites load properly.
  const resolvedUrl = useMemo(() => {
    if (!shouldLoad) return null;
    const result = check.result;
    const finalUrl = result && (result.state === "ok" || result.state === "blocked") ? result.finalUrl : null;
    const target = finalUrl || url;
    return toProxyUrl(target, uid);
  }, [shouldLoad, check.result, url, uid]);

  return {
    status,
    error,
    /** Native browser URL for the iframe, or null when unmounted/blocked. */
    src: resolvedUrl,
    /** Changing key forces a fresh iframe (new submit, refresh-all, or per-device reload). */
    frameKey: loadKey,
    onLoad,
    reload,
    tryAnyway,
  };
}
