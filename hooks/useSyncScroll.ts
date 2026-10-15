"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

export interface SyncScrollBus {
  /** Register an iframe for scroll sync. Returns an unregister function. */
  register: (uid: string, iframe: HTMLIFrameElement) => () => void;
  /** Call inside the iframe onLoad so the passive listener is re-attached after navigation. */
  onFrameLoaded: (uid: string) => void;
  /**
   * Scroll ALL registered iframes by the given pixel delta.
   * Dispatches via both postMessage (to sync bridge) and direct DOM (if same-origin).
   */
  scrollAllBy: (driverUid: string, deltaX: number, deltaY: number) => void;
  enabled: boolean;
}

/**
 * Shared scroll-sync bus.
 *
 * Supports dual-sync architecture:
 *  1. Bridge Message Listener: Receives scroll events broadcast from the injected
 *     bridge script inside proxied iframes (handles cross-origin sites via /api/proxy)
 *     and synchronizes scroll percentages across all device viewports.
 *  2. Direct DOM Listener: Passive fallback for same-origin contentWindow documents.
 *  3. Relative scrollAllBy: Broadcasts wheel/touch deltas to all connected frames.
 */
export function useSyncScroll(enabled: boolean): SyncScrollBus {
  const entriesRef = useRef<
    Map<string, { iframe: HTMLIFrameElement; ac: AbortController | null }>
  >(new Map());

  const enabledRef = useRef(enabled);
  /** uid of the frame currently broadcasting — guards against re-entrancy loops. */
  const suppressRef = useRef<string | null>(null);
  const suppressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep enabledRef synchronized without re-attaching listeners constantly
  enabledRef.current = enabled;

  const setSuppression = useCallback((uid: string) => {
    suppressRef.current = uid;
    if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current);
    suppressTimerRef.current = setTimeout(() => {
      suppressRef.current = null;
    }, 60);
  }, []);

  // ── broadcastPercent (mirrors scroll percent to other iframes) ───────────────

  const broadcastPercent = useCallback(
    (driverUid: string, percentY: number, scrollX: number) => {
      if (!enabledRef.current) return;
      if (suppressRef.current && suppressRef.current !== driverUid) return;

      setSuppression(driverUid);

      for (const [uid, entry] of entriesRef.current.entries()) {
        if (uid === driverUid) continue;

        // Method 1: postMessage to sync bridge script inside iframe
        try {
          entry.iframe.contentWindow?.postMessage(
            {
              source: "rwp-parent",
              type: "SCROLL_PERCENT",
              percentY,
              scrollX,
            },
            "*",
          );
        } catch {
          // ignore
        }

        // Method 2: Direct DOM scrollTo (for same-origin / proxy)
        try {
          const win = entry.iframe.contentWindow;
          const doc = entry.iframe.contentDocument;
          if (win && doc) {
            const docEl = doc.documentElement;
            const body = doc.body;
            const scrollH = Math.max(docEl ? docEl.scrollHeight : 0, body ? body.scrollHeight : 0);
            const clientH = win.innerHeight || (docEl ? docEl.clientHeight : 0);
            const maxScrollY = Math.max(0, scrollH - clientH);

            win.scrollTo({
              top: Math.round(percentY * maxScrollY),
              left: scrollX,
              behavior: "instant",
            });
          }
        } catch {
          // Cross-origin without DOM access — postMessage handles it
        }
      }
    },
    [setSuppression],
  );

  // ── scrollAllBy (relative delta → ALL iframes) ──────────────────────────────

  const scrollAllBy = useCallback(
    (driverUid: string, deltaX: number, deltaY: number) => {
      if (!enabledRef.current) return;
      setSuppression(driverUid);

      for (const [, entry] of entriesRef.current.entries()) {
        // 1. Send postMessage to iframe bridge
        try {
          entry.iframe.contentWindow?.postMessage(
            {
              source: "rwp-parent",
              type: "SCROLL_BY",
              deltaX,
              deltaY,
            },
            "*",
          );
        } catch {
          // ignore
        }

        // 2. Direct DOM scrollBy if accessible
        try {
          entry.iframe.contentWindow?.scrollBy({
            left: deltaX,
            top: deltaY,
            behavior: "instant",
          });
        } catch {
          // Cross-origin — postMessage handles it
        }
      }
    },
    [setSuppression],
  );

  // ── postMessage listener for child bridge messages ──────────────────────────

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!enabledRef.current) return;
      // Bridge emits type: "SCROLL" with data.percentY; accept both legacy FRAME_SCROLLED and current SCROLL
      if (!e.data || e.data.source !== "rwp-child") return;
      if (e.data.type !== "SCROLL" && e.data.type !== "FRAME_SCROLLED") return;

      // Support both flat format {percentY, scrollX, uid} and nested data format {data: {percentY, scrollX}, uid}
      const payload = e.data.data ?? e.data;
      const uid = e.data.uid as string | undefined;
      const percentY = typeof payload.percentY === "number" ? payload.percentY : null;
      if (percentY === null) return;
      const scrollX = typeof payload.scrollX === "number" ? payload.scrollX : 0;

      // Identify driver UID
      let driverUid = uid;
      if (!driverUid) {
        for (const [entryUid, entry] of entriesRef.current.entries()) {
          try {
            if (entry.iframe.contentWindow === e.source) {
              driverUid = entryUid;
              break;
            }
          } catch {
            // cross-origin window equality check error
          }
        }
      }

      if (driverUid) {
        broadcastPercent(driverUid, percentY, scrollX);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [broadcastPercent]);

  // ── attachListener (direct DOM passive fallback) ───────────────────────────

  const attachListener = useCallback(
    (uid: string, frame: HTMLIFrameElement): AbortController | null => {
      try {
        const win = frame.contentWindow;
        const doc = frame.contentDocument;
        if (!win || !doc) return null;

        const ac = new AbortController();
        win.addEventListener(
          "scroll",
          () => {
            if (!enabledRef.current) return;
            if (suppressRef.current && suppressRef.current !== uid) return;
            try {
              const docEl = doc.documentElement;
              const body = doc.body;
              const scrollH = Math.max(docEl ? docEl.scrollHeight : 0, body ? body.scrollHeight : 0);
              const clientH = win.innerHeight || (docEl ? docEl.clientHeight : 0);
              const maxScrollY = Math.max(1, scrollH - clientH);

              const y = win.scrollY || (docEl ? docEl.scrollTop : 0) || (body ? body.scrollTop : 0) || 0;
              const x = win.scrollX || (docEl ? docEl.scrollLeft : 0) || (body ? body.scrollLeft : 0) || 0;
              const percentY = Math.min(1, Math.max(0, y / maxScrollY));

              broadcastPercent(uid, percentY, x);
            } catch {
              // Navigated away or cross-origin — skip
            }
          },
          { passive: true, signal: ac.signal },
        );
        return ac;
      } catch {
        // Cross-origin access blocked — bridge script handles it
        return null;
      }
    },
    [broadcastPercent],
  );

  const safeAbort = (ac: AbortController | null) => {
    if (!ac) return;
    try {
      ac.abort();
    } catch {
      // defensive
    }
  };

  // ── register ──────────────────────────────────────────────────────────────

  const register = useCallback(
    (uid: string, iframe: HTMLIFrameElement): (() => void) => {
      const existing = entriesRef.current.get(uid);
      safeAbort(existing?.ac ?? null);

      let ac: AbortController | null = null;
      try {
        if (iframe.contentDocument?.readyState === "complete") {
          ac = attachListener(uid, iframe);
        }
      } catch {
        // Cross-origin readyState blocked
      }

      entriesRef.current.set(uid, { iframe, ac });

      return () => {
        const entry = entriesRef.current.get(uid);
        if (entry) {
          safeAbort(entry.ac);
          entriesRef.current.delete(uid);
        }
      };
    },
    [attachListener],
  );

  // ── onFrameLoaded ─────────────────────────────────────────────────────────

  const onFrameLoaded = useCallback(
    (uid: string) => {
      const entry = entriesRef.current.get(uid);
      if (!entry) return;
      safeAbort(entry.ac);
      const newAc = attachListener(uid, entry.iframe);
      entriesRef.current.set(uid, { ...entry, ac: newAc });
    },
    [attachListener],
  );

  return useMemo(
    () => ({ register, onFrameLoaded, scrollAllBy, enabled }),
    [register, onFrameLoaded, scrollAllBy, enabled],
  );
}
