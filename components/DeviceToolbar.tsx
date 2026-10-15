"use client";

import {
  Camera,
  ChevronDown,
  Expand,
  ExternalLink,
  GripVertical,
  Link as LinkIcon,
  Link2Off,
  RefreshCw,
  RotateCw,
  Shrink,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CATEGORY_LABELS } from "@/lib/devices";
import {
  TOOLBAR_HEIGHT,
  ZOOM_PRESETS,
  canRotate,
  describeSize,
  formatPercent,
  orientationOf,
} from "@/lib/preview-engine";
import type { DeviceInstance, DevicePreset, Size, ZoomMode } from "@/lib/types";
import DevicePresetSelector from "./DevicePresetSelector";
import { IconButton } from "./IconButton";

interface DeviceToolbarProps {
  device: DeviceInstance;
  size: Size;
  scale: number;
  compact: boolean;
  /** Number of quarter turns applied to the rotate icon (purely visual feedback). */
  iconTurns: number;
  hasUrl: boolean;
  isFullscreen: boolean;
  screenshotBusy: boolean;
  notice: string | null;
  isDragging?: boolean;
  isSyncExcluded?: boolean;
  isSyncActive?: boolean;
  onToggleSyncExclude?: () => void;
  onDragStart?: (e: React.PointerEvent) => void;
  onRotate: () => void;
  onReload: () => void;
  onZoom: (zoom: ZoomMode) => void;
  onFullscreen: () => void;
  onOpenInNewTab: () => void;
  onScreenshot: () => void;
  onRemove: () => void;
  onSwitchPreset: (preset: DevicePreset) => void;
  onCustom: () => void;
}

