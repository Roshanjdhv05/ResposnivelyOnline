"use client";

import { MapPin, Minus, Plus } from "lucide-react";
import { useCallback, useRef } from "react";
import type { DeviceInstance } from "@/lib/types";

interface CanvasMinimapProps {
  devices: DeviceInstance[];
  pan: { x: number; y: number };
  zoom: number;
  viewportSize: { w: number; h: number };
  onPanChange: (pan: { x: number; y: number }) => void;
  open: boolean;
  onToggle: () => void;
}

const MAP_W = 180;
const MAP_H = 110;

export default function CanvasMinimap({
  devices,
  pan,
  zoom,
  viewportSize,
  onPanChange,
  open,
  onToggle,
}: CanvasMinimapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Calculate world bounds containing all devices and the current viewport
  let minDevX = 0;
  let minDevY = 0;
  let maxDevX = 1200;
  let maxDevY = 900;

  if (devices.length > 0) {
    minDevX = Infinity;
    minDevY = Infinity;
    maxDevX = -Infinity;
    maxDevY = -Infinity;

    for (const d of devices) {
      const x = d.position?.x ?? 0;
      const y = d.position?.y ?? 0;
      const w = d.rotated ? d.height : d.width;
      const h = d.rotated ? d.width : d.height;
      minDevX = Math.min(minDevX, x);
      minDevY = Math.min(minDevY, y);
      maxDevX = Math.max(maxDevX, x + w);
      maxDevY = Math.max(maxDevY, y + h);
    }
  }

  const vpWorldLeft = -pan.x / zoom;
  const vpWorldTop = -pan.y / zoom;
  const vpWorldRight = (viewportSize.w - pan.x) / zoom;
  const vpWorldBottom = (viewportSize.h - pan.y) / zoom;

  const margin = 200;
  const worldMinX = Math.min(minDevX, vpWorldLeft) - margin;
  const worldMinY = Math.min(minDevY, vpWorldTop) - margin;
  const worldMaxX = Math.max(maxDevX, vpWorldRight) + margin;
  const worldMaxY = Math.max(maxDevY, vpWorldBottom) + margin;

  const totalWorldW = Math.max(worldMaxX - worldMinX, 100);
  const totalWorldH = Math.max(worldMaxY - worldMinY, 100);

  const scale = Math.min((MAP_W - 16) / totalWorldW, (MAP_H - 16) / totalWorldH);

  // Center within minimap box
  const offsetX = (MAP_W - totalWorldW * scale) / 2;
  const offsetY = (MAP_H - totalWorldH * scale) / 2;

  const worldToMapX = (wx: number) => offsetX + (wx - worldMinX) * scale;
  const worldToMapY = (wy: number) => offsetY + (wy - worldMinY) * scale;
  const mapToWorldX = (mx: number) => worldMinX + (mx - offsetX) / scale;
  const mapToWorldY = (my: number) => worldMinY + (my - offsetY) / scale;

  const vpX = worldToMapX(vpWorldLeft);
  const vpY = worldToMapY(vpWorldTop);
  const vpW = Math.max((vpWorldRight - vpWorldLeft) * scale, 6);
  const vpH = Math.max((vpWorldBottom - vpWorldTop) * scale, 6);

  const handlePointerNavigate = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const targetWorldX = mapToWorldX(clickX);
      const targetWorldY = mapToWorldY(clickY);

      const newPanX = viewportSize.w / 2 - targetWorldX * zoom;
      const newPanY = viewportSize.h / 2 - targetWorldY * zoom;

      onPanChange({ x: Math.round(newPanX), y: Math.round(newPanY) });
    },
    [viewportSize, zoom, onPanChange, scale, worldMinX, worldMinY, offsetX, offsetY],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerNavigate(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    handlePointerNavigate(e);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={onToggle}
        title="Open Canvas Minimap"
        aria-label="Open Canvas Minimap"
        className="flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface/90 px-2.5 text-xs font-medium text-muted shadow-lg backdrop-blur-md transition-colors hover:bg-surface hover:text-fg"
      >
        <MapPin size={14} aria-hidden />
        <span>Minimap</span>
      </button>
    );
  }

  return (
    <div
      className="relative select-none overflow-hidden rounded-xl border border-line/90 bg-surface/90 p-2 shadow-2xl backdrop-blur-md transition-all"
      style={{ width: MAP_W, height: MAP_H }}
    >
      {/* Header bar */}
      <div className="absolute left-2 right-2 top-1.5 flex items-center justify-between text-2xs font-semibold text-muted">
        <span className="tracking-wider uppercase opacity-75">Overview</span>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Hide minimap"
          className="rounded p-0.5 text-muted hover:bg-surface2 hover:text-fg"
        >
          <Minus size={12} />
        </button>
      </div>

      {/* Minimap interactive area */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative mt-3.5 h-[84px] w-full cursor-crosshair rounded-md border border-line/40 bg-ws/60 overflow-hidden"
      >
        {/* Device silhouettes */}
        {devices.map((d) => {
          const x = d.position?.x ?? 0;
          const y = d.position?.y ?? 0;
          const w = d.rotated ? d.height : d.width;
          const h = d.rotated ? d.width : d.height;

          const mx = worldToMapX(x);
          const my = worldToMapY(y);
          const mw = Math.max(w * scale, 3);
          const mh = Math.max(h * scale, 3);

          return (
            <div
              key={d.uid}
              style={{
                left: mx,
                top: my,
                width: mw,
                height: mh,
              }}
              title={`${d.name} (${w}×${h})`}
              className="absolute rounded-[2px] border border-accent/40 bg-accent/20 transition-opacity"
            />
          );
        })}

        {/* Viewport frame indicator */}
        <div
          style={{
            left: Math.max(0, vpX),
            top: Math.max(0, vpY),
            width: Math.min(vpW, MAP_W),
            height: Math.min(vpH, 84),
          }}
          className="pointer-events-none absolute rounded-[3px] border-2 border-dashed border-accent bg-accent/15 shadow-sm"
        />
      </div>
    </div>
  );
}
