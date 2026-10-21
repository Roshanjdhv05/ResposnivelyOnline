import type { DeviceCategory, DeviceInstance, DevicePreset } from "./types";
import { ALL_SMARTPHONE_MODELS, getPhoneModel, phoneModelToPreset } from "./devices/registry";

export const VIEWPORT_LIMITS = { min: 200, max: 7680 } as const;

export const CATEGORY_LABELS: Record<DeviceCategory, string> = {
  phone: "Phones",
  tablet: "Tablets",
  laptop: "Laptops",
  desktop: "Desktops",
  custom: "Custom",
};

export const QUICK_TABLET_PRESETS: DevicePreset[] = [
  { id: "ipad-mini", name: "iPad Mini", category: "tablet", width: 768, height: 1024, dpr: 2 },
  { id: "ipad-air", name: "iPad Air", category: "tablet", width: 820, height: 1180, dpr: 2 },
  { id: "ipad-pro-11", name: 'iPad Pro 11"', category: "tablet", width: 834, height: 1194, dpr: 2 },
  { id: "ipad-pro-12", name: 'iPad Pro 12.9"', category: "tablet", width: 1024, height: 1366, dpr: 2 },
  { id: "galaxy-tab-s7", name: "Galaxy Tab S7", category: "tablet", width: 800, height: 1280, dpr: 2 },
  { id: "surface-pro-7", name: "Surface Pro 7", category: "tablet", width: 912, height: 1368, dpr: 2 },
];

export const QUICK_LAPTOP_PRESETS: DevicePreset[] = [
  { id: "macbook-air-13", name: 'MacBook Air 13"', category: "laptop", width: 1280, height: 800, dpr: 2 },
  { id: "macbook-pro", name: "MacBook Pro", category: "laptop", width: 1440, height: 900, dpr: 2 },
  { id: "macbook-pro-16", name: 'MacBook Pro 16"', category: "laptop", width: 1728, height: 1117, dpr: 2 },
  { id: "laptop-hd", name: "Laptop HD", category: "laptop", width: 1366, height: 768, dpr: 1 },
  { id: "laptop-fhd-125", name: "Laptop FHD (125%)", category: "laptop", width: 1536, height: 864, dpr: 1.25 },
];

export const QUICK_DESKTOP_PRESETS: DevicePreset[] = [
  { id: "desktop-hd", name: "Desktop HD", category: "desktop", width: 1280, height: 720, dpr: 1 },
  { id: "desktop-monitor", name: "Desktop monitor", category: "desktop", width: 1920, height: 1080, dpr: 1 },
  { id: "desktop-qhd", name: "Desktop QHD", category: "desktop", width: 2560, height: 1440, dpr: 1 },
  { id: "desktop-ultrawide", name: "Ultrawide", category: "desktop", width: 3440, height: 1440, dpr: 1 },
];

// Generate DevicePreset items for every smartphone model in the catalog
export const ALL_PHONE_DATABASE_PRESETS: DevicePreset[] = ALL_SMARTPHONE_MODELS.flatMap((model) => {
  const isFoldableModel = model.formFactor === "fold" || model.formFactor === "flip";
  const presets: DevicePreset[] = [
    {
      ...phoneModelToPreset(model, "cover"),
      modelId: model.id,
      foldState: isFoldableModel ? "cover" : undefined,
      dpr: model.display.dpr,
      specSummary: `${model.display.diagonalInches}" ${model.display.physicalResolution.width}×${model.display.physicalResolution.height} (${model.display.refreshRate}Hz)`,
    },
  ];

  if (model.innerDisplay) {
    presets.push({
      ...phoneModelToPreset(model, "inner"),
      modelId: model.id,
      foldState: "inner",
      dpr: model.innerDisplay.dpr,
      specSummary: `${model.innerDisplay.diagonalInches}" ${model.innerDisplay.physicalResolution.width}×${model.innerDisplay.physicalResolution.height} (${model.innerDisplay.refreshRate}Hz)`,
    });
  }

  return presets;
});

// Backward-compatible presets list containing defaults, computers, and all smartphone models
export const DEVICE_PRESETS: DevicePreset[] = [
  // Quick popular phones
  { id: "iphone-se", name: "iPhone SE", category: "phone", width: 375, height: 667, dpr: 2, modelId: "apple-iphone-se-3" },
  { id: "iphone-13", name: "iPhone 13", category: "phone", width: 390, height: 844, dpr: 3, modelId: "apple-iphone-13" },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", category: "phone", width: 393, height: 852, dpr: 3, modelId: "apple-iphone-14-pro" },
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", category: "phone", width: 430, height: 932, dpr: 3, modelId: "apple-iphone-14-pro-max" },
  { id: "pixel-7", name: "Pixel 7", category: "phone", width: 412, height: 915, dpr: 2.625, modelId: "google-pixel-7" },
  { id: "galaxy-s23", name: "Galaxy S23", category: "phone", width: 360, height: 780, dpr: 3, modelId: "samsung-galaxy-s23" },
  { id: "galaxy-z-fold-5", name: "Galaxy Z Fold 5 (folded)", category: "phone", width: 344, height: 882, dpr: 2.625, modelId: "samsung-galaxy-z-fold-5", foldState: "cover" },

  // Tablets
  ...QUICK_TABLET_PRESETS,

  // Laptops
  ...QUICK_LAPTOP_PRESETS,

  // Desktops
  ...QUICK_DESKTOP_PRESETS,

  // All individual smartphone models
  ...ALL_PHONE_DATABASE_PRESETS,
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
    modelId: preset.modelId,
    foldState: preset.foldState,
    dpr: preset.dpr,
  };
}

export function isFoldable(device: Pick<DeviceInstance, "presetId" | "modelId" | "foldState">): boolean {
  if (device.foldState !== undefined) return true;
  const modelId = device.modelId || device.presetId.replace(/-inner$/, "");
  const model = getPhoneModel(modelId);
  return !!model?.innerDisplay;
}

export function toggleFoldState(device: DeviceInstance): DeviceInstance {
  const modelId = device.modelId || device.presetId.replace(/-inner$/, "");
  const model = getPhoneModel(modelId);
  if (!model || !model.innerDisplay) return device;

  const currentIsInner = device.foldState === "inner" || device.presetId.endsWith("-inner");
  const nextState: "cover" | "inner" = currentIsInner ? "cover" : "inner";
  const spec = nextState === "inner" ? model.innerDisplay : model.display;

  const baseName = model.model;
  const suffix = nextState === "inner" ? " (Unfolded)" : " (Folded)";

  return {
    ...device,
    foldState: nextState,
    presetId: nextState === "inner" ? `${model.id}-inner` : model.id,
    name: `${baseName}${suffix}`,
    width: spec.viewportWidth,
    height: spec.viewportHeight,
    dpr: spec.dpr,
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
