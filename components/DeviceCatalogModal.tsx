"use client";

import {
  Check,
  CheckSquare,
  Clock,
  ExternalLink,
  FoldVertical,
  Laptop,
  Maximize2,
  Monitor,
  RotateCw,
  Search,
  SlidersHorizontal,
  Smartphone,
  Square,
  Star,
  Tablet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ALL_MANUFACTURERS,
  ALL_RELEASE_YEARS,
  ALL_SERIES,
  filterSmartphoneModels,
  getDatabaseStatistics,
  phoneModelToPreset,
} from "@/lib/devices/registry";
import {
  QUICK_DESKTOP_PRESETS,
  QUICK_LAPTOP_PRESETS,
  QUICK_TABLET_PRESETS,
} from "@/lib/devices";
import type { FormFactor, SmartphoneModel, VerificationStatus } from "@/lib/devices/types";
import type { DevicePreset } from "@/lib/types";

interface DeviceCatalogModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPreset: (preset: DevicePreset) => void;
  onSelectMultiplePresets?: (presets: DevicePreset[]) => void;
  onCustomViewport: () => void;
  currentPresetId?: string;
  title?: string;
}

const FAVORITES_KEY = "rwp:favorite-device-ids";
const RECENTS_KEY = "rwp:recent-device-ids";

export default function DeviceCatalogModal({
  open,
  onClose,
  onSelectPreset,
  onSelectMultiplePresets,
  onCustomViewport,
  currentPresetId,
  title = "Device Library & Smartphone Catalog",
}: DeviceCatalogModalProps) {
  if (!open) return null;
  return (
    <DeviceCatalogDialog
      onClose={onClose}
      onSelectPreset={onSelectPreset}
      onSelectMultiplePresets={onSelectMultiplePresets}
      onCustomViewport={onCustomViewport}
      currentPresetId={currentPresetId}
      title={title}
    />
  );
}

