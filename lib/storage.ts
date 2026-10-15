import { VIEWPORT_LIMITS, defaultDevices } from "./devices";
import type {
  DeviceCategory,
  DeviceInstance,
  Theme,
  WorkspaceState,
  ZoomMode,
} from "./types";

export const STORAGE_KEY = "rwp:v1";

export function defaultState(): WorkspaceState {
  return {
    devices: defaultDevices(),
    prefs: { theme: "dark", compact: false, waveEnabled: true },
    url: null,
  };
}

const CATEGORIES: DeviceCategory[] = ["phone", "tablet", "laptop", "desktop", "custom"];

function isZoom(value: unknown): value is ZoomMode {
  return value === "fit" || value === 50 || value === 75 || value === 100;
}

function isDimension(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= VIEWPORT_LIMITS.min &&
    value <= VIEWPORT_LIMITS.max
  );
}

function sanitizeDevice(value: unknown): DeviceInstance | null {
  if (typeof value !== "object" || value === null) return null;
  const d = value as Record<string, unknown>;
  if (typeof d.uid !== "string" || !d.uid) return null;
  if (typeof d.presetId !== "string") return null;
  if (typeof d.name !== "string" || !d.name) return null;
  if (!CATEGORIES.includes(d.category as DeviceCategory)) return null;
  if (!isDimension(d.width) || !isDimension(d.height)) return null;

  let position: { x: number; y: number } | undefined = undefined;
  if (typeof d.position === "object" && d.position !== null) {
    const rawPos = d.position as Record<string, unknown>;
    if (
      typeof rawPos.x === "number" &&
      typeof rawPos.y === "number" &&
      Number.isFinite(rawPos.x) &&
      Number.isFinite(rawPos.y)
    ) {
      position = {
        x: Math.round(rawPos.x),
        y: Math.round(rawPos.y),
      };
    }
  }

  return {
    uid: d.uid,
    presetId: d.presetId,
    name: d.name.slice(0, 60),
    category: d.category as DeviceCategory,
    width: Math.round(d.width),
    height: Math.round(d.height),
    rotated: d.rotated === true,
    zoom: isZoom(d.zoom) ? d.zoom : "fit",
    position,
  };
}

/** Parses and validates persisted data. Returns null when nothing usable is stored. */
export function parseState(raw: string | null): WorkspaceState | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    const obj = data as Record<string, unknown>;

    const devices = Array.isArray(obj.devices)
      ? obj.devices.map(sanitizeDevice).filter((d): d is DeviceInstance => d !== null)
      : null;
    if (!devices) return null;

    const prefsRaw = (typeof obj.prefs === "object" && obj.prefs !== null ? obj.prefs : {}) as Record<
      string,
      unknown
    >;
    const theme: Theme = prefsRaw.theme === "light" ? "light" : "dark";
    const waveEnabled = prefsRaw.waveEnabled !== false;

    return {
      devices,
      prefs: { theme, compact: prefsRaw.compact === true, waveEnabled },
      url: typeof obj.url === "string" && obj.url ? obj.url : null,
    };
  } catch {
    return null;
  }
}

export function loadState(): WorkspaceState | null {
  try {
    return parseState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null; // storage blocked (private mode, disabled cookies, ...)
  }
}

export function saveState(state: WorkspaceState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / blocked storage errors */
  }
}
