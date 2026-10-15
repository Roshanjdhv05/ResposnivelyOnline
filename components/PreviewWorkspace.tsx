"use client";

import { Plus } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  DeviceInstance,
  DevicePreset,
  EmbedCheckState,
  Size,
  Theme,
  ZoomMode,
} from "@/lib/types";
import type { SyncMode, SyncNotification } from "@/lib/sync/types";
import { useSyncScroll } from "@/hooks/useSyncScroll";
import CanvasControls from "./CanvasControls";
import CanvasMinimap from "./CanvasMinimap";
import DevicePresetSelector from "./DevicePresetSelector";
import DevicePreview from "./DevicePreview";
import SyncNotificationToast from "./SyncNotificationToast";
import WaveDotGridCanvas from "./WaveDotGridCanvas";

interface PreviewWorkspaceProps {
  devices: DeviceInstance[];
  url: string | null;
  runId: number;
  check: EmbedCheckState;
  compact: boolean;
  theme?: Theme;
  waveEnabled?: boolean;
  syncMode?: SyncMode;
  onSetSyncMode?: (mode: SyncMode) => void;
  onResetSync?: () => void;
  isExcluded?: (uid: string) => boolean;
  onToggleSyncExclude?: (uid: string) => void;
  onRegisterSync?: (uid: string, iframe: HTMLIFrameElement) => () => void;
  onFrameSyncLoaded?: (uid: string) => void;
  onSyncNavigate?: (newUrl: string, isSpa?: boolean) => void;
  onScrollBy?: (driverUid: string, deltaX: number, deltaY: number) => void;
  notifications?: SyncNotification[];
  onDismissNotification?: (id: string) => void;
  onToggleWave?: () => void;
  onRotate: (uid: string) => void;
  onZoom: (uid: string, zoom: ZoomMode) => void;
  onRemove: (uid: string) => void;
  onSwitchPreset: (uid: string, preset: DevicePreset) => void;
  onCustomizeDevice: (uid: string) => void;
  onRecheck: () => void;
  onAddPreset: (preset: DevicePreset) => void;
  onAddCustom: () => void;
  onMoveDevice: (uid: string, position: { x: number; y: number }) => void;
  onArrangeDevices: (mode: "showcase" | "horizontal" | "grid" | "vertical") => void;
}

