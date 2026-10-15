"use client";

import { useEffect, useState } from "react";
import type { CheckResult, EmbedCheckState } from "@/lib/types";

const CLIENT_TIMEOUT_MS = 7_000;

/**
 * Asks the server which framing headers the target sends (once per submit, shared by every device
 * preview). The result only explains failures; previews still load independently in iframes.
 */
export function useEmbedCheck(url: string | null, runId: number): EmbedCheckState {
  const [state, setState] = useState<EmbedCheckState>({ status: "idle", result: null });

  useEffect(() => {
    if (!url) {
      setState({ status: "idle", result: null });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    setState({ status: "checking", result: null });

    const params = new URLSearchParams({ url, origin: window.location.origin });

    fetch(`/api/check?${params.toString()}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => (await response.json()) as CheckResult)
      .then((result) => {
        if (!cancelled) setState({ status: "done", result });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          status: "done",
          result: { state: "unknown", message: "The header check did not complete." },
        });
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [url, runId]);

  return state;
}
