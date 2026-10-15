"use client";

import Image from "next/image";
import { Smartphone, Layers, RefreshCw, ChevronDown } from "lucide-react";
import UrlInputBar from "./UrlInputBar";
import HeroShowcase from "./HeroShowcase";

export default function HeroSection() {
  return (
    <section
      aria-label="Hero — Responsive website previewer"
      className="relative pt-20 sm:pt-24 lg:pt-28 pb-0 overflow-hidden bg-hero-glow"
    >
      {/* Subtle background ambient pastel blurs */}
      <div
        aria-hidden="true"
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[350px] bg-gradient-to-r from-[#FBE8F7]/80 via-[#E8DDFD]/70 to-[#DCEBFF]/80 rounded-full blur-3xl -z-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Brand wordmark */}
          <div className="mb-5 sm:mb-6 flex justify-center animate-in fade-in duration-500">
            <Image
              src="/Responsively Device Logo.png"
              alt="Responsivelyonline — Multi-Screen Studio"
              width={320}
              height={80}
              className="h-14 sm:h-16 lg:h-20 w-auto object-contain drop-shadow-sm"
              priority
            />
          </div>

          {/* H1 — One per page */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#11172B] leading-[1.08] sm:leading-[1.05]">
            See Your Website on{" "}
            <span className="relative inline-block text-[#079B73]">
              Every Screen.
              {/* Hand-drawn curved underline accent */}
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#079B73]"
                viewBox="0 0 280 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10.5C65 2.5 175 1.5 276 11"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Supporting text */}
          <p className="mt-6 sm:mt-7 text-base sm:text-lg md:text-xl text-[#3F5496] max-w-2xl mx-auto leading-relaxed">
            Explore responsive layouts, compare device sizes, and test supported interactions in one
            visual workspace.
          </p>

          {/* URL Input — hero focus */}
          <div className="mt-8 sm:mt-10">
            <UrlInputBar
              id="hero-preview-input"
              placeholder="Paste your website URL to preview..."
              buttonText="Preview Website"
              variant="hero"
              showQuickPills={true}
            />

            {/* Caption */}
            <p className="mt-3 text-xs sm:text-[13px] text-[#5B71B5] font-medium">
              Start by pasting any website URL above — no sign-up required.
            </p>

            {/* Secondary CTA */}
            <div className="mt-4 flex items-center justify-center">
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#11172B] hover:text-[#079B73] hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors"
              >
                <span>Explore Features</span>
                <ChevronDown className="w-4 h-4 text-[#079B73]" aria-hidden="true" />
              </a>
            </div>

            {/* Three benefit indicators */}
            <div className="mt-7 pt-6 border-t border-[#E8DDFD]/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-[#11172B]">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E8DDFD]/60 text-[#11172B]"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#079B73]" />
                </div>
                <span>Multi-device previews</span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-[#FBE8F7]/70 text-[#11172B]"
                >
                  <Layers className="w-3.5 h-3.5 text-[#079B73]" />
                </div>
                <span>Infinite canvas</span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-[#DCEBFF]/70 text-[#11172B]"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#079B73]" />
                </div>
                <span>Synchronized interactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product visualization showcase */}
        <HeroShowcase />
      </div>
    </section>
  );
}