export default function PreviewWorkspace({
  devices,
  url,
  runId,
  check,
  compact,
  theme = "dark",
  waveEnabled = true,
  syncMode = "all",
  onSetSyncMode,
  onResetSync,
  isExcluded,
  onToggleSyncExclude,
  onRegisterSync,
  onFrameSyncLoaded,
  onSyncNavigate,
  onScrollBy,
  notifications = [],
  onDismissNotification,
  onToggleWave,
  onRotate,
  onZoom,
  onRemove,
  onSwitchPreset,
  onCustomizeDevice,
  onRecheck,
  onAddPreset,
  onAddCustom,
  onMoveDevice,
  onArrangeDevices,
}: PreviewWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState<Size>({ w: 0, h: 0 });

  // Synchronized scroll fallback
  const syncScrollBus = useSyncScroll(syncMode !== "disabled");

  // Canvas Camera State (Pan and Zoom)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 80, y: 60 });
  const [zoom, setZoom] = useState<number>(0.65);
  const [isPanMode, setIsPanMode] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [minimapOpen, setMinimapOpen] = useState(true);

  // Active Dragging State for Screen Frames
  const [draggingUid, setDraggingUid] = useState<string | null>(null);
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Sync incoming device positions to local positions when not actively dragging
  useEffect(() => {
    if (draggingUid) return;
    const posMap: Record<string, { x: number; y: number }> = {};
    for (const d of devices) {
      if (d.position) {
        posMap[d.uid] = d.position;
      }
    }
    setLocalPositions(posMap);
  }, [devices, draggingUid]);

  // Measure container dimensions
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setViewportSize({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initial Auto-fit when devices and viewport first become available
  const hasAutoCentered = useRef(false);
  useEffect(() => {
    if (hasAutoCentered.current || devices.length === 0 || viewportSize.w === 0 || viewportSize.h === 0) {
      return;
    }
    hasAutoCentered.current = true;
    fitAllToView();
  }, [devices.length, viewportSize.w, viewportSize.h]);

  // Fit all devices comfortably within the current viewport
  const fitAllToView = useCallback(() => {
    if (devices.length === 0 || viewportSize.w === 0 || viewportSize.h === 0) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const d of devices) {
      const pos = localPositions[d.uid] ?? d.position ?? { x: 80, y: 100 };
      const w = d.rotated ? d.height : d.width;
      const h = d.rotated ? d.width : d.height;
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + w);
      maxY = Math.max(maxY, pos.y + h);
    }

    const contentW = Math.max(maxX - minX, 100);
    const contentH = Math.max(maxY - minY, 100);

    const pad = compact ? 80 : 120;
    const targetScale = Math.min(
      1.0,
      Math.max(0.2, Math.min((viewportSize.w - pad * 2) / contentW, (viewportSize.h - pad * 2) / contentH)),
    );

    const targetPanX = (viewportSize.w - contentW * targetScale) / 2 - minX * targetScale;
    const targetPanY = (viewportSize.h - contentH * targetScale) / 2 - minY * targetScale;

    setZoom(targetScale);
    setPan({ x: Math.round(targetPanX), y: Math.round(targetPanY) });
  }, [devices, localPositions, viewportSize, compact]);

  const resetView = useCallback(() => {
    const firstDev = devices[0];
    if (!firstDev) {
      setZoom(1.0);
      setPan({ x: 80, y: 80 });
      return;
    }
    setZoom(1.0);
    const pos = localPositions[firstDev.uid] ?? firstDev.position ?? { x: 80, y: 100 };
    setPan({
      x: Math.round(viewportSize.w / 2 - pos.x - 200),
      y: Math.round(viewportSize.h / 2 - pos.y - 200),
    });
  }, [devices, localPositions, viewportSize]);

  // Zooming helpers
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(2.5, Math.round(z * 1.15 * 100) / 100));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.15, Math.round(z * 0.85 * 100) / 100));
  }, []);

  const handleZoomSelect = useCallback((targetZoom: number) => {
    setZoom(targetZoom);
  }, []);

  // Keyboard navigation (Spacebar for temporary hand tool, Ctrl +/-/0 for zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
      } else if (e.key === "h" || e.key === "H") {
        setIsPanMode((prev) => !prev);
      } else if (e.key === "v" || e.key === "V" || e.key === "Escape") {
        setIsPanMode(false);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        setZoom(1.0);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleZoomIn, handleZoomOut]);

  // Smooth mouse wheel zoom anchored to cursor position & trackpad pan
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!containerRef.current) return;

      // Pinch zoom or Ctrl + Wheel zooms canvas centered at mouse point
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.0035);
        const newZoom = Math.min(2.5, Math.max(0.15, zoom * factor));

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
        const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

        setZoom(newZoom);
        setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
      } else {
        // Standard two-finger pan or wheel scroll
        setPan((prev) => ({
          x: Math.round(prev.x - e.deltaX),
          y: Math.round(prev.y - e.deltaY),
        }));
      }
    },
    [zoom, pan],
  );

  // Canvas Background Panning (Dragging canvas empty area or with Pan tool)
  const panStartRef = useRef<{ pointerX: number; pointerY: number; startPanX: number; startPanY: number } | null>(null);

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    // Only handle if middle click, or pan mode/space, or direct left click on background
    const isMiddle = e.button === 1;
    const isLeft = e.button === 0;
    const isPanningAllowed = isPanMode || isSpacePressed || isMiddle || e.target === containerRef.current || (e.target as HTMLElement).tagName === "CANVAS";

    if (!isPanningAllowed || (!isLeft && !isMiddle)) return;

    panStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    setIsPanning(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!panStartRef.current || !isPanning) return;
    const dx = e.clientX - panStartRef.current.pointerX;
    const dy = e.clientY - panStartRef.current.pointerY;
    setPan({
      x: Math.round(panStartRef.current.startPanX + dx),
      y: Math.round(panStartRef.current.startPanY + dy),
    });
  };

  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
    }
  };

  // Dragging individual screen frames/artboards
  const dragFrameRef = useRef<{
    uid: string;
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
  } | null>(null);

  const handleFrameDragStart = (uid: string, e: React.PointerEvent) => {
    e.stopPropagation();
    const curPos = localPositions[uid] ?? devices.find((d) => d.uid === uid)?.position ?? { x: 80, y: 100 };
    dragFrameRef.current = {
      uid,
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: curPos.x,
      startY: curPos.y,
      lastX: curPos.x,
      lastY: curPos.y,
    };
    setDraggingUid(uid);
    window.addEventListener("pointermove", handleFramePointerMove);
    window.addEventListener("pointerup", handleFramePointerUp);
  };

  const handleFramePointerMove = useCallback(
    (e: PointerEvent) => {
      const state = dragFrameRef.current;
      if (!state) return;

      const deltaX = (e.clientX - state.pointerX) / zoom;
      const deltaY = (e.clientY - state.pointerY) / zoom;

      const newX = Math.round(state.startX + deltaX);
      const newY = Math.round(state.startY + deltaY);

      state.lastX = newX;
      state.lastY = newY;

      setLocalPositions((prev) => ({
        ...prev,
        [state.uid]: { x: newX, y: newY },
      }));
    },
    [zoom],
  );

  const handleFramePointerUp = useCallback(() => {
    const state = dragFrameRef.current;
    if (state) {
      onMoveDevice(state.uid, { x: state.lastX, y: state.lastY });
      dragFrameRef.current = null;
    }
    setDraggingUid(null);
    window.removeEventListener("pointermove", handleFramePointerMove);
    window.removeEventListener("pointerup", handleFramePointerUp);
  }, [onMoveDevice, handleFramePointerMove]);

  // Determine active cursor style for workspace
  let cursorClass = "cursor-default";
  if (isPanning || draggingUid) {
    cursorClass = "cursor-grabbing";
  } else if (isPanMode || isSpacePressed) {
    cursorClass = "cursor-grab";
  }

  const isInteracting = isPanning || draggingUid !== null;

  return (
    <main
      ref={containerRef}
      role="region"
      aria-label="Infinite canvas workspace"
      onWheel={handleWheel}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      className={`relative min-h-0 flex-1 overflow-hidden select-none bg-ws ${cursorClass}`}
    >
      {/* 1. Animated Dot-Grid Wave Canvas Background (Subtle fluid undulating grid) */}
      <WaveDotGridCanvas
        pan={pan}
        zoom={zoom}
        theme={theme}
        enabled={waveEnabled}
      />

      {/* 2. Interactive Infinite Canvas World Container (Stable Artboard layer) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: "0 0",
          willChange: isInteracting ? "transform" : "auto",
        }}
        className="pointer-events-auto"
      >
        {devices.length === 0 ? (
          <div className="flex h-96 w-96 items-center justify-center p-6 text-center">
            <div className="flex max-w-xs flex-col items-center gap-3">
              <p className="text-sm text-muted">No devices in workspace.</p>
              <DevicePresetSelector
                label="Add device"
                onSelect={onAddPreset}
                onCustom={onAddCustom}
                triggerClassName="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent/90"
              >
                <Plus size={14} aria-hidden /> Add device
              </DevicePresetSelector>
            </div>
          </div>
        ) : (
          devices.map((device) => {
            const currentPosition = localPositions[device.uid] ?? device.position ?? { x: 80, y: 100 };
            const deviceWithLocalPos: DeviceInstance = {
              ...device,
              position: currentPosition,
            };

            return (
              <DevicePreview
                key={device.uid}
                device={deviceWithLocalPos}
                url={url}
                runId={runId}
                check={check}
                scale={1}
                compact={compact}
                isInteracting={isInteracting}
                isDragging={draggingUid === device.uid}
                isSyncExcluded={isExcluded ? isExcluded(device.uid) : false}
                isSyncActive={syncMode !== "disabled"}
                onToggleSyncExclude={onToggleSyncExclude}
                onRegisterSync={onRegisterSync}
                onFrameSyncLoaded={onFrameSyncLoaded}
                onSyncNavigate={onSyncNavigate}
                onScrollBy={onScrollBy}
                onDragStart={(e) => handleFrameDragStart(device.uid, e)}
                syncScrollBus={syncScrollBus}
                onRotate={onRotate}
                onZoom={onZoom}
                onRemove={onRemove}
                onSwitchPreset={onSwitchPreset}
                onCustom={onCustomizeDevice}
                onRecheck={onRecheck}
              />
            );
          })
        )}
      </div>

      {/* 3. Floating Zoom Controls & Bottom Tool Dock */}
      <CanvasControls
        zoom={zoom}
        isPanMode={isPanMode}
        waveEnabled={waveEnabled}
        minimapOpen={minimapOpen}
        syncScrollEnabled={syncMode !== "disabled"}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomSelect={handleZoomSelect}
        onFitAll={fitAllToView}
        onResetView={resetView}
        onTogglePanMode={() => setIsPanMode(!isPanMode)}
        onToggleWave={() => onToggleWave?.()}
        onToggleMinimap={() => setMinimapOpen(!minimapOpen)}
        onToggleSyncScroll={() => onSetSyncMode?.(syncMode === "disabled" ? "all" : "disabled")}
        onArrange={onArrangeDevices}
      />

      {/* 4. Action notifications & limitation notices */}
      <SyncNotificationToast
        notifications={notifications}
        onDismiss={onDismissNotification ?? (() => {})}
      />

      {/* 4. Canvas Minimap Navigator (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-30">
        <CanvasMinimap
          devices={devices.map((d) => ({
            ...d,
            position: localPositions[d.uid] ?? d.position ?? { x: 80, y: 100 },
          }))}
          pan={pan}
          zoom={zoom}
          viewportSize={viewportSize}
          onPanChange={(newPan) => setPan(newPan)}
          open={minimapOpen}
          onToggle={() => setMinimapOpen(!minimapOpen)}
        />
      </div>
    </main>
  );
}
