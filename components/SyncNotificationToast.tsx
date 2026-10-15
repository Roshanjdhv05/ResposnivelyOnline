"use client";

import { AlertCircle, Info, X } from "lucide-react";
import type { SyncNotification } from "@/lib/sync/types";

interface SyncNotificationToastProps {
  notifications: SyncNotification[];
  onDismiss: (id: string) => void;
}

export default function SyncNotificationToast({
  notifications,
  onDismiss,
}: SyncNotificationToastProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-16 right-6 z-50 flex max-w-sm flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-line bg-surface/95 p-2.5 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200"
          role="status"
        >
          {n.type === "warning" || n.type === "error" ? (
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-400" />
          ) : (
            <Info size={15} className="mt-0.5 shrink-0 text-accent" />
          )}

          <div className="flex-1 text-xs">
            {n.deviceName && (
              <span className="font-semibold text-fg">{n.deviceName}: </span>
            )}
            <span className="text-muted">{n.message}</span>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(n.id)}
            aria-label="Dismiss notification"
            className="shrink-0 text-muted hover:text-fg"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
