"use client";

import Link from "next/link";
import { ArrowRight, X, Check } from "lucide-react";

const beforeSteps = [
  "Open browser with dev tools",
  "Resize window to mobile width",
  "Check layout visually",
  "Resize to tablet, check again",
  "Resize to laptop, repeat",
  "Resize to desktop, repeat",
  "Navigate back, resize, re-check",
  "Lose track of which sizes you tested",
];

const afterSteps = [
  "Paste your URL into Responsivelyonline",
  "All four viewports load simultaneously",
  "Pan and zoom the infinite canvas freely",
  "Rotate devices to test landscape",
  "Refresh all previews in one click",
  "Synchronized scroll across viewports",
  "Add custom sizes for edge cases",
  "Every size inspected at the same moment",
];

export default function WorkflowComparisonSection() {
  return (
    <section
      id="workflow-comparison"
      aria-labelledby="workflow-heading"
      className="py-14 sm:py-20 bg-[#F8FAFD] border-y border-[#E8DDFD]/60 relative overflow-hidden"
    >
      {/* Subtle background blurs */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#FBE8F7]/50 blur-3xl pointer-events-none -z-0" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#DCEBFF]/50 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F8F3] text-xs font-bold tracking-wider text-[#079B73] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#079B73]" aria-hidden="true" />
            <span>Workflow Comparison</span>
          </div>

          <h2
            id="workflow-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#11172B] tracking-tight leading-[1.1]"
          >
            One Workspace vs. Repeated Resizing.
          </h2>

          <p className="mt-5 text-base sm:text-[17px] text-[#5B71B5] leading-relaxed max-w-2xl mx-auto">
            Inspecting multiple viewports one at a time means you never see them all at once.
            A multi-viewport workspace changes how you review responsive layouts.
          </p>
        </div>

        {/* Comparison columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Before: Single window */}
          <div
            className="rounded-3xl border border-red-100 bg-white p-7 sm:p-8"
            aria-label="Without Responsivelyonline"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-0.5">
                  Without a Multi-Viewport Tool
                </p>
                <h3 className="text-lg font-bold text-[#11172B]">Single browser window</h3>
              </div>
            </div>

            <ol className="space-y-3" aria-label="Single-window workflow steps">
              {beforeSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#64748B]">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full bg-red-50 text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 pt-5 border-t border-red-50">
              <p className="text-xs text-red-400 font-semibold">
                Result: Linear, error-prone, slow — you never see all sizes together
              </p>
            </div>
          </div>

          {/* After: Responsivelyonline */}
          <div
            className="rounded-3xl border border-[#079B73]/25 bg-gradient-to-br from-white to-[#E6F8F3]/30 p-7 sm:p-8 shadow-pastel-sm"
            aria-label="With Responsivelyonline"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-[#E6F8F3] flex items-center justify-center shrink-0"
              >
                <Check className="w-4 h-4 text-[#079B73]" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#079B73] mb-0.5">
                  With Responsivelyonline
                </p>
                <h3 className="text-lg font-bold text-[#11172B]">Infinite canvas workspace</h3>
              </div>
            </div>

            <ol className="space-y-3" aria-label="Multi-viewport workspace workflow steps">
              {afterSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#3F5496]">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full bg-[#E6F8F3] text-[#079B73] text-[10px] font-bold flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 pt-5 border-t border-[#E6F8F3]">
              <p className="text-xs text-[#079B73] font-semibold">
                Result: All viewports visible simultaneously — easier comparison, faster review
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer note */}
        <p className="mt-8 text-center text-xs text-[#8597CE] max-w-xl mx-auto">
          Responsivelyonline is a manual inspection aid and does not replace automated testing,
          cross-browser test suites, or real-device hardware validation.
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#11172B] hover:bg-[#1D284B] text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] focus-visible:ring-offset-2 transition-all duration-200 group"
          >
            <span>Try the Multi-Viewport Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#079B73] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