export default function DeviceToolbar({
  device,
  size,
  scale,
  compact,
  iconTurns,
  hasUrl,
  isFullscreen,
  screenshotBusy,
  notice,
  isDragging,
  isSyncExcluded = false,
  isSyncActive = true,
  onToggleSyncExclude,
  onDragStart,
  onRotate,
  onReload,
  onZoom,
  onFullscreen,
  onOpenInNewTab,
  onScreenshot,
  onRemove,
  onSwitchPreset,
  onCustom,
}: DeviceToolbarProps) {
  const iconSize = compact ? 14 : 15;
  const btnSize = compact ? "sm" : "md";
  const orientation = orientationOf(device);

  return (
    <div
      role="toolbar"
      aria-label={`${device.name} controls`}
      style={{ height: compact ? TOOLBAR_HEIGHT.compact : TOOLBAR_HEIGHT.normal }}
      className="flex flex-col justify-center gap-0.5 overflow-hidden"
    >
      {/* Row 1: drag handle, category badge, name, dimensions, current scale, sync indicator */}
      <div
        onPointerDown={onDragStart}
        className={cn(
          "flex min-w-0 items-center gap-1.5 px-1 py-0.5 select-none rounded cursor-grab active:cursor-grabbing hover:bg-surface2/60 transition-colors",
          isDragging && "cursor-grabbing bg-surface2/80 ring-1 ring-accent/40",
        )}
        title="Drag header to move artboard anywhere on canvas"
      >
        <div
          className="flex shrink-0 items-center text-muted/70 hover:text-fg"
          aria-hidden
        >
          <GripVertical size={13} />
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-accent/90 uppercase tracking-wide">
          {device.category === "phone" ? "Mobile" : device.category === "tablet" ? "Tablet" : device.category === "laptop" ? "Laptop" : device.category === "desktop" ? "Desktop" : "Custom"}
        </span>
        <span className="text-muted/40">·</span>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <DevicePresetSelector
            label={`Change device (currently ${device.name})`}
            currentPresetId={device.presetId}
            onSelect={onSwitchPreset}
            onCustom={onCustom}
            triggerClassName="group flex min-w-0 items-center gap-0.5 rounded px-1 py-0.5 text-xs font-semibold text-fg hover:bg-surface2"
          >
            <span className="truncate max-w-[130px]">{device.name}</span>
            <ChevronDown size={12} className="shrink-0 text-muted group-hover:text-fg" aria-hidden />
          </DevicePresetSelector>
        </div>
        <span
          className="shrink-0 text-2xs tabular-nums text-muted"
          title={`${CATEGORY_LABELS[device.category]} · ${orientation}`}
        >
          {describeSize(size)}
        </span>
        <span className="shrink-0 text-2xs tabular-nums text-muted/70" aria-label="Current zoom">
          · {formatPercent(scale)}
        </span>

        {/* Sync Indicator */}
        {hasUrl && isSyncActive && onToggleSyncExclude && (
          <div onPointerDown={(e) => e.stopPropagation()} className="shrink-0">
            {!isSyncExcluded ? (
              <button
                type="button"
                onClick={onToggleSyncExclude}
                title="Synchronized with other previews. Click to exclude this device."
                className="flex items-center gap-1 rounded bg-emerald-500/10 px-1 py-0.5 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Synced</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleSyncExclude}
                title="Excluded from synchronization. Click to include this device."
                className="flex items-center gap-1 rounded bg-surface2/80 px-1 py-0.5 text-[10px] font-medium text-muted hover:bg-surface2 hover:text-fg"
              >
                <Link2Off size={10} />
                <span className="hidden sm:inline">Excluded</span>
              </button>
            )}
          </div>
        )}

        <span
          aria-live="polite"
          className={cn(
            "ml-auto min-w-0 truncate text-2xs text-accent",
            !notice && "sr-only",
          )}
        >
          {notice}
        </span>
      </div>

      {/* Row 2: actions */}
      <div
        className="flex items-center gap-0.5"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {canRotate(device) ? (
          <IconButton
            size={btnSize}
            label={`Rotate to ${orientation === "portrait" ? "landscape" : "portrait"}`}
            onClick={onRotate}
          >
            <RotateCw
              size={iconSize}
              aria-hidden
              style={{
                transform: `rotate(${iconTurns * 90}deg)`,
                transition: "transform 300ms ease-out",
              }}
            />
          </IconButton>
        ) : null}

        {hasUrl && isSyncActive && onToggleSyncExclude ? (
          <IconButton
            size={btnSize}
            label={isSyncExcluded ? "Include in synchronization" : "Exclude from synchronization"}
            onClick={onToggleSyncExclude}
            active={!isSyncExcluded}
          >
            {!isSyncExcluded ? (
              <LinkIcon size={iconSize} className="text-emerald-400" aria-hidden />
            ) : (
              <Link2Off size={iconSize} className="text-muted" aria-hidden />
            )}
          </IconButton>
        ) : null}

        <IconButton size={btnSize} label="Reload this preview" onClick={onReload} disabled={!hasUrl}>
          <RefreshCw size={iconSize} aria-hidden />
        </IconButton>

        <div
          role="group"
          aria-label="Zoom"
          className="mx-0.5 flex items-center rounded-md border border-line p-0.5"
        >
          {ZOOM_PRESETS.map((zoom) => (
            <button
              key={zoom}
              type="button"
              aria-pressed={device.zoom === zoom}
              aria-label={`Zoom ${zoom}%`}
              title={`Zoom ${zoom}%`}
              onClick={() => onZoom(zoom)}
              className={cn(
                "rounded px-1 text-2xs font-medium tabular-nums transition-colors",
                compact ? "h-4" : "h-5",
                device.zoom === zoom
                  ? "bg-accent text-accent-fg"
                  : "text-muted hover:bg-surface2 hover:text-fg",
              )}
            >
              {zoom}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={device.zoom === "fit"}
            aria-label="Zoom to fit"
            title="Zoom to fit"
            onClick={() => onZoom("fit")}
            className={cn(
              "rounded px-1 text-2xs font-medium transition-colors",
              compact ? "h-4" : "h-5",
              device.zoom === "fit"
                ? "bg-accent text-accent-fg"
                : "text-muted hover:bg-surface2 hover:text-fg",
            )}
          >
            Fit
          </button>
        </div>

        <IconButton
          size={btnSize}
          label={isFullscreen ? "Exit full screen" : "Full-screen preview"}
          onClick={onFullscreen}
          disabled={!hasUrl}
        >
          {isFullscreen ? <Shrink size={iconSize} aria-hidden /> : <Expand size={iconSize} aria-hidden />}
        </IconButton>
        <IconButton size={btnSize} label="Open website in a new tab" onClick={onOpenInNewTab} disabled={!hasUrl}>
          <ExternalLink size={iconSize} aria-hidden />
        </IconButton>
        <IconButton
          size={btnSize}
          label={screenshotBusy ? "Capturing screenshot…" : "Capture screenshot"}
          onClick={onScreenshot}
          disabled={!hasUrl || screenshotBusy}
        >
          <Camera size={iconSize} aria-hidden />
        </IconButton>
        <IconButton size={btnSize} label={`Remove ${device.name}`} onClick={onRemove} danger className="ml-auto">
          <X size={iconSize} aria-hidden />
        </IconButton>
      </div>
    </div>
  );
}
