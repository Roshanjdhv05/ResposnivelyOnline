"use client";

import { Globe, Loader2, Shrink } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePreviewLoader } from "@/hooks/usePreviewLoader";
import type { SyncScrollBus } from "@/hooks/useSyncScroll";
import { cn } from "@/lib/cn";
import {
  MIN_COLUMN_WIDTH,
  effectiveSize,
  fullscreenScale,
} from "@/lib/preview-engine";
import { ScreenshotError, capturePreviewPng, downloadBlob } from "@/lib/screenshot";
import type { DeviceInstance, DevicePreset, EmbedCheckState, Size, ZoomMode } from "@/lib/types";
import DeviceToolbar from "./DeviceToolbar";
import PreviewErrorState from "./PreviewErrorState";

interface DevicePreviewProps {
  device: DeviceInstance;
  url: string | null;
  /** Increments on every submit / refresh-all so every preview reloads together. */
  runId: number;
  check: EmbedCheckState;
  /** Resolved visual scale for this device (from the workspace's fit calculation). */
  scale: number;
  compact: boolean;
  isInteracting?: boolean;
  isDragging?: boolean;
  isSyncExcluded?: boolean;
  isSyncActive?: boolean;
  onDragStart?: (e: React.PointerEvent) => void;
  onToggleSyncExclude?: (uid: string) => void;
  onRegisterSync?: (uid: string, iframe: HTMLIFrameElement) => () => void;
  onFrameSyncLoaded?: (uid: string) => void;
  onSyncNavigate?: (newUrl: string, isSpa?: boolean) => void;
  onScrollBy?: (driverUid: string, deltaX: number, deltaY: number) => void;
  /** Shared scroll-sync bus fallback */
  syncScrollBus?: SyncScrollBus;
  onRotate: (uid: string) => void;
  onZoom: (uid: string, zoom: ZoomMode) => void;
  onRemove: (uid: string) => void;
  onSwitchPreset: (uid: string, preset: DevicePreset) => void;
  onCustom: (uid: string) => void;
  /** Re-runs the shared header check (used when retrying check-based errors). */
  onRecheck: () => void;
}

const IFRAME_SANDBOX = [
  "allow-scripts",
  "allow-same-origin",
  "allow-forms",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
  "allow-modals",
  "allow-downloads",
  "allow-top-navigation-by-user-activation",
].join(" ");

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "preview";
}

