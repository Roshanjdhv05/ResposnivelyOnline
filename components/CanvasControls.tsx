"use client";

import {
  Compass,
  Expand,
  Grid,
  Hand,
  Layers,
  LayoutDashboard,
  Link,
  Link2Off,
  Maximize2,
  Minimize2,
  MousePointer,
  RotateCcw,
  Rows,
  Sparkles,
  Columns,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/preview-engine";
import { IconButton } from "./IconButton";

interface CanvasControlsProps {
  zoom: number;
  isPanMode: boolean;
  waveEnabled: boolean;
  minimapOpen: boolean;
  syncScrollEnabled: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomSelect: (zoom: number) => void;
  onFitAll: () => void;
  onResetView: () => void;
  onTogglePanMode: () => void;
  onToggleWave: () => void;
  onToggleMinimap: () => void;
  onToggleSyncScroll: () => void;
  onArrange: (mode: "showcase" | "horizontal" | "grid" | "vertical") => void;
}

const ZOOM_OPTIONS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function CanvasControls({
  zoom,
  isPanMode,
  waveEnabled,
  minimapOpen,
  syncScrollEnabled,
  onZoomIn,
  onZoomOut,
  onZoomSelect,
  onFitAll,
  onResetView,
  onTogglePanMode,
  onToggleWave,
  onToggleMinimap,
  onToggleSyncScroll,
  onArrange,
}: CanvasControlsProps) {
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  const [arrangeMenuOpen, setArrangeMenuOpen] = useState(false);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <>
      {/* Top-Right Floating Zoom Pill (Matches user reference image: [ - ] 100% [ + ] [ ⛶ ]) */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-1 rounded-xl border border-line/80 bg-surface/90 p-1 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom out (Ctrl + -)"
          aria-label="Zoom out"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-fg active:scale-95"
        >
          <ZoomOut size={14} aria-hidden />
        </button>

        {/* Zoom percentage button with dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setZoomMenuOpen(!zoomMenuOpen);
              setArrangeMenuOpen(false);
            }}
            title="Choose zoom level"
            aria-label={`Zoom level ${zoomPercent}%`}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-semibold tabular-nums text-fg hover:bg-surface2"
          >
            <span>{zoomPercent}%</span>
            <ChevronDown size={11} className="text-muted" aria-hidden />
          </button>

          {zoomMenuOpen ? (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setZoomMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1.5 w-32 rounded-xl border border-line bg-surface p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
                {ZOOM_OPTIONS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onZoomSelect(val);
                      setZoomMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                      Math.abs(zoom - val) < 0.02
                        ? "bg-accent text-accent-fg"
                        : "text-fg hover:bg-surface2",
                    )}
                  >
                    <span>{Math.round(val * 100)}%</span>
                  </button>
                ))}
                <div className="my-1 border-t border-line/60" />
                <button
                  type="button"
                  onClick={() => {
                    onFitAll();
                    setZoomMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted hover:bg-surface2 hover:text-fg"
                >
                  <Maximize2 size={13} />
                  <span>Fit all</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetView();
                    setZoomMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted hover:bg-surface2 hover:text-fg"
                >
                  <RotateCcw size={13} />
                  <span>Reset (100%)</span>
                </button>
              </div>
            </>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom in (Ctrl + +)"
          aria-label="Zoom in"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-fg active:scale-95"
        >
          <ZoomIn size={14} aria-hidden />
        </button>

        <div className="mx-0.5 h-4 w-px bg-line/60" />

        <button
          type="button"
          onClick={onFitAll}
          title="Fit all artboards into view"
          aria-label="Fit all artboards"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-fg"
        >
          <Maximize2 size={13} aria-hidden />
        </button>
      </div>

      {/* Bottom Floating Canvas Toolbar (Dock) */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-line/80 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md">
        {/* Move / Select Tool */}
        <button
          type="button"
          onClick={() => isPanMode && onTogglePanMode()}
          title="Select & Move tool (V) - Drag screens to reposition"
          aria-label="Select and move tool"
          aria-pressed={!isPanMode}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
            !isPanMode
              ? "bg-accent text-accent-fg shadow-sm"
              : "text-muted hover:bg-surface2 hover:text-fg",
          )}
        >
          <MousePointer size={15} aria-hidden />
        </button>

        {/* Hand / Pan Tool */}
        <button
          type="button"
          onClick={onTogglePanMode}
          title="Hand tool (H or Space+drag) - Pan canvas freely"
          aria-label="Hand pan tool"
          aria-pressed={isPanMode}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
            isPanMode
              ? "bg-accent text-accent-fg shadow-sm"
              : "text-muted hover:bg-surface2 hover:text-fg",
          )}
        >
          <Hand size={15} aria-hidden />
        </button>

        <div className="mx-1 h-5 w-px bg-line/60" />

        {/* Zoom Out */}
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-surface2 hover:text-fg active:scale-95"
        >
          <ZoomOut size={15} aria-hidden />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-surface2 hover:text-fg active:scale-95"
        >
          <ZoomIn size={15} aria-hidden />
        </button>

        {/* Fit to View */}
        <button
          type="button"
          onClick={onFitAll}
          title="Fit all artboards to view"
          aria-label="Fit all"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-surface2 hover:text-fg"
        >
          <Maximize2 size={15} aria-hidden />
        </button>

        <div className="mx-1 h-5 w-px bg-line/60" />

        {/* Arrange Layout dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setArrangeMenuOpen(!arrangeMenuOpen);
              setZoomMenuOpen(false);
            }}
            title="Auto-arrange artboards"
            aria-label="Auto-arrange artboards"
            className="flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-muted transition-colors hover:bg-surface2 hover:text-fg"
          >
            <Layers size={14} aria-hidden />
            <span className="hidden sm:inline">Arrange</span>
            <ChevronDown size={11} aria-hidden />
          </button>

          {arrangeMenuOpen ? (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setArrangeMenuOpen(false)}
              />
              <div className="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-xl border border-line bg-surface p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-2xs font-semibold text-muted uppercase tracking-wider">
                  Layout Arrangements
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onArrange("showcase");
                    setArrangeMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-fg hover:bg-surface2"
                >
                  <LayoutDashboard size={14} className="text-accent" />
                  <span>Showcase Layout</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onArrange("horizontal");
                    setArrangeMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-fg hover:bg-surface2"
                >
                  <Rows size={14} className="text-accent" />
                  <span>Horizontal Row</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onArrange("grid");
                    setArrangeMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-fg hover:bg-surface2"
                >
                  <Grid size={14} className="text-accent" />
                  <span>2×2 Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onArrange("vertical");
                    setArrangeMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-fg hover:bg-surface2"
                >
                  <Columns size={14} className="text-accent" />
                  <span>Vertical Stack</span>
                </button>
              </div>
            </>
          ) : null}
        </div>

        {/* Sync Scroll Toggle */}
        <button
          type="button"
          onClick={onToggleSyncScroll}
          title={syncScrollEnabled ? "Scroll sync ON — all screens scroll together (click to disable)" : "Scroll sync OFF — screens scroll independently (click to enable)"}
          aria-label="Toggle synchronized scroll across all previews"
          aria-pressed={syncScrollEnabled}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-xl px-2 text-xs font-medium transition-all",
            syncScrollEnabled
              ? "text-accent hover:bg-accent/15"
              : "text-muted hover:bg-surface2 hover:text-fg opacity-60",
          )}
        >
          {syncScrollEnabled ? <Link size={14} aria-hidden /> : <Link2Off size={14} aria-hidden />}
          <span className="hidden sm:inline">{syncScrollEnabled ? "Sync" : "No Sync"}</span>
        </button>

        {/* Wave Animation Toggle */}
        <button
          type="button"
          onClick={onToggleWave}
          title={waveEnabled ? "Wave animation enabled (click to pause)" : "Wave animation paused (click to enable)"}
          aria-label="Toggle animated dot wave"
          aria-pressed={waveEnabled}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
            waveEnabled
              ? "text-accent hover:bg-accent/15"
              : "text-muted hover:bg-surface2 hover:text-fg opacity-60",
          )}
        >
          <Sparkles size={15} aria-hidden />
        </button>

        {/* Minimap toggle */}
        <button
          type="button"
          onClick={onToggleMinimap}
          title="Toggle Canvas Minimap"
          aria-label="Toggle Canvas Minimap"
          aria-pressed={minimapOpen}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
            minimapOpen
              ? "text-accent hover:bg-accent/15"
              : "text-muted hover:bg-surface2 hover:text-fg",
          )}
        >
          <Compass size={15} aria-hidden />
        </button>
      </div>
    </>
  );
}
