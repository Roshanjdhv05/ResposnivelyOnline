"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { VIEWPORT_LIMITS } from "@/lib/devices";

export interface CustomViewportValues {
  name: string;
  width: number;
  height: number;
}

interface CustomViewportDialogProps {
  open: boolean;
  title: string;
  submitLabel: string;
  initial?: Partial<CustomViewportValues>;
  onSubmit: (values: CustomViewportValues) => void;
  onClose: () => void;
}

function parseDimension(raw: string): number | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  const value = Number(raw);
  return value >= VIEWPORT_LIMITS.min && value <= VIEWPORT_LIMITS.max ? value : null;
}

export default function CustomViewportDialog(props: CustomViewportDialogProps) {
  // Re-mount the form each time the dialog opens so fields reset to their initial values.
  if (!props.open) return null;
  return <DialogBody {...props} />;
}

function DialogBody({
  title,
  submitLabel,
  initial,
  onSubmit,
  onClose,
}: CustomViewportDialogProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [width, setWidth] = useState(String(initial?.width ?? 1024));
  const [height, setHeight] = useState(String(initial?.height ?? 768));
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const titleId = useId();
  const errorId = useId();

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    widthRef.current?.focus();
    widthRef.current?.select();
    return () => {
      if (previouslyFocused.current instanceof HTMLElement) previouslyFocused.current.focus();
    };
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const w = parseDimension(width);
    const h = parseDimension(height);
    if (w === null || h === null) {
      setError(
        `Width and height must be whole numbers between ${VIEWPORT_LIMITS.min} and ${VIEWPORT_LIMITS.max}.`,
      );
      return;
    }
    onSubmit({ name: name.trim() || `Custom ${w} × ${h}`, width: w, height: h });
  };

  // Keep keyboard focus inside the dialog and close on Escape.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, input, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const field =
    "w-full rounded-md border border-line bg-surface2 px-2.5 py-1.5 text-sm text-fg placeholder:text-muted focus:border-accent";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id={titleId} className="text-sm font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-muted hover:bg-surface2 hover:text-fg"
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <label className="block text-xs font-medium text-muted">
            Name (optional)
            <input
              type="text"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Client kiosk"
              className={`${field} mt-1`}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-muted">
              Width (px)
              <input
                ref={widthRef}
                type="text"
                inputMode="numeric"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                  setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`${field} mt-1 tabular-nums`}
              />
            </label>
            <label className="block text-xs font-medium text-muted">
              Height (px)
              <input
                type="text"
                inputMode="numeric"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`${field} mt-1 tabular-nums`}
              />
            </label>
          </div>

          {error ? (
            <p id={errorId} role="alert" className="text-xs text-danger">
              {error}
            </p>
          ) : (
            <p className="text-2xs text-muted">
              These are the CSS viewport dimensions the website will see.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-line px-3 py-1.5 text-xs font-medium hover:bg-surface2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent/90"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