export default function DevicePreview({
  device,
  url,
  runId,
  check,
  scale,
  compact,
  isInteracting = false,
  isDragging = false,
  isSyncExcluded = false,
  isSyncActive = true,
  onDragStart,
  onToggleSyncExclude,
  onRegisterSync,
  onFrameSyncLoaded,
  onSyncNavigate,
  onScrollBy,
  syncScrollBus,
  onRotate,
  onZoom,
  onRemove,
  onSwitchPreset,
  onCustom,
  onRecheck,
}: DevicePreviewProps) {
  const loader = usePreviewLoader({ url, runId, check, uid: device.uid });
  const frameRef = useRef<HTMLDivElement>(null);
  /** Actual <iframe> DOM element — kept in sync via callback ref. */
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Register this iframe with the sync engine when it mounts/unmounts.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !device.uid) return;
    if (onRegisterSync) {
      return onRegisterSync(device.uid, iframe);
    } else if (syncScrollBus) {
      return syncScrollBus.register(device.uid, iframe);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.uid, onRegisterSync, syncScrollBus, loader.src]);

  const [iconTurns, setIconTurns] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screen, setScreen] = useState<Size>({ w: 0, h: 0 });
  const [screenshotBusy, setScreenshotBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // The viewport the website sees never changes with zoom; only the painted size does.
  const size = effectiveSize(device);
  const activeScale = isFullscreen ? fullscreenScale(size, screen) : scale;
  const visualW = Math.round(size.w * activeScale);
  const visualH = Math.round(size.h * activeScale);
  const narrow = visualW < 240 || visualH < 220;
  const minColumn = compact ? MIN_COLUMN_WIDTH.compact : MIN_COLUMN_WIDTH.normal;

  const flash = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 4000);
  }, []);

  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );

  // Track browser full-screen state for this preview only.
  useEffect(() => {
    const update = () => {
      const active = document.fullscreenElement === frameRef.current && !!frameRef.current;
      setIsFullscreen(active);
      if (active) setScreen({ w: window.innerWidth, h: window.innerHeight });
    };
    document.addEventListener("fullscreenchange", update);
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("fullscreenchange", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    const element = frameRef.current;
    if (!element?.requestFullscreen) {
      flash("Full screen isn't supported here.");
      return;
    }
    element.requestFullscreen().catch(() => flash("Full screen was blocked by the browser."));
  }, [flash]);

  const openInNewTab = useCallback(() => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  const handleRetry = () => {
    const kind = loader.error?.kind;
    if (kind === "blocked" || kind === "unreachable") onRecheck();
    else loader.reload();
  };

  const handleScreenshot = async () => {
    if (!frameRef.current) return;
    setScreenshotBusy(true);
    try {
      const blob = await capturePreviewPng(frameRef.current);
      downloadBlob(blob, `${slugify(device.name)}-${size.w}x${size.h}.png`);
      flash("Screenshot saved.");
    } catch (error) {
      flash(error instanceof ScreenshotError ? error.message : "Screenshot failed.");
    } finally {
      setScreenshotBusy(false);
    }
  };

  const showSpinner = loader.status === "loading";

  const posX = device.position?.x ?? 0;
  const posY = device.position?.y ?? 0;

  return (
    <section
      aria-label={`${device.name} preview, ${size.w} by ${size.h}`}
      style={{
        width: Math.max(Math.round(size.w * scale), minColumn),
        position: "absolute",
        left: posX,
        top: posY,
      }}
      onWheel={(e) => {
        if (isSyncActive) {
          e.stopPropagation();
          if (onScrollBy) {
            onScrollBy(device.uid, e.deltaX, e.deltaY);
          } else if (syncScrollBus?.enabled) {
            syncScrollBus.scrollAllBy(device.uid, e.deltaX, e.deltaY);
          }
        }
      }}
      className={cn(
        "rounded-2xl transition-[box-shadow,transform] duration-150 select-none",
        isDragging
          ? "z-30 shadow-2xl ring-2 ring-accent scale-[1.01]"
          : "z-10 shadow-lg hover:shadow-xl",
      )}
    >
      <DeviceToolbar
        device={device}
        size={size}
        scale={activeScale}
        compact={compact}
        iconTurns={iconTurns}
        hasUrl={!!url}
        isFullscreen={isFullscreen}
        screenshotBusy={screenshotBusy}
        notice={notice}
        isDragging={isDragging}
        isSyncExcluded={isSyncExcluded}
        isSyncActive={isSyncActive}
        onToggleSyncExclude={onToggleSyncExclude ? () => onToggleSyncExclude(device.uid) : undefined}
        onDragStart={onDragStart}
        onRotate={() => {
          setIconTurns((t) => t + 1);
          onRotate(device.uid);
        }}
        onReload={loader.reload}
        onZoom={(zoom) => onZoom(device.uid, zoom)}
        onFullscreen={toggleFullscreen}
        onOpenInNewTab={openInNewTab}
        onScreenshot={handleScreenshot}
        onRemove={() => onRemove(device.uid)}
        onSwitchPreset={(preset) => onSwitchPreset(device.uid, preset)}
        onCustom={() => onCustom(device.uid)}
      />

      {/* Painted frame: its size is the *scaled* size of the simulated viewport. */}
      <div
        ref={frameRef}
        style={
          isFullscreen
            ? { width: "100%", height: "100%" }
            : { width: visualW, height: visualH }
        }
        className={cn(
          "relative overflow-hidden transition-[width,height] duration-200 ease-out",
          isFullscreen ? "bg-ws" : "rounded-xl shadow-lg ring-1 ring-line/80",
          !isFullscreen && (loader.status === "idle" || loader.status === "error")
            ? "bg-surface"
            : !isFullscreen && "bg-white",
        )}
      >
        {/* Simulated viewport: real CSS pixel size, visually scaled with a transform. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: isFullscreen ? Math.max(0, Math.round((screen.w - visualW) / 2)) : 0,
            width: size.w,
            height: size.h,
            transform: `scale(${activeScale})`,
            transformOrigin: "0 0",
            pointerEvents: isInteracting ? "none" : "auto",
          }}
          className="transition-[width,height,transform] duration-200 ease-out"
        >
          {loader.src ? (
            <iframe
              key={loader.frameKey}
              ref={(el) => { iframeRef.current = el; }}
              src={loader.src}
              title={`${device.name} (${size.w} × ${size.h}) preview of ${url ?? ""}`}
              sandbox={IFRAME_SANDBOX}
              allow="fullscreen; clipboard-write; autoplay; camera; microphone; picture-in-picture"
              referrerPolicy="no-referrer"
              onLoad={() => {
                loader.onLoad();
                if (onFrameSyncLoaded) {
                  onFrameSyncLoaded(device.uid);
                } else {
                  syncScrollBus?.onFrameLoaded(device.uid);
                }
              }}
              className={cn(
                "block h-full w-full border-0 bg-white",
                isInteracting && "pointer-events-none",
              )}
            />
          ) : null}
        </div>

        {/* Overlays live outside the scaled layer so they stay readable at any zoom. */}
        {loader.status === "idle" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-muted">
            <Globe size={narrow ? 18 : 26} aria-hidden />
            <p className={cn(narrow ? "text-2xs" : "text-xs")}>
              {narrow ? "Enter a URL" : "Enter a URL above and press Preview"}
            </p>
          </div>
        ) : null}

        {showSpinner ? (
          <div
            role="status"
            aria-label={`Loading ${device.name} preview`}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface/70"
          >
            <Loader2 size={narrow ? 18 : 24} className="rwp-spinner text-accent" aria-hidden />
          </div>
        ) : null}

        {loader.error ? (
          <div className="absolute inset-0">
            <PreviewErrorState
              error={loader.error}
              narrow={narrow}
              onRetry={handleRetry}
              onOpenInNewTab={openInNewTab}
              onTryAnyway={loader.tryAnyway}
            />
          </div>
        ) : null}

        {isFullscreen ? (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-black/85"
          >
            <Shrink size={14} aria-hidden /> Exit full screen (Esc)
          </button>
        ) : null}
      </div>
    </section>
  );
}
