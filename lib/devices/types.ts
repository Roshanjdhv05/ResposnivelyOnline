export type VerificationStatus = "verified" | "estimated" | "unavailable";

export type FormFactor = "standard" | "compact" | "rugged" | "fold" | "flip";

export type DeviceOrientation = "portrait" | "landscape";

export interface DisplaySpec {
  /** Screen label, e.g. "Cover Screen" or "Inner Main Screen" */
  screenName?: string;
  /** Diagonal screen measurement in inches */
  diagonalInches: number;
  /** Native physical display resolution in pixels */
  physicalResolution: {
    width: number;
    height: number;
  };
  /** Screen aspect ratio, e.g. "19.5:9", "20:9", "6:5" */
  aspectRatio: string;
  /** Logical CSS viewport width in CSS pixels (portrait orientation) */
  viewportWidth: number;
  /** Logical CSS viewport height in CSS pixels (portrait orientation) */
  viewportHeight: number;
  /** Device pixel ratio (DPR) */
  dpr: number;
  /** Official refresh rate in Hz */
  refreshRate: number;
  /** Display technology (e.g. Dynamic AMOLED 2X, Super Retina XDR OLED, LTPO) */
  displayTechnology: string;
}

export interface SmartphoneModel {
  /** Unique stable slug identifier, e.g. "samsung-galaxy-s24-ultra" */
  id: string;
  /** Official brand name, e.g. "Samsung", "Apple", "Google" */
  manufacturer: string;
  /** Complete commercial model name, e.g. "Samsung Galaxy S24 Ultra" */
  model: string;
  /** Official model identifier when available, e.g. "SM-S928B" */
  modelNumber?: string;
  /** Actual launch year */
  releaseYear: number;
  /** Product family/series, e.g. "Galaxy S", "Pixel", "iPhone Pro" */
  series: string;
  /** Variant identifier, e.g. "Ultra", "Plus", "Pro", "FE", "Mini" */
  variant?: string;
  /** Form factor category */
  formFactor: FormFactor;
  /** Supported orientations */
  supportedOrientations: DeviceOrientation[];
  /** Operating system / platform family */
  os: string;
  /** Official specification or reliable reference source URL */
  source: string;
  /** Verification status */
  verificationStatus: VerificationStatus;
  /** Primary / cover display specification */
  display: DisplaySpec;
  /** Unfolded inner display specification for foldables */
  innerDisplay?: DisplaySpec;
}

export interface DeviceFilterOptions {
  searchQuery?: string;
  manufacturers?: string[];
  series?: string[];
  releaseYears?: number[];
  formFactors?: FormFactor[];
  verificationStatus?: VerificationStatus;
  minScreenSize?: number;
  maxScreenSize?: number;
  sortBy?: "name" | "year-desc" | "year-asc" | "screen-size-desc" | "screen-size-asc";
}

export interface DatabaseStatistics {
  totalModels: number;
  totalManufacturers: number;
  totalGenerations: number;
  verifiedCount: number;
  estimatedCount: number;
  unavailableCount: number;
  foldableCount: number;
  manufacturers: Record<string, number>;
  years: Record<number, number>;
}
