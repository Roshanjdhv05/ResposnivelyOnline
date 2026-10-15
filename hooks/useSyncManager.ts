"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SyncManager } from "@/lib/sync/SyncManager";
import type { SyncMode, SyncNotification } from "@/lib/sync/types";

interface UseSyncManagerOptions {
  hasUrl: boolean;
  onNavigateUrl?: (newUrl: string, isSpa?: boolean) => void;
  getDeviceName?: (uid: string) => string;
}

export function useSyncManager({
  hasUrl,
  onNavigateUrl,
  getDeviceName,
}: UseSyncManagerOptions) {
  // Enabled by default when a URL is loaded into multiple previews
  const [mode, setModeState] = useState<SyncMode>("all");
  const [excludedUids, setExcludedUids] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<SyncNotification[]>([]);

  const managerRef = useRef<SyncManager | null>(null);

  const handleNotification = useCallback((notification: SyncNotification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
  }, []);

  // Initialize SyncManager
  if (!managerRef.current) {
    managerRef.current = new SyncManager({
      defaultMode: "all",
      onNavigateUrl,
      onNotification: handleNotification,
      getDeviceName,
    });
  }

  // Auto-dismiss notifications after 4.5s
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(0, -1));
    }, 4500);
    return () => clearTimeout(timer);
  }, [notifications]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, []);

  const setMode = useCallback((newMode: SyncMode) => {
    setModeState(newMode);
    managerRef.current?.setMode(newMode);
  }, []);

  const toggleExclude = useCallback((uid: string) => {
    if (!managerRef.current) return;
    managerRef.current.toggleExclude(uid);
    setExcludedUids([...managerRef.current.getExcludedList()]);
  }, []);

  const isExcluded = useCallback(
    (uid: string) => excludedUids.includes(uid),
    [excludedUids],
  );

  const resetSync = useCallback(() => {
    managerRef.current?.resetAll();
  }, []);

  const register = useCallback(
    (uid: string, iframe: HTMLIFrameElement) => {
      return managerRef.current ? managerRef.current.register(uid, iframe) : () => {};
    },
    [],
  );

  const onFrameLoaded = useCallback((uid: string) => {
    managerRef.current?.onFrameLoaded(uid);
  }, []);

  const scrollAllBy = useCallback(
    (driverUid: string, deltaX: number, deltaY: number) => {
      managerRef.current?.scrollController.scrollAllBy(driverUid, deltaX, deltaY);
    },
    [],
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return useMemo(
    () => ({
      mode,
      setMode,
      isExcluded,
      toggleExclude,
      excludedUids,
      resetSync,
      register,
      onFrameLoaded,
      scrollAllBy,
      notifications,
      dismissNotification,
      manager: managerRef.current!,
    }),
    [
      mode,
      setMode,
      isExcluded,
      toggleExclude,
      excludedUids,
      resetSync,
      register,
      onFrameLoaded,
      scrollAllBy,
      notifications,
      dismissNotification,
    ],
  );
}