function DeviceCatalogDialog({
  onClose,
  onSelectPreset,
  onSelectMultiplePresets,
  onCustomViewport,
  currentPresetId,
  title,
}: Omit<DeviceCatalogModalProps, "open">) {
  const [activeTab, setActiveTab] = useState<"phones" | "computers" | "favorites" | "recents">("phones");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("all");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedFormFactor, setSelectedFormFactor] = useState<string>("all");
  const [selectedVerification, setSelectedVerification] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"year-desc" | "year-asc" | "screen-size-desc" | "screen-size-asc" | "name">("year-desc");

  // Multi-select state
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedPresets, setSelectedPresets] = useState<Map<string, DevicePreset>>(new Map());

  // Foldable choice mapping: modelId -> "cover" | "inner"
  const [foldChoices, setFoldChoices] = useState<Record<string, "cover" | "inner">>({});

  // Favorites & Recents in localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogId = useId();

  // Load favorites & recents on mount
  useEffect(() => {
    try {
      const favRaw = window.localStorage.getItem(FAVORITES_KEY);
      if (favRaw) setFavoriteIds(JSON.parse(favRaw));
      const recRaw = window.localStorage.getItem(RECENTS_KEY);
      if (recRaw) setRecentIds(JSON.parse(recRaw));
    } catch {
      // ignore localStorage errors
    }
    searchInputRef.current?.focus();
  }, []);

  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const recordRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const next = [id, ...filtered].slice(0, 30);
      try {
        window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Filter phones
  const filteredPhones = useMemo(() => {
    const options = {
      searchQuery,
      manufacturers: selectedManufacturer !== "all" ? [selectedManufacturer] : undefined,
      series: selectedSeries !== "all" ? [selectedSeries] : undefined,
      releaseYears: selectedYear !== "all" ? [Number(selectedYear)] : undefined,
      formFactors: selectedFormFactor !== "all" ? [selectedFormFactor as FormFactor] : undefined,
      verificationStatus: selectedVerification !== "all" ? (selectedVerification as VerificationStatus) : undefined,
      sortBy,
    };

    let models = filterSmartphoneModels(options);

    if (activeTab === "favorites") {
      const favSet = new Set(favoriteIds);
      models = models.filter((m) => favSet.has(m.id));
    } else if (activeTab === "recents") {
      const recSet = new Set(recentIds);
      models = models.filter((m) => recSet.has(m.id));
    }

    return models;
  }, [
    searchQuery,
    selectedManufacturer,
    selectedSeries,
    selectedYear,
    selectedFormFactor,
    selectedVerification,
    sortBy,
    activeTab,
    favoriteIds,
    recentIds,
  ]);

  // Non-phone presets (Tablets, Laptops, Desktops)
  const computerPresets = useMemo(() => {
    const all = [
      ...QUICK_TABLET_PRESETS,
      ...QUICK_LAPTOP_PRESETS,
      ...QUICK_DESKTOP_PRESETS,
    ];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter((p) => p.name.toLowerCase().includes(q) || p.category.includes(q));
  }, [searchQuery]);

  const stats = useMemo(() => getDatabaseStatistics(), []);

  // Handle single preset choice
  const handleSelectModel = (model: SmartphoneModel, screenChoice?: "cover" | "inner") => {
    const choice = screenChoice || foldChoices[model.id] || "cover";
    const preset = phoneModelToPreset(model, choice);
    preset.modelId = model.id;
    preset.foldState = model.formFactor === "fold" || model.formFactor === "flip" ? choice : undefined;
    preset.dpr = choice === "inner" && model.innerDisplay ? model.innerDisplay.dpr : model.display.dpr;
    preset.specSummary = `${model.display.diagonalInches}" ${model.display.physicalResolution.width}×${model.display.physicalResolution.height}`;

    if (isMultiSelectMode) {
      toggleMultiSelectPreset(preset);
      return;
    }

    recordRecent(model.id);
    onSelectPreset(preset);
    onClose();
  };

  const handleSelectComputer = (preset: DevicePreset) => {
    if (isMultiSelectMode) {
      toggleMultiSelectPreset(preset);
      return;
    }
    recordRecent(preset.id);
    onSelectPreset(preset);
    onClose();
  };

  const toggleMultiSelectPreset = (preset: DevicePreset) => {
    setSelectedPresets((prev) => {
      const next = new Map(prev);
      if (next.has(preset.id)) {
        next.delete(preset.id);
      } else {
        next.set(preset.id, preset);
      }
      return next;
    });
  };

  const handleAddAllSelected = () => {
    const list = Array.from(selectedPresets.values());
    if (list.length === 0) return;
    if (onSelectMultiplePresets) {
      onSelectMultiplePresets(list);
    } else {
      // Fallback: add each
      list.forEach((p) => onSelectPreset(p));
    }
    list.forEach((p) => {
      if (p.modelId) recordRecent(p.modelId);
    });
    onClose();
  };

  // Keyboard navigation & Escape
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="flex flex-col h-[92vh] max-h-[900px] w-full max-w-5xl rounded-xl border border-line bg-surface shadow-2xl overflow-hidden text-fg">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3 bg-surface2/40 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Smartphone size={18} className="text-accent shrink-0" aria-hidden />
            <h2 id={dialogId} className="text-sm font-semibold truncate">
              {title}
            </h2>
            <span className="hidden sm:inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 text-2xs font-medium text-accent">
              {stats.totalModels} Models · {stats.totalManufacturers} Brands
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onCustomViewport();
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted hover:text-fg hover:bg-surface2 transition-colors"
            >
              <SlidersHorizontal size={13} aria-hidden />
              <span>Custom Viewport</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close device catalog"
              className="rounded-md p-1.5 text-muted hover:bg-surface2 hover:text-fg transition-colors"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
        </div>

        {/* Search Bar & Multi-Select Toggle */}
        <div className="border-b border-line px-4 py-2.5 bg-surface shrink-0 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, series or variant (e.g. Samsung S24, iPhone 16, Pixel 9, Fold)..."
              className="h-9 w-full rounded-lg border border-line bg-surface2/60 pl-9 pr-8 text-xs text-fg placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMultiSelectMode((v) => !v);
                if (isMultiSelectMode) setSelectedPresets(new Map());
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isMultiSelectMode
                  ? "border-accent bg-accent/15 text-accent font-semibold"
                  : "border-line bg-surface text-muted hover:bg-surface2 hover:text-fg"
              }`}
            >
              {isMultiSelectMode ? <CheckSquare size={14} /> : <Square size={14} />}
              <span>Multi-Device Add</span>
              {isMultiSelectMode && selectedPresets.size > 0 && (
                <span className="ml-1 rounded-full bg-accent px-1.5 py-0.2 text-[10px] text-accent-fg">
                  {selectedPresets.size}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 border-b border-line bg-surface2/20 text-xs shrink-0 overflow-x-auto scroll-thin">
          <button
            type="button"
            onClick={() => setActiveTab("phones")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === "phones"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Smartphone size={14} />
            <span>Smartphones</span>
            <span className="rounded-full bg-surface2 px-1.5 py-0.2 text-[10px] text-muted">
              {stats.totalModels}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("computers")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === "computers"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Tablet size={14} />
            <span>Tablets & Computers</span>
            <span className="rounded-full bg-surface2 px-1.5 py-0.2 text-[10px] text-muted">
              {QUICK_TABLET_PRESETS.length + QUICK_LAPTOP_PRESETS.length + QUICK_DESKTOP_PRESETS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === "favorites"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Star size={14} className={favoriteIds.length > 0 ? "text-amber-400 fill-amber-400" : ""} />
            <span>Favorites</span>
            <span className="rounded-full bg-surface2 px-1.5 py-0.2 text-[10px] text-muted">
              {favoriteIds.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("recents")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === "recents"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Clock size={14} />
            <span>Recent</span>
            <span className="rounded-full bg-surface2 px-1.5 py-0.2 text-[10px] text-muted">
              {recentIds.length}
            </span>
          </button>
        </div>

        {/* Filter Controls (When on Phone tabs) */}
        {activeTab !== "computers" && (
          <div className="flex flex-col border-b border-line bg-surface/50 shrink-0">
            {/* Manufacturer Pills Bar */}
            <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto scroll-thin">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider shrink-0 mr-1">
                Brand:
              </span>
              <button
                type="button"
                onClick={() => setSelectedManufacturer("all")}
                className={`rounded-full px-2.5 py-1 text-2xs font-medium transition-colors shrink-0 ${
                  selectedManufacturer === "all"
                    ? "bg-accent text-accent-fg"
                    : "bg-surface2 text-muted hover:text-fg"
                }`}
              >
                All Brands ({stats.totalModels})
              </button>
              {ALL_MANUFACTURERS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSelectedManufacturer(brand)}
                  className={`rounded-full px-2.5 py-1 text-2xs font-medium transition-colors shrink-0 ${
                    selectedManufacturer === brand
                      ? "bg-accent text-accent-fg"
                      : "bg-surface2 text-muted hover:text-fg"
                  }`}
                >
                  {brand} ({stats.manufacturers[brand] ?? 0})
                </button>
              ))}
            </div>

            {/* Dropdown Filters & Sorting Bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-t border-line/60 bg-surface2/20 text-2xs overflow-x-auto scroll-thin">
              {/* Series Filter */}
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="rounded border border-line bg-surface px-2 py-1 text-2xs text-fg focus:border-accent focus:outline-none"
              >
                <option value="all">All Series</option>
                {ALL_SERIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Release Year */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded border border-line bg-surface px-2 py-1 text-2xs text-fg focus:border-accent focus:outline-none"
              >
                <option value="all">All Launch Years</option>
                {ALL_RELEASE_YEARS.map((yr) => (
                  <option key={yr} value={String(yr)}>
                    {yr} ({stats.years[yr] ?? 0})
                  </option>
                ))}
              </select>

              {/* Form Factor */}
              <select
                value={selectedFormFactor}
                onChange={(e) => setSelectedFormFactor(e.target.value)}
                className="rounded border border-line bg-surface px-2 py-1 text-2xs text-fg focus:border-accent focus:outline-none"
              >
                <option value="all">All Form Factors</option>
                <option value="standard">Standard Form Factor</option>
                <option value="fold">Foldable (Z Fold, Pixel Fold, Open)</option>
                <option value="flip">Flip Phones (Z Flip, Razr, Find Flip)</option>
                <option value="compact">Compact Flagships (&lt;6.1")</option>
                <option value="rugged">Rugged (XCover)</option>
              </select>

              {/* Verification Status */}
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="rounded border border-line bg-surface px-2 py-1 text-2xs text-fg focus:border-accent focus:outline-none"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Official Specs ({stats.verifiedCount})</option>
                <option value="estimated">Estimated / Roadmap ({stats.estimatedCount})</option>
              </select>

              {/* Sort By */}
              <div className="ml-auto flex items-center gap-1.5 shrink-0">
                <span className="text-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded border border-line bg-surface px-2 py-1 text-2xs text-fg focus:border-accent focus:outline-none"
                >
                  <option value="year-desc">Release Year (Newest)</option>
                  <option value="year-asc">Release Year (Oldest)</option>
                  <option value="screen-size-desc">Screen Size (Largest)</option>
                  <option value="screen-size-asc">Screen Size (Smallest)</option>
                  <option value="name">Model Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Body / Device Grid */}
        <div className="flex-1 overflow-y-auto p-4 scroll-thin">
          {activeTab === "computers" ? (
            /* Computers & Tablets View */
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                  <Tablet size={13} /> Tablets ({QUICK_TABLET_PRESETS.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {QUICK_TABLET_PRESETS.map((preset) => (
                    <ComputerCard
                      key={preset.id}
                      preset={preset}
                      isCurrent={preset.id === currentPresetId}
                      isSelected={selectedPresets.has(preset.id)}
                      isMultiSelect={isMultiSelectMode}
                      onSelect={() => handleSelectComputer(preset)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                  <Laptop size={13} /> Laptops ({QUICK_LAPTOP_PRESETS.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {QUICK_LAPTOP_PRESETS.map((preset) => (
                    <ComputerCard
                      key={preset.id}
                      preset={preset}
                      isCurrent={preset.id === currentPresetId}
                      isSelected={selectedPresets.has(preset.id)}
                      isMultiSelect={isMultiSelectMode}
                      onSelect={() => handleSelectComputer(preset)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                  <Monitor size={13} /> Desktops & Monitors ({QUICK_DESKTOP_PRESETS.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {QUICK_DESKTOP_PRESETS.map((preset) => (
                    <ComputerCard
                      key={preset.id}
                      preset={preset}
                      isCurrent={preset.id === currentPresetId}
                      isSelected={selectedPresets.has(preset.id)}
                      isMultiSelect={isMultiSelectMode}
                      onSelect={() => handleSelectComputer(preset)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : filteredPhones.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Smartphone size={36} className="text-muted/40 mb-3" />
              <p className="text-sm font-semibold text-fg">No phone models match your search</p>
              <p className="text-xs text-muted max-w-sm mt-1">
                Try searching with different terms or reset your manufacturer and year filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedManufacturer("all");
                  setSelectedSeries("all");
                  setSelectedYear("all");
                  setSelectedFormFactor("all");
                  setSelectedVerification("all");
                }}
                className="mt-4 rounded-md bg-surface2 px-3 py-1.5 text-xs font-medium text-fg hover:bg-surface2/80 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            /* Phones Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPhones.map((phone) => {
                const choice = foldChoices[phone.id] || "cover";
                const isFoldable = phone.formFactor === "fold" || phone.formFactor === "flip";
                const activeSpec = choice === "inner" && phone.innerDisplay ? phone.innerDisplay : phone.display;
                const isFav = favoriteIds.includes(phone.id);
                const isCurrent = phone.id === currentPresetId || `${phone.id}-inner` === currentPresetId;
                const isSelected = selectedPresets.has(phone.id) || selectedPresets.has(`${phone.id}-inner`);

                return (
                  <div
                    key={phone.id}
                    onClick={() => handleSelectModel(phone)}
                    className={`group relative flex flex-col justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent/10 ring-1 ring-accent"
                        : isCurrent
                        ? "border-accent/80 bg-surface2/70"
                        : "border-line bg-surface hover:border-line hover:bg-surface2/50 hover:shadow-md"
                    }`}
                  >
                    {/* Top Row: Manufacturer Badge, Year, Model Name, Star */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="rounded bg-surface2 px-1.5 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wide">
                              {phone.manufacturer}
                            </span>
                            <span className="rounded bg-surface2/70 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                              {phone.releaseYear}
                            </span>
                            {phone.variant && phone.variant !== "Standard" && (
                              <span className="rounded bg-surface2/70 px-1.5 py-0.5 text-[10px] font-medium text-fg/80">
                                {phone.variant}
                              </span>
                            )}
                            {phone.formFactor === "fold" && (
                              <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400">
                                Foldable
                              </span>
                            )}
                            {phone.formFactor === "flip" && (
                              <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-medium text-purple-400">
                                Flip
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-fg group-hover:text-accent transition-colors leading-snug">
                            {phone.model}
                          </h4>
                          {phone.modelNumber && (
                            <p className="text-[10px] text-muted/70 font-mono mt-0.5">
                              Model: {phone.modelNumber} · {phone.os}
                            </p>
                          )}
                        </div>

                        {/* Top Actions: Multi-select Checkbox + Favorite */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(phone.id, e)}
                            title={isFav ? "Remove from favorites" : "Add to favorites"}
                            className="p-1 rounded text-muted hover:text-amber-400 transition-colors"
                          >
                            <Star
                              size={15}
                              className={isFav ? "text-amber-400 fill-amber-400" : ""}
                            />
                          </button>
                          {isMultiSelectMode && (
                            <div className="pl-1">
                              {isSelected ? (
                                <CheckSquare size={16} className="text-accent" />
                              ) : (
                                <Square size={16} className="text-muted" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Display Specifications Grid */}
                      <div className="mt-2.5 rounded-lg border border-line/60 bg-surface2/40 p-2 text-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted">CSS Viewport:</span>
                          <span className="font-semibold text-fg tabular-nums">
                            {activeSpec.viewportWidth} × {activeSpec.viewportHeight} px
                            <span className="text-muted font-normal ml-1">@{activeSpec.dpr}x DPR</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted">Native Screen:</span>
                          <span className="tabular-nums text-fg/90">
                            {activeSpec.diagonalInches}" · {activeSpec.physicalResolution.width}×{activeSpec.physicalResolution.height} ({activeSpec.aspectRatio})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted">Display Panel:</span>
                          <span className="text-fg/80 truncate max-w-[200px]" title={activeSpec.displayTechnology}>
                            {activeSpec.displayTechnology} · {activeSpec.refreshRate}Hz
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Foldable Toggle / Add Action */}
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/50 pt-2 text-2xs">
                      {isFoldable && phone.innerDisplay ? (
                        <div
                          className="flex items-center gap-1 rounded-md border border-line bg-surface p-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setFoldChoices((prev) => ({ ...prev, [phone.id]: "cover" }))}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                              choice === "cover" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                            }`}
                          >
                            Cover ({phone.display.viewportWidth}×{phone.display.viewportHeight})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFoldChoices((prev) => ({ ...prev, [phone.id]: "inner" }))}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                              choice === "inner" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                            }`}
                          >
                            Inner ({phone.innerDisplay.viewportWidth}×{phone.innerDisplay.viewportHeight})
                          </button>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-muted">
                          {phone.verificationStatus === "verified" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <Check size={11} /> Verified Specs
                            </span>
                          ) : (
                            <span className="text-amber-400 font-medium">
                              Estimated Specs
                            </span>
                          )}
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {phone.source && (
                          <a
                            href={phone.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Official specifications page"
                            className="text-muted/60 hover:text-accent transition-colors"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <span className="rounded bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent group-hover:bg-accent group-hover:text-accent-fg transition-colors">
                          {isMultiSelectMode ? (isSelected ? "Selected" : "Select") : "Add Device"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-line px-4 py-3 bg-surface2/40 shrink-0 flex items-center justify-between gap-3 text-xs">
          <div className="text-muted text-2xs truncate">
            {activeTab === "computers" ? (
              <span>Showing standard tablets, laptops, and desktop monitor viewports</span>
            ) : (
              <span>
                Showing <strong className="text-fg">{filteredPhones.length}</strong> of {stats.totalModels} smartphone models ({stats.verifiedCount} verified)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isMultiSelectMode && selectedPresets.size > 0 && (
              <button
                type="button"
                onClick={handleAddAllSelected}
                className="rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-accent-fg hover:bg-accent/90 transition-colors shadow-sm"
              >
                Add {selectedPresets.size} Selected Device{selectedPresets.size > 1 ? "s" : ""}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg hover:bg-surface2 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ComputerCard({
  preset,
  isCurrent,
  isSelected,
  isMultiSelect,
  onSelect,
}: {
  preset: DevicePreset;
  isCurrent: boolean;
  isSelected: boolean;
  isMultiSelect: boolean;
  onSelect: () => void;
}) {
  const Icon = preset.category === "tablet" ? Tablet : preset.category === "laptop" ? Laptop : Monitor;

  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all ${
        isSelected
          ? "border-accent bg-accent/10 ring-1 ring-accent"
          : isCurrent
          ? "border-accent/80 bg-surface2/70"
          : "border-line bg-surface hover:border-line hover:bg-surface2/50"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="rounded-md bg-surface2 p-2 text-muted group-hover:text-accent group-hover:bg-accent/10 transition-colors shrink-0">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-fg truncate group-hover:text-accent transition-colors">
            {preset.name}
          </h4>
          <p className="text-2xs text-muted tabular-nums">
            {preset.width} × {preset.height} px {preset.dpr ? `@ ${preset.dpr}x` : ""}
          </p>
        </div>
      </div>

      <div className="shrink-0 pl-2">
        {isMultiSelect ? (
          isSelected ? (
            <CheckSquare size={16} className="text-accent" />
          ) : (
            <Square size={16} className="text-muted" />
          )
        ) : (
          <span className="rounded bg-surface2 px-2 py-0.5 text-2xs font-medium text-muted group-hover:bg-accent group-hover:text-accent-fg transition-colors">
            Add
          </span>
        )}
      </div>
    </div>
  );
}
