"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Globe, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { normalizeUrl } from "@/lib/url";

interface UrlInputBarProps {
  id?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: "hero" | "cta";
  showQuickPills?: boolean;
}

const QUICK_SAMPLES = [
  { label: "Stripe", url: "https://stripe.com" },
  { label: "Linear", url: "https://linear.app" },
  { label: "GitHub", url: "https://github.com" },
  { label: "Tailwind CSS", url: "https://tailwindcss.com" },
];

export default function UrlInputBar({
  id = "url-preview-input",
  placeholder = "Paste any website URL to preview…",
  buttonText = "Preview Website",
  variant = "hero",
  showQuickPills = true,
}: UrlInputBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter a website URL to preview.");
      return;
    }

    const result = normalizeUrl(trimmed);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setIsSubmitting(true);
    // Navigate to the existing previewer workspace route with the validated URL
    router.push(`/workspace?url=${encodeURIComponent(result.url)}`);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setValue(sampleUrl);
    setError(null);
    setIsSubmitting(true);
    router.push(`/workspace?url=${encodeURIComponent(sampleUrl)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`relative flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 bg-white rounded-2xl sm:rounded-full border border-[#E8DDFD] shadow-pastel-md hover:shadow-pastel-lg focus-within:shadow-input-focus focus-within:border-[#C4B5FD] transition-all duration-300 ${
          error ? "border-red-300 ring-2 ring-red-100" : ""
        }`}
      >
        <div className="flex items-center w-full px-3 py-1.5 sm:py-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FBE8F7]/60 text-[#11172B] mr-2.5 shrink-0">
            <Globe className="w-4 h-4 text-[#11172B]" />
          </div>
          <label htmlFor={id} className="sr-only">
            Website URL to preview
          </label>
          <input
            id={id}
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            className="w-full text-sm sm:text-base text-[#11172B] placeholder:text-[#8597CE] bg-transparent outline-none font-medium selection:bg-[#E8DDFD]"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-[#11172B] hover:bg-[#1D284B] active:bg-[#090D1A] text-white text-sm sm:text-[15px] font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer disabled:opacity-75"
        >
          <span>{isSubmitting ? "Opening Workspace…" : buttonText}</span>
          <ArrowRight className="w-4 h-4 text-[#079B73] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>

      {/* Inline validation message */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-2.5 flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-red-700 bg-red-50/90 border border-red-200/80 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick sample pills */}
      {showQuickPills && (
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#5B71B5]">
          <span className="flex items-center gap-1 font-medium text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#079B73]" /> Try with:
          </span>
          {QUICK_SAMPLES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleSelectSample(sample.url)}
              className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-[#11172B] border border-[#E8DDFD] hover:border-[#079B73]/50 shadow-xs hover:shadow-sm font-medium transition-all duration-150 cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
