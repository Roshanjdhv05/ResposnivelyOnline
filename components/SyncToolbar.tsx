"use client";

import {
  Check,
  ChevronDown,
  Info,
  Link as LinkIcon,
  Link2Off,
  MousePointerClick,
  RotateCcw,
  Scroll,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { SyncMode } from "@/lib/sync/types";

interface SyncToolbarProps {
  mode: SyncMode;
  totalDevices: number;
  excludedCount: number;
  onSetMode: (mode: SyncMode) => void;
  onResetSync: () => void;
}

export default function SyncToolbar({
  mode,
  totalDevices,
  excludedCount,
  onSetMode,
  onResetSync,
}: SyncToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const syncedCount = Math.max(0, totalDevices - excludedCount);
  const isSyncActive = mode !== "disabled";

  return (
    <div className="relative flex items-center gap-1">
      {/* Primary Toggle: Sync Interactions */}
      <button
        type="button"
        onClick={() => onSetMode(isSyncActive ? "disabled" : "all")}
        aria-pressed={isSyncActive}
        title={
          isSyncActive
            ? "Sync Interactions ON — clicks, scroll, forms and navigation mirror across devices"
            : "Sync Interactions OFF — devices browse independently"
        }
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all",
          isSyncActive
            ? "bg-accent/20 text-accent ring-1 ring-accent/40 shadow-sm hover:bg-accent/30"
            : "bg-surface2/60 text-muted hover:bg-surface2 hover:text-fg",
        )}
      >
        {isSyncActive ? (
          <LinkIcon size={14} className="text-accent animate-pulse" aria-hidden />
        ) : (
          <Link2Off size={14} aria-hidden />
        )}
        <span>Sync Interactions</span>
        {isSyncActive && totalDevices > 0 && (
          <span className="ml-0.5 rounded-full bg-accent/20 px-1.5 py-0.2 text-[10px] font-bold text-accent tabular-nums">
            {syncedCount}/{totalDevices}
          </span>
        )}
      </button>

      {/* Mode Selector Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setInfoOpen(false);
          }}
          title="Choose synchronization mode"
          aria-label="Synchronization mode"
          className={cn(
            "flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors hover:bg-surface2",
            isSyncActive ? "text-fg" : "text-muted",
          )}
        >
          <span className="hidden md:inline">
            {mode === "all"
              ? "All Interactions"
              : mode === "scroll-only"
                ? "Scroll Only"
                : "Disabled"}
          </span>
          <ChevronDown size={12} className="text-muted" aria-hidden />
        </button>

        {menuOpen ? (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
              <div className="px-2 py-1 text-2xs font-bold tracking-wider text-muted uppercase">
                Synchronization Mode
              </div>

              {/* Mode: All Interactions */}
              <button
                type="button"
                onClick={() => {
                  onSetMode("all");
                  setMenuOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg p-2 text-left text-xs transition-colors hover:bg-surface2",
                  mode === "all" ? "bg-accent/15 text-accent" : "text-fg",
                )}
              >
                <MousePointerClick size={16} className="mt-0.5 shrink-0 text-accent" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Sync All Interactions</span>
                    {mode === "all" && <Check size={14} className="text-accent" />}
                  </div>
                  <p className="text-2xs text-muted">
                    Scroll, clicks, links, inputs, selects, tabs and modals mirror simultaneously.
                  </p>
                </div>
              </button>

              {/* Mode: Scroll Only */}
              <button
                type="button"
                onClick={() => {
                  onSetMode("scroll-only");
                  setMenuOpen(false);
                }}
                className={cn(
                  "mt-1 flex w-full items-start gap-2.5 rounded-lg p-2 text-left text-xs transition-colors hover:bg-surface2",
                  mode === "scroll-only" ? "bg-accent/15 text-accent" : "text-fg",
                )}
              >
                <Scroll size={16} className="mt-0.5 shrink-0 text-accent" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Sync Scroll Only</span>
                    {mode === "scroll-only" && <Check size={14} className="text-accent" />}
                  </div>
                  <p className="text-2xs text-muted">
                    Mirror vertical and horizontal scrolling without synchronizing clicks or form inputs.
                  </p>
                </div>
              </button>

              {/* Mode: Disabled */}
              <button
                type="button"
                onClick={() => {
                  onSetMode("disabled");
                  setMenuOpen(false);
                }}
                className={cn(
                  "mt-1 flex w-full items-start gap-2.5 rounded-lg p-2 text-left text-xs transition-colors hover:bg-surface2",
                  mode === "disabled" ? "bg-accent/15 text-accent" : "text-fg",
                )}
              >
                <Link2Off size={16} className="mt-0.5 shrink-0 text-muted" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Independent Browsing</span>
                    {mode === "disabled" && <Check size={14} className="text-accent" />}
                  </div>
                  <p className="text-2xs text-muted">
                    Interact with each device completely independently.
                  </p>
                </div>
              </button>
            </div>
          </>
        ) : null}
      </div>

      {/* Reset Sync State Button */}
      <button
        type="button"
        onClick={onResetSync}
        title="Reset synchronization state (scroll all to top, clear locks)"
        aria-label="Reset synchronization"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-fg active:scale-95"
      >
        <RotateCcw size={14} aria-hidden />
      </button>

      {/* Info / Limitations Modal Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setInfoOpen(!infoOpen);
            setMenuOpen(false);
          }}
          title="About synchronization & iframe limitations"
          aria-label="About synchronization"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-fg"
        >
          <Info size={14} aria-hidden />
        </button>

        {infoOpen ? (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setInfoOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1.5 w-80 rounded-xl border border-line bg-surface p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-fg">
                <LinkIcon size={14} className="text-accent" />
                <span>Synchronized Browsing Engine</span>
              </div>
              <div className="mt-2 space-y-2 text-2xs leading-relaxed text-muted">
                <div className="rounded-lg bg-surface2/60 p-2">
                  <span className="font-semibold text-fg">Mode A — Full Synchronization:</span>
                  <p className="mt-0.5">
                    Websites previewed via proxy or integrating the bridge script (<code className="text-accent">/sync-bridge.js</code>) support normalized scrolling, smart click mapping, forms, tabs, and navigation.
                  </p>
                </div>
                <div className="rounded-lg bg-surface2/60 p-2">
                  <span className="font-semibold text-fg">Mode B — Best-Effort Mode:</span>
                  <p className="mt-0.5">
                    For strict cross-origin third-party domains, browser security restrictions prevent inspecting internal DOM elements. Only authorized scroll and viewport directives apply.
                  </p>
                </div>
                <div className="rounded-lg bg-surface2/60 p-2">
                  <span className="font-semibold text-fg">Individual Device Exclusion:</span>
                  <p className="mt-0.5">
                    Click the link icon on any device frame header to exclude or include it from synchronization at any time.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
