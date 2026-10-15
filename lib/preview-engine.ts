/**
 * Preview engine: framework-free math for turning a *simulated viewport* (what the website sees)
 * into a *visual size* (what we paint in the workspace). The iframe always keeps its real viewport
 * dimensions; only a CSS scale transform changes how large it appears.
 */
import { isRotatable } from "./devices";
import type { DeviceInstance, Size, ZoomMode } from "./types";

export const MIN_FIT_SCALE = 0.12;
export const LOAD_TIMEOUT_MS = 20_000;
export const ZOOM_PRESETS = [50, 75, 100] as const;

export const WORKSPACE_GAP = 16;

/** Fixed layout metrics shared by the workspace (for fit math) and the device toolbar. */
export const TOOLBAR_HEIGHT = { normal: 60, compact: 46 } as const;
export const MIN_COLUMN_WIDTH = { normal: 280, compact: 256 } as const;
export const WORKSPACE_PADDING = { normal: 16, compact: 8 } as const;

/** The viewport the website actually sees for this device (rotation applied). */
export function effectiveSize(device: Pick<DeviceInstance, "width" | "height" | "rotated">): Size {
  return device.rotated
    ? { w: device.height, h: device.width }
    : { w: device.width, h: device.height };
}

export function orientationOf(device: Pick<DeviceInstance, "width" | "height" | "rotated">) {
  const { w, h } = effectiveSize(device);
  return w > h ? "landscape" : "portrait";
}

export function canRotate(device: Pick<DeviceInstance, "category">): boolean {
  return isRotatable(device.category);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function zoomToScale(zoom: Exclude<ZoomMode, "fit">): number {
  return zoom / 100;
}

export interface ScaleInput {
  devices: DeviceInstance[];
  /** Usable width of the scrolling workspace (inside its padding). */
  availW: number;
  /** Height available to the preview frame itself (workspace height minus padding and toolbar). */
  availH: number;
  gap?: number;
}

/**
 * Resolves the visual scale of every device.
 *
 * Devices with a fixed zoom (50/75/100%) use it directly. All devices set to "Fit" share one common
 * scale so their relative proportions stay truthful: it is the largest scale at which every fitted
 * device fits the workspace height and, together with the fixed-zoom devices, the workspace width.
 * Fit never scales above 100%.
 */
export function computeScales({
  devices,
  availW,
  availH,
  gap = WORKSPACE_GAP,
}: ScaleInput): Record<string, number> {
  const scales: Record<string, number> = {};
  let fixedWidth = 0;
  let fitWidth = 0;
  let fitMaxHeight = 0;
  let fitCount = 0;

  for (const device of devices) {
    const size = effectiveSize(device);
    if (device.zoom === "fit") {
      fitWidth += size.w;
      fitMaxHeight = Math.max(fitMaxHeight, size.h);
      fitCount += 1;
    } else {
      const scale = zoomToScale(device.zoom);
      scales[device.uid] = scale;
      fixedWidth += size.w * scale;
    }
  }

  if (fitCount > 0) {
    const gaps = Math.max(0, devices.length - 1) * gap;
    const byWidth = availW > 0 ? (availW - gaps - fixedWidth) / fitWidth : 1;
    const byHeight = availH > 0 ? availH / fitMaxHeight : 1;
    const common = clamp(Math.min(1, byWidth, byHeight), MIN_FIT_SCALE, 1);
    for (const device of devices) {
      if (device.zoom === "fit") scales[device.uid] = common;
    }
  }

  return scales;
}

/** Scale used when a single preview is shown full screen (it should fill the screen). */
export function fullscreenScale(viewport: Size, screen: Size): number {
  if (viewport.w <= 0 || viewport.h <= 0 || screen.w <= 0 || screen.h <= 0) return 1;
  return Math.min(screen.w / viewport.w, screen.h / viewport.h);
}

export function formatPercent(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

export function describeSize(size: Size): string {
  return `${size.w} × ${size.h}`;
}
