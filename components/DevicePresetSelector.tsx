"use client";

import {
  Check,
  ChevronRight,
  Laptop,
  Monitor,
  Plus,
  SlidersHorizontal,
  Smartphone,
  Tablet,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  CATEGORY_LABELS,
  QUICK_DESKTOP_PRESETS,
  QUICK_LAPTOP_PRESETS,
  QUICK_TABLET_PRESETS,
} from "@/lib/devices";
import { cn } from "@/lib/cn";
import type { DeviceCategory, DevicePreset } from "@/lib/types";
import DeviceCatalogModal from "./DeviceCatalogModal";

interface DevicePresetSelectorProps {
  /** Content of the button that opens the menu. */
  children: ReactNode;
  /** Accessible name of the trigger button. */
  label: string;
  onSelect: (preset: DevicePreset) => void;
  onSelectMultiple?: (presets: DevicePreset[]) => void;
  onCustom: () => void;
  /** Preset id to mark as current (when switching an existing device). */
  currentPresetId?: string;
  triggerClassName?: string;
  /** When true, clicking trigger opens the full modal directly instead of dropdown */
  openCatalogDirectly?: boolean;
}

const CATEGORY_ICONS: Record<Exclude<DeviceCategory, "custom">, typeof Smartphone> = {
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Monitor,
};

const POPULAR_PHONES: DevicePreset[] = [
  { id: "apple-iphone-16-pro-max", name: "iPhone 16 Pro Max", category: "phone", width: 440, height: 956, dpr: 3 },
  { id: "apple-iphone-16", name: "iPhone 16", category: "phone", width: 393, height: 852, dpr: 3 },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", category: "phone", width: 393, height: 852, dpr: 3 },
  { id: "iphone-se", name: "iPhone SE", category: "phone", width: 375, height: 667, dpr: 2 },
  { id: "samsung-galaxy-s24-ultra", name: "Galaxy S24 Ultra", category: "phone", width: 412, height: 915, dpr: 3.5 },
  { id: "samsung-galaxy-s24", name: "Galaxy S24", category: "phone", width: 360, height: 780, dpr: 3 },
  { id: "samsung-galaxy-z-fold-6", name: "Galaxy Z Fold 6", category: "phone", width: 355, height: 882, dpr: 2.7 },
  { id: "google-pixel-9-pro-xl", name: "Pixel 9 Pro XL", category: "phone", width: 448, height: 998, dpr: 3 },
  { id: "google-pixel-9", name: "Pixel 9", category: "phone", width: 412, height: 925, dpr: 2.625 },
];

const QUICK_PRESETS_BY_CATEGORY: Record<Exclude<DeviceCategory, "custom">, DevicePreset[]> = {
  phone: POPULAR_PHONES,
  tablet: QUICK_TABLET_PRESETS,
  laptop: QUICK_LAPTOP_PRESETS,
  desktop: QUICK_DESKTOP_PRESETS,
};

const CATEGORY_ORDER = ["phone", "tablet", "laptop", "desktop"] as const;
const MENU_WIDTH = 280;

/**
 * Dropdown and Modal launcher for picking a device preset or exploring the full 235+ phone catalog.
 */
export default function DevicePresetSelector({
  children,
  label,
  onSelect,
  onSelectMultiple,
  onCustom,
  currentPresetId,
  triggerClassName,
  openCatalogDirectly = false,
}: DevicePresetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number; maxHeight: number }>({
    left: 0,
    top: 0,
    maxHeight: 450,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8));
    const top = rect.bottom + 6;
    setPosition({ left, top, maxHeight: Math.max(160, window.innerHeight - top - 12) });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onDismiss = () => setOpen(false);

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onDismiss);
    window.addEventListener("blur", onDismiss);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onDismiss);
      window.removeEventListener("blur", onDismiss);
    };
  }, [open]);

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const itemClass =
    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-fg hover:bg-surface2 focus-visible:bg-surface2 focus-visible:outline-none";

  const handleTriggerClick = () => {
    if (openCatalogDirectly) {
      setCatalogOpen(true);
    } else {
      setOpen((v) => !v);
    }
  };

  const menu = open ? (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={label}
      onKeyDown={onMenuKeyDown}
      style={{
        position: "fixed",
        left: position.left,
        top: position.top,
        width: MENU_WIDTH,
        maxHeight: position.maxHeight,
      }}
      className="scroll-thin z-50 overflow-y-auto rounded-lg border border-line bg-surface p-1.5 shadow-2xl"
    >
      {/* Prominent Button to open the full 235+ Smartphone Catalog */}
      <div className="mb-1.5 pb-1.5 border-b border-line">
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2 rounded-md bg-accent/15 px-2.5 py-2 text-left text-xs font-semibold text-accent hover:bg-accent/25 focus-visible:bg-accent/25 focus-visible:outline-none transition-colors"
          onClick={() => {
            close(false);
            setCatalogOpen(true);
          }}
        >
          <Smartphone size={15} className="shrink-0 text-accent" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs leading-tight">Browse 235+ Phones…</div>
            <div className="text-[10px] text-accent/80 font-normal">Samsung, Apple, Pixel, OnePlus & more</div>
          </div>
          <ChevronRight size={14} className="shrink-0 text-accent" />
        </button>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const Icon = CATEGORY_ICONS[category];
        const presets = QUICK_PRESETS_BY_CATEGORY[category];
        return (
          <div key={category} role="group" aria-label={CATEGORY_LABELS[category]} className="mb-1">
            <div className="flex items-center gap-1.5 px-2 py-1 text-2xs font-semibold uppercase tracking-wide text-muted">
              <Icon size={12} aria-hidden /> {CATEGORY_LABELS[category]}
            </div>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => {
                  onSelect(preset);
                  close(true);
                }}
              >
                <span className="flex w-3.5 justify-center shrink-0">
                  {preset.id === currentPresetId ? <Check size={12} aria-hidden /> : null}
                </span>
                <span className="flex-1 truncate">{preset.name}</span>
                <span className="tabular-nums text-2xs text-muted shrink-0">
                  {preset.width} × {preset.height}
                </span>
              </button>
            ))}
          </div>
        );
      })}

      <div className="mt-1 border-t border-line pt-1">
        <button
          type="button"
          role="menuitem"
          className={itemClass}
          onClick={() => {
            close(false);
            onCustom();
          }}
        >
          <span className="flex w-3.5 justify-center shrink-0">
            {currentPresetId === "custom" ? <Check size={12} aria-hidden /> : null}
          </span>
          <SlidersHorizontal size={12} aria-hidden />
          <span className="flex-1">Custom viewport…</span>
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open || catalogOpen}
        aria-controls={open ? menuId : undefined}
        onClick={handleTriggerClick}
        className={cn(triggerClassName)}
      >
        {children}
      </button>

      {menu ? createPortal(menu, document.body) : null}

      {/* Full comprehensive Smartphone Catalog modal */}
      <DeviceCatalogModal
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onSelectPreset={onSelect}
        onSelectMultiplePresets={onSelectMultiple}
        onCustomViewport={onCustom}
        currentPresetId={currentPresetId}
      />
    </>
  );
}
