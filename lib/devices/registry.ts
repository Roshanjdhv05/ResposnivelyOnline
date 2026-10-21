import type { DevicePreset } from "../types";
import { APPLE_MODELS } from "./manufacturers/apple";
import { BBK_MODELS } from "./manufacturers/bbk";
import { GOOGLE_MODELS } from "./manufacturers/google";
import { MOTO_NOTHING_SONY_MODELS } from "./manufacturers/moto-nothing-sony";
import { ONEPLUS_MODELS } from "./manufacturers/oneplus";
import { OTHER_MODELS } from "./manufacturers/others";
import { SAMSUNG_MODELS } from "./manufacturers/samsung";
import { XIAOMI_MODELS } from "./manufacturers/xiaomi";
import type {
  DatabaseStatistics,
  DeviceFilterOptions,
  SmartphoneModel,
} from "./types";

/**
 * All individual smartphone models in the catalog.
 */
export const ALL_SMARTPHONE_MODELS: SmartphoneModel[] = [
  ...SAMSUNG_MODELS,
  ...APPLE_MODELS,
  ...GOOGLE_MODELS,
  ...ONEPLUS_MODELS,
  ...XIAOMI_MODELS,
  ...BBK_MODELS,
  ...MOTO_NOTHING_SONY_MODELS,
  ...OTHER_MODELS,
];

export const MODELS_BY_ID = new Map<string, SmartphoneModel>(
  ALL_SMARTPHONE_MODELS.map((model) => [model.id, model]),
);

export function getPhoneModel(id: string): SmartphoneModel | undefined {
  return MODELS_BY_ID.get(id);
}

/**
 * Converts a SmartphoneModel specification to a canvas DevicePreset.
 * For foldables, allows targeting the cover screen or inner unfolded screen.
 */
export function phoneModelToPreset(
  model: SmartphoneModel,
  screenState: "cover" | "inner" = "cover",
): DevicePreset {
  const isInner = screenState === "inner" && !!model.innerDisplay;
  const spec = isInner && model.innerDisplay ? model.innerDisplay : model.display;

  const suffix = model.formFactor === "fold" || model.formFactor === "flip"
    ? isInner
      ? " (Unfolded)"
      : " (Folded)"
    : "";

  return {
    id: isInner ? `${model.id}-inner` : model.id,
    name: `${model.model}${suffix}`,
    category: "phone",
    width: spec.viewportWidth,
    height: spec.viewportHeight,
  };
}

/**
 * All smartphone models converted to DevicePreset format for backward-compatible selector support.
 */
export const ALL_SMARTPHONE_PRESETS: DevicePreset[] = ALL_SMARTPHONE_MODELS.map((model) =>
  phoneModelToPreset(model, "cover"),
);

/**
 * Unique list of all manufacturers represented in the database.
 */
export const ALL_MANUFACTURERS: string[] = Array.from(
  new Set(ALL_SMARTPHONE_MODELS.map((m) => m.manufacturer)),
).sort();

/**
 * Unique sorted list of release years in descending order.
 */
export const ALL_RELEASE_YEARS: number[] = Array.from(
  new Set(ALL_SMARTPHONE_MODELS.map((m) => m.releaseYear)),
).sort((a, b) => b - a);

/**
 * Unique list of all product series.
 */
export const ALL_SERIES: string[] = Array.from(
  new Set(ALL_SMARTPHONE_MODELS.map((m) => m.series)),
).sort();

/**
 * Filter and search the smartphone database.
 */
export function filterSmartphoneModels(options: DeviceFilterOptions = {}): SmartphoneModel[] {
  let list = ALL_SMARTPHONE_MODELS;

  if (options.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    list = list.filter((m) => {
      const target = `${m.manufacturer} ${m.model} ${m.modelNumber ?? ""} ${m.series} ${m.variant ?? ""} ${m.display.displayTechnology}`.toLowerCase();
      return tokens.every((token) => target.includes(token));
    });
  }

  if (options.manufacturers && options.manufacturers.length > 0) {
    const set = new Set(options.manufacturers);
    list = list.filter((m) => set.has(m.manufacturer));
  }

  if (options.series && options.series.length > 0) {
    const set = new Set(options.series);
    list = list.filter((m) => set.has(m.series));
  }

  if (options.releaseYears && options.releaseYears.length > 0) {
    const set = new Set(options.releaseYears);
    list = list.filter((m) => set.has(m.releaseYear));
  }

  if (options.formFactors && options.formFactors.length > 0) {
    const set = new Set(options.formFactors);
    list = list.filter((m) => set.has(m.formFactor));
  }

  if (options.verificationStatus) {
    list = list.filter((m) => m.verificationStatus === options.verificationStatus);
  }

  if (typeof options.minScreenSize === "number") {
    list = list.filter((m) => m.display.diagonalInches >= options.minScreenSize!);
  }

  if (typeof options.maxScreenSize === "number") {
    list = list.filter((m) => m.display.diagonalInches <= options.maxScreenSize!);
  }

  // Sorting
  const sortBy = options.sortBy ?? "year-desc";
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case "year-desc":
        return b.releaseYear - a.releaseYear || a.model.localeCompare(b.model);
      case "year-asc":
        return a.releaseYear - b.releaseYear || a.model.localeCompare(b.model);
      case "screen-size-desc":
        return b.display.diagonalInches - a.display.diagonalInches;
      case "screen-size-asc":
        return a.display.diagonalInches - b.display.diagonalInches;
      case "name":
      default:
        return a.model.localeCompare(b.model);
    }
  });
}

/**
 * Computes database statistics including verified vs estimated counts and manufacturer breakdown.
 */
export function getDatabaseStatistics(): DatabaseStatistics {
  const stats: DatabaseStatistics = {
    totalModels: ALL_SMARTPHONE_MODELS.length,
    totalManufacturers: ALL_MANUFACTURERS.length,
    totalGenerations: ALL_RELEASE_YEARS.length,
    verifiedCount: 0,
    estimatedCount: 0,
    unavailableCount: 0,
    foldableCount: 0,
    manufacturers: {},
    years: {},
  };

  for (const m of ALL_SMARTPHONE_MODELS) {
    if (m.verificationStatus === "verified") stats.verifiedCount++;
    else if (m.verificationStatus === "estimated") stats.estimatedCount++;
    else stats.unavailableCount++;

    if (m.formFactor === "fold" || m.formFactor === "flip") {
      stats.foldableCount++;
    }

    stats.manufacturers[m.manufacturer] = (stats.manufacturers[m.manufacturer] || 0) + 1;
    stats.years[m.releaseYear] = (stats.years[m.releaseYear] || 0) + 1;
  }

  return stats;
}
