"use client";

import {
  Globe,
  Maximize,
  Moon,
  Plus,
  RefreshCw,
  RotateCcw,
  Shrink,
  Expand,
  Sun,
} from "lucide-react";
import { useId, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { SyncMode } from "@/lib/sync/types";
import type { DevicePreset, Theme } from "@/lib/types";
import DevicePresetSelector from "./DevicePresetSelector";
import { IconButton } from "./IconButton";
import SyncToolbar from "./SyncToolbar";

interface URLToolbarProps {
  value: string;
  error: string | null;
  /** Shown when the typed address was auto-completed (e.g. https:// added). */
  hint: string | null;
  hasPreview: boolean;
  theme: Theme;
  compact: boolean;
  syncMode?: SyncMode;
  totalDevices?: number;
  excludedCount?: number;
  onSetSyncMode?: (mode: SyncMode) => void;
  onResetSync?: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onRefreshAll: () => void;
  onFitAll: () => void;
  onResetLayout: () => void;
  onToggleTheme: () => void;
  onToggleCompact: () => void;
  onAddPreset: (preset: DevicePreset) => void;
  onAddCustom: () => void;
}

export default function URLToolbar({
  value,
  error,
  hint,
  hasPreview,
  theme,
  compact,
  syncMode,
  totalDevices,
  excludedCount,
  onSetSyncMode,
  onResetSync,
  onChange,
  onSubmit,
  onRefreshAll,
  onFitAll,
  onResetLayout,
  onToggleTheme,
  onToggleCompact,
  onAddPreset,
  onAddCustom,
}: URLToolbarProps) {
  const inputId = useId();
  const messageId = useId();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const message = error ?? hint;

  return (
    <header
      className={cn(
        "relative z-20 flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-line bg-surface",
        compact ? "px-2 py-1" : "px-3 py-2",
      )}
    >
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Website address"
        className="flex min-w-[240px] flex-[1_1_360px] items-center gap-1.5"
      >
        <a
          href="/"
          title="Return to Responsivelyonline Landing Page"
          className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-fg hover:bg-surface2 transition-colors mr-0.5"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#11172B] text-white text-[11px] font-black group-hover:scale-105 transition-transform">
            R
          </span>
          <span className="hidden md:inline font-bold tracking-tight text-fg">
            Responsively<span className="text-[#079B73]">.online</span>
          </span>
        </a>

        <IconButton
          label="Refresh all previews"
          onClick={onRefreshAll}
          disabled={!hasPreview}
          className="h-8 w-8"
        >
          <RefreshCw size={16} aria-hidden />
        </IconButton>

        <div className="relative min-w-0 flex-1">
          <label htmlFor={inputId} className="sr-only">
            Website URL
          </label>
          <Globe
            size={14}
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id={inputId}
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://example.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            className={cn(
              "h-8 w-full rounded-full border bg-ws pl-8 pr-3 text-sm text-fg placeholder:text-muted/70",
              error ? "border-danger" : "border-line focus:border-accent",
            )}
          />
        </div>

        <button
          type="submit"
          className="h-8 shrink-0 rounded-md bg-accent px-3.5 text-xs font-semibold text-accent-fg transition-colors hover:bg-accent/90"
        >
          Preview
        </button>
      </form>

      {/* Synchronized Browsing Controls */}
      {hasPreview && onSetSyncMode && (
        <div className="flex items-center">
          <SyncToolbar
            mode={syncMode ?? "all"}
            totalDevices={totalDevices ?? 0}
            excludedCount={excludedCount ?? 0}
            onSetMode={onSetSyncMode}
            onResetSync={onResetSync ?? (() => {})}
          />
          <div className="mx-1 h-5 w-px bg-line/60" />
        </div>
      )}

      <div className="flex items-center gap-0.5" role="group" aria-label="Workspace controls">
        <DevicePresetSelector
          label="Add device"
          onSelect={onAddPreset}
          onCustom={onAddCustom}
          triggerClassName="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted transition-colors hover:bg-surface2 hover:text-fg"
        >
          <Plus size={15} aria-hidden />
          <span className="hidden sm:inline">Add device</span>
        </DevicePresetSelector>
        <IconButton label="Zoom all previews to fit" onClick={onFitAll} className="h-8 w-8">
          <Maximize size={16} aria-hidden />
        </IconButton>
        <IconButton label="Reset layout to default devices" onClick={onResetLayout} className="h-8 w-8">
          <RotateCcw size={16} aria-hidden />
        </IconButton>
        <IconButton
          label={compact ? "Switch to comfortable layout" : "Switch to compact layout"}
          active={compact}
          onClick={onToggleCompact}
          className="h-8 w-8"
        >
          {compact ? <Expand size={16} aria-hidden /> : <Shrink size={16} aria-hidden />}
        </IconButton>
        <IconButton
          label={theme === "dark" ? "Switch to light workspace" : "Switch to dark workspace"}
          onClick={onToggleTheme}
          className="h-8 w-8"
        >
          {theme === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
        </IconButton>
      </div>

      {message ? (
        <p
          id={messageId}
          role={error ? "alert" : "status"}
          className={cn(
            "basis-full px-1 text-2xs",
            error ? "text-danger" : "text-muted",
          )}
        >
          {message}
        </p>
      ) : null}
    </header>
  );
}
