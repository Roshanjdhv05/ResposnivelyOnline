"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Accessible name; also used as the tooltip. */
  label: string;
  children: ReactNode;
  /** When defined, renders a toggle button (aria-pressed). */
  active?: boolean;
  danger?: boolean;
  size?: "sm" | "md";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, active, danger, size = "md", className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md text-muted transition-colors",
        "hover:bg-surface2 hover:text-fg disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "h-6 w-6" : "h-7 w-7",
        active && "bg-surface2 text-fg",
        danger && "hover:bg-danger/15 hover:text-danger",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
