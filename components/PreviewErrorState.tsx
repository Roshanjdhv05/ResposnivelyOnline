"use client";

import {
  Ban,
  ExternalLink,
  Hourglass,
  LockKeyhole,
  RefreshCw,
  ShieldAlert,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { PreviewError, PreviewErrorKind } from "@/hooks/usePreviewLoader";

interface PreviewErrorStateProps {
  error: PreviewError;
  /** True when the frame is too small to show the full explanation. */
  narrow: boolean;
  onRetry: () => void;
  onOpenInNewTab: () => void;
  onTryAnyway?: () => void;
}

interface Copy {
  icon: LucideIcon;
  tone: "info" | "warn" | "danger";
  title: string;
  short: string;
  body: (error: PreviewError) => ReactNode;
}

const COPY: Record<PreviewErrorKind, Copy> = {
  blocked: {
    icon: ShieldAlert,
    tone: "info",
    title: "This site doesn't allow embedding",
    short: "Embedding not allowed",
    body: (e) => (
      <>
        <strong className="font-semibold text-fg">{e.host}</strong> is working normally, but it
        tells browsers not to display it inside a frame
        {e.detail ? (
          <>
            {" "}
            (<code className="rounded bg-surface2 px-1 py-0.5 text-2xs">{e.detail}</code>)
          </>
        ) : null}
        . That is a deliberate security setting, so it can&apos;t be previewed here and we
        don&apos;t work around it. Open it in a new tab to view it normally.
      </>
    ),
  },
  unreachable: {
    icon: WifiOff,
    tone: "warn",
    title: "Couldn't reach this address",
    short: "Couldn't reach site",
    body: (e) => (
      <>
        The preview server couldn&apos;t connect to <strong className="text-fg">{e.host}</strong>
        {e.detail ? ` (${e.detail})` : ""}. Check the spelling of the address. If the site is only
        reachable from your own network, try loading it anyway.
      </>
    ),
  },
  timeout: {
    icon: Hourglass,
    tone: "warn",
    title: "Taking longer than expected",
    short: "Slow to load",
    body: (e) => (
      <>
        <strong className="text-fg">{e.host}</strong> hasn&apos;t finished loading. It may just be
        slow, or it may restrict embedding in a way browsers don&apos;t report. Try again or open it
        in a new tab.
      </>
    ),
  },
  "mixed-content": {
    icon: LockKeyhole,
    tone: "warn",
    title: "Blocked by your browser",
    short: "Insecure site blocked",
    body: (e) => (
      <>
        This previewer is served over HTTPS, and browsers refuse to embed an insecure{" "}
        <code className="rounded bg-surface2 px-1 py-0.5 text-2xs">http://</code> page such as{" "}
        <strong className="text-fg">{e.host}</strong>. Open it in a new tab, or run the previewer
        over HTTP (for example on localhost).
      </>
    ),
  },
};

const TONE_CLASS: Record<Copy["tone"], string> = {
  info: "bg-accent/15 text-accent",
  warn: "bg-warn/15 text-warn",
  danger: "bg-danger/15 text-danger",
};

export default function PreviewErrorState({
  error,
  narrow,
  onRetry,
  onOpenInNewTab,
  onTryAnyway,
}: PreviewErrorStateProps) {
  const copy = COPY[error.kind];
  const Icon = copy.icon;
  const fullText = `${copy.title}. ${error.host}${error.detail ? ` — ${error.detail}` : ""}`;

  const btn =
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-surface2";

  if (narrow) {
    return (
      <div
        role="alert"
        title={fullText}
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface p-2 text-center"
      >
        <span className={cn("rounded-full p-1.5", TONE_CLASS[copy.tone])}>
          <Icon size={16} aria-hidden />
        </span>
        <p className="text-2xs font-medium leading-tight text-fg">{copy.short}</p>
        <div className="flex gap-1">
          <button type="button" className={cn(btn, "px-1.5")} onClick={onRetry} aria-label="Retry">
            <RefreshCw size={12} aria-hidden />
          </button>
          <button
            type="button"
            className={cn(btn, "px-1.5")}
            onClick={onOpenInNewTab}
            aria-label="Open in new tab"
          >
            <ExternalLink size={12} aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex h-full w-full items-center justify-center overflow-auto bg-surface p-4"
    >
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <span className={cn("rounded-full p-2.5", TONE_CLASS[copy.tone])}>
          {error.kind === "blocked" ? (
            <Ban size={22} aria-hidden />
          ) : (
            <Icon size={22} aria-hidden />
          )}
        </span>
        <h3 className="text-sm font-semibold text-fg">{copy.title}</h3>
        <p className="text-xs leading-relaxed text-muted">{copy.body(error)}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onOpenInNewTab}
            className={cn(btn, "border-transparent bg-accent text-accent-fg hover:bg-accent/90")}
          >
            <ExternalLink size={14} aria-hidden /> Open in new tab
          </button>
          {(error.kind === "unreachable" || error.kind === "blocked") && onTryAnyway ? (
            <button type="button" onClick={onTryAnyway} className={btn}>
              Try loading anyway
            </button>
          ) : null}
          <button type="button" onClick={onRetry} className={btn}>
            <RefreshCw size={14} aria-hidden /> Retry
          </button>
        </div>
      </div>
    </div>
  );
}
