import type { DeviceCategory, DeviceInstance, DevicePreset } from "./types";

export const VIEWPORT_LIMITS = { min: 200, max: 7680 } as const;

export const CATEGORY_LABELS: Record<DeviceCategory, string> = {
  phone: "Phones",
  tablet: "Tablets",
  laptop: "Laptops",
  desktop: "Desktops",
  custom: "Custom",
};

export const DEVICE_PRESETS: DevicePreset[] = [
  // Phones
  { id: "iphone-se", name: "iPhone SE", category: "phone", width: 375, height: 667 },
  { id: "iphone-13", name: "iPhone 13", category: "phone", width: 390, height: 844 },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", category: "phone", width: 393, height: 852 },
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", category: "phone", width: 430, height: 932 },
  { id: "pixel-7", name: "Pixel 7", category: "phone", width: 412, height: 915 },
  { id: "galaxy-s23", name: "Galaxy S23", category: "phone", width: 360, height: 780 },
  { id: "galaxy-z-fold-5", name: "Galaxy Z Fold 5 (folded)", category: "phone", width: 344, height: 882 },
  // Tablets
  { id: "ipad-mini", name: "iPad Mini", category: "tablet", width: 768, height: 1024 },
  { id: "ipad-air", name: "iPad Air", category: "tablet", width: 820, height: 1180 },
  { id: "ipad-pro-11", name: 'iPad Pro 11"', category: "tablet", width: 834, height: 1194 },
  { id: "ipad-pro-12", name: 'iPad Pro 12.9"', category: "tablet", width: 1024, height: 1366 },
  { id: "galaxy-tab-s7", name: "Galaxy Tab S7", category: "tablet", width: 800, height: 1280 },
  { id: "surface-pro-7", name: "Surface Pro 7", category: "tablet", width: 912, height: 1368 },
  // Laptops
  { id: "macbook-air-13", name: "MacBook Air 13\"", category: "laptop", width: 1280, height: 800 },
  { id: "macbook-pro", name: "MacBook Pro", category: "laptop", width: 1440, height: 900 },
  { id: "macbook-pro-16", name: 'MacBook Pro 16"', category: "laptop", width: 1728, height: 1117 },
  { id: "laptop-hd", name: "Laptop HD", category: "laptop", width: 1366, height: 768 },
  { id: "laptop-fhd-125", name: "Laptop FHD (125%)", category: "laptop", width: 1536, height: 864 },
  // Desktops
  { id: "desktop-hd", name: "Desktop HD", category: "desktop", width: 1280, height: 720 },
  { id: "desktop-monitor", name: "Desktop monitor", category: "desktop", width: 1920, height: 1080 },
  { id: "desktop-qhd", name: "Desktop QHD", category: "desktop", width: 2560, height: 1440 },
  { id: "desktop-ultrawide", name: "Ultrawide", category: "desktop", width: 3440, height: 1440 },
];

export const DEFAULT_PRESET_IDS = [
  "iphone-14-pro",
  "ipad-mini",
  "macbook-pro",
  "desktop-monitor",
] as const;

export const PRESETS_BY_ID: Record<string, DevicePreset> = Object.fromEntries(
  DEVICE_PRESETS.map((p) => [p.id, p]),
);

export function getPreset(id: string): DevicePreset | undefined {
  return PRESETS_BY_ID[id];
}

