export type DeviceCategory = "phone" | "tablet" | "laptop" | "desktop" | "custom";

export type ZoomMode = "fit" | 50 | 75 | 100;

export type Theme = "dark" | "light";

export interface DevicePreset {
  id: string;
  name: string;
  category: Exclude<DeviceCategory, "custom">;
  /** Viewport width in CSS pixels in the device's original orientation. */
  width: number;
  /** Viewport height in CSS pixels in the device's original orientation. */
  height: number;
}

export interface DeviceInstance {
  uid: string;
  presetId: string;
  name: string;
  category: DeviceCategory;
  width: number;
  height: number;
  /** When true, width and height are swapped (landscape for phones/tablets). */
  rotated: boolean;
  zoom: ZoomMode;
  position?: { x: number; y: number };
}

export interface WorkspacePrefs {
  theme: Theme;
  compact: boolean;
  waveEnabled?: boolean;
}

export interface WorkspaceState {
  devices: DeviceInstance[];
  prefs: WorkspacePrefs;
  /** The last submitted (normalized) URL, or null when nothing has been previewed yet. */
  url: string | null;
}

export interface Size {
  w: number;
  h: number;
}

/** Result of the server-side embeddability check (see app/api/check/route.ts). */
export type CheckResult =
  | { state: "ok"; status: number; finalUrl: string }
  | {
      state: "blocked";
      by: "x-frame-options" | "csp";
      header: string;
      value: string;
      status: number;
      finalUrl: string;
    }
  | { state: "unreachable"; code: string; message: string }
  | { state: "skipped"; reason: string }
  | { state: "unknown"; message: string };

export interface EmbedCheckState {
  status: "idle" | "checking" | "done";
  result: CheckResult | null;
}
