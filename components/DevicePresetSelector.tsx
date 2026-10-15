"use client";

import { Check, Laptop, Monitor, Smartphone, SlidersHorizontal, Tablet } from "lucide-react";
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
import { CATEGORY_LABELS, DEVICE_PRESETS } from "@/lib/devices";
import { cn } from "@/lib/cn";
import type { DeviceCategory, DevicePreset } from "@/lib/types";

interface DevicePresetSelectorProps {
  /** Content of the button that opens the menu. */
  children: ReactNode;
  /** Accessible name of the trigger button. */
  label: string;
  onSelect: (preset: DevicePreset) => void;
  onCustom: () => void;
  /** Preset id to mark as current (when switching an existing device). */
  currentPresetId?: string;
  triggerClassName?: string;
}

const CATEGORY_ICONS: Record<Exclude<DeviceCategory, "custom">, typeof Smartphone> = {
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Monitor,
};

const CATEGORY_ORDER = ["phone", "tablet", "laptop", "desktop"] as const;
const MENU_WIDTH = 264;

/**
 * Dropdown for picking a device preset (or the custom-viewport option). The menu is rendered in a
 * portal with fixed positioning so it is never clipped by the scrolling workspace.
 */
export default function DevicePresetSelector({
  children,
  label,
  onSelect,
  onCustom,
  currentPresetId,
  triggerClassName,
}: DevicePresetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number; maxHeight: number }>({
    left: 0,
    top: 0,
    maxHeight: 400,
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
      {CATEGORY_ORDER.map((category) => {
        const Icon = CATEGORY_ICONS[category];
        const presets = DEVICE_PRESETS.filter((p) => p.category === category);
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
                <span className="flex w-3.5 justify-center">
                  {preset.id === currentPresetId ? <Check size={12} aria-hidden /> : null}
                </span>
                <span className="flex-1 truncate">{preset.name}</span>
                <span className="tabular-nums text-2xs text-muted">
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
          <span className="flex w-3.5 justify-center">
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
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(triggerClassName)}
      >
        {children}
      </button>
      {menu ? createPortal(menu, document.body) : null}
    </>
  );
}
