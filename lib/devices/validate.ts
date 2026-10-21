import {
  ALL_SMARTPHONE_MODELS,
  getDatabaseStatistics,
} from "./registry";
import type { DatabaseStatistics, SmartphoneModel } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: DatabaseStatistics;
}

/**
 * Validates the entire smartphone database against schema, constraints, and consistency rules.
 */
export function validateSmartphoneDatabase(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenIds = new Set<string>();

  for (const model of ALL_SMARTPHONE_MODELS) {
    // 1. Unique ID check
    if (!model.id || typeof model.id !== "string") {
      errors.push(`Model has missing or invalid id: ${JSON.stringify(model)}`);
      continue;
    }

    if (seenIds.has(model.id)) {
      errors.push(`Duplicate model id detected: "${model.id}" (${model.model})`);
    }
    seenIds.add(model.id);

    // 2. Required string fields
    if (!model.manufacturer || !model.manufacturer.trim()) {
      errors.push(`Model "${model.id}" is missing required manufacturer name`);
    }
    if (!model.model || !model.model.trim()) {
      errors.push(`Model "${model.id}" is missing required model name`);
    }
    if (!model.series || !model.series.trim()) {
      errors.push(`Model "${model.id}" is missing series information`);
    }
    if (!model.releaseYear || typeof model.releaseYear !== "number" || model.releaseYear < 2010 || model.releaseYear > 2030) {
      errors.push(`Model "${model.id}" has invalid releaseYear: ${model.releaseYear}`);
    }
    if (!model.source || !model.source.trim()) {
      warnings.push(`Model "${model.id}" has no source URL`);
    }

    // 3. Display dimension validations
    if (!model.display) {
      errors.push(`Model "${model.id}" is missing display specification`);
    } else {
      const d = model.display;
      if (!d.diagonalInches || d.diagonalInches <= 0 || d.diagonalInches > 15) {
        errors.push(`Model "${model.id}" has invalid display diagonal: ${d.diagonalInches}`);
      }
      if (!d.viewportWidth || d.viewportWidth < 200 || d.viewportWidth > 2000) {
        errors.push(`Model "${model.id}" has invalid viewportWidth: ${d.viewportWidth}`);
      }
      if (!d.viewportHeight || d.viewportHeight < 200 || d.viewportHeight > 3000) {
        errors.push(`Model "${model.id}" has invalid viewportHeight: ${d.viewportHeight}`);
      }
      if (!d.dpr || d.dpr <= 0 || d.dpr > 6) {
        errors.push(`Model "${model.id}" has invalid dpr: ${d.dpr}`);
      }
      if (
        !d.physicalResolution ||
        d.physicalResolution.width <= 0 ||
        d.physicalResolution.height <= 0
      ) {
        errors.push(`Model "${model.id}" has invalid physical resolution`);
      }
    }

    // 4. Foldable consistency checks
    if (model.formFactor === "fold" || model.formFactor === "flip") {
      if (!model.innerDisplay) {
        warnings.push(
          `Foldable/flip device "${model.id}" does not have innerDisplay specification defined`,
        );
      } else {
        const inner = model.innerDisplay;
        if (!inner.viewportWidth || inner.viewportWidth < 100) {
          errors.push(`Foldable "${model.id}" has invalid inner viewportWidth`);
        }
        if (!inner.viewportHeight || inner.viewportHeight < 100) {
          errors.push(`Foldable "${model.id}" has invalid inner viewportHeight`);
        }
      }
    }
  }

  const stats = getDatabaseStatistics();

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}

// Standalone runner when invoked directly
if (typeof require !== "undefined" && require.main === module) {
  const result = validateSmartphoneDatabase();
  console.log("=== Smartphone Database Validation Report ===");
  console.log(`Total Models: ${result.stats.totalModels}`);
  console.log(`Manufacturers: ${result.stats.totalManufacturers}`);
  console.log(`Release Years: ${result.stats.totalGenerations}`);
  console.log(`Verified Records: ${result.stats.verifiedCount}`);
  console.log(`Estimated Records: ${result.stats.estimatedCount}`);
  console.log(`Foldable / Flip Devices: ${result.stats.foldableCount}`);
  console.log(`Validation Passed: ${result.valid}`);
  if (result.errors.length > 0) {
    console.error(`Errors (${result.errors.length}):`, result.errors);
  }
  if (result.warnings.length > 0) {
    console.warn(`Warnings (${result.warnings.length}):`, result.warnings);
  }
}