export function newUid(): string {
  return `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function createDevice(preset: DevicePreset, uid: string = newUid()): DeviceInstance {
  return {
    uid,
    presetId: preset.id,
    name: preset.name,
    category: preset.category,
    width: preset.width,
    height: preset.height,
    rotated: false,
    zoom: "fit",
  };
}

export function createCustomDevice(
  name: string,
  width: number,
  height: number,
  uid: string = newUid(),
): DeviceInstance {
  return {
    uid,
    presetId: "custom",
    name: name.trim() || "Custom",
    category: "custom",
    width,
    height,
    rotated: false,
    zoom: "fit",
  };
}

export const DEFAULT_POSITIONS: Record<string, { x: number; y: number }> = {
  "iphone-14-pro": { x: 80, y: 100 },
  "ipad-mini": { x: 540, y: 100 },
  "macbook-pro": { x: 1380, y: 100 },
  "desktop-monitor": { x: 540, y: 1200 },
};

export function defaultDevices(): DeviceInstance[] {
  return DEFAULT_PRESET_IDS.map((id) => {
    const preset = PRESETS_BY_ID[id];
    if (!preset) throw new Error(`Missing default preset: ${id}`);
    const dev = createDevice(preset, `default-${id}`);
    dev.position = DEFAULT_POSITIONS[id] ?? { x: 100, y: 100 };
    return dev;
  });
}

export function arrangeHorizontal(devices: DeviceInstance[], startX = 80, startY = 100, gap = 60): DeviceInstance[] {
  let curX = startX;
  return devices.map((d) => {
    const w = d.rotated ? d.height : d.width;
    const positioned = { ...d, position: { x: curX, y: startY } };
    curX += w + gap;
    return positioned;
  });
}

export function arrangeGrid(devices: DeviceInstance[], startX = 80, startY = 100, gapX = 60, gapY = 80): DeviceInstance[] {
  let rowMaxHeight = 0;
  let curX = startX;
  let curY = startY;
  const cols = 2;

  return devices.map((d, index) => {
    const w = d.rotated ? d.height : d.width;
    const h = d.rotated ? d.width : d.height;

    if (index > 0 && index % cols === 0) {
      curX = startX;
      curY += rowMaxHeight + gapY;
      rowMaxHeight = 0;
    }

    const pos = { x: curX, y: curY };
    curX += w + gapX;
    rowMaxHeight = Math.max(rowMaxHeight, h);

    return { ...d, position: pos };
  });
}

export function arrangeVertical(devices: DeviceInstance[], startX = 120, startY = 80, gap = 80): DeviceInstance[] {
  let curY = startY;
  return devices.map((d) => {
    const h = d.rotated ? d.width : d.height;
    const positioned = { ...d, position: { x: startX, y: curY } };
    curY += h + gap;
    return positioned;
  });
}

export function arrangeShowcase(devices: DeviceInstance[]): DeviceInstance[] {
  // Showcase layout inspired by design canvas tools:
  // Mobile on left column, Tablets/Laptops on top row, Desktop below
  const mobile = devices.filter((d) => d.category === "phone");
  const tablets = devices.filter((d) => d.category === "tablet");
  const laptops = devices.filter((d) => d.category === "laptop");
  const desktops = devices.filter((d) => d.category === "desktop");
  const others = devices.filter((d) => d.category === "custom");

  const result: DeviceInstance[] = [];
  let leftColX = 80;
  let leftColY = 100;

  for (const m of mobile) {
    result.push({ ...m, position: { x: leftColX, y: leftColY } });
    const h = m.rotated ? m.width : m.height;
    leftColY += h + 80;
  }

  const topRowStartX = mobile.length > 0 ? 540 : 80;
  let topRowX = topRowStartX;
  let topRowMaxH = 0;

  const topRow = [...tablets, ...laptops];
  for (const item of topRow) {
    const w = item.rotated ? item.height : item.width;
    const h = item.rotated ? item.width : item.height;
    result.push({ ...item, position: { x: topRowX, y: 100 } });
    topRowX += w + 60;
    topRowMaxH = Math.max(topRowMaxH, h);
  }

  let bottomRowX = topRowStartX;
  const bottomRowY = topRow.length > 0 ? 100 + topRowMaxH + 100 : 100;
  const bottomRow = [...desktops, ...others];

  for (const item of bottomRow) {
    const w = item.rotated ? item.height : item.width;
    result.push({ ...item, position: { x: bottomRowX, y: bottomRowY } });
    bottomRowX += w + 80;
  }

  // Preserve any remaining devices if not caught
  for (const d of devices) {
    if (!result.some((r) => r.uid === d.uid)) {
      result.push(d);
    }
  }

  return result;
}

export function isRotatable(category: DeviceCategory): boolean {
  return category === "phone" || category === "tablet" || category === "custom";
}
