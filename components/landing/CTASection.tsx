"use client";

import UrlInputBar from "./UrlInputBar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative py-12 sm:py-16 bg-cta-gradient overflow-hidden border-t border-[#E8DDFD]"
    >
      {/* Ambient background blurs */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] bg-gradient-to-r from-[#FBE8F7]/80 via-[#E8DDFD]/80 to-[#DCEBFF]/80 rounded-full blur-3xl -z-10 pointer-events-none"
      />

      {/* Emerald accent dots */}
      <div aria-hidden="true" className="absolute top-8 right-16 w-2 h-2 rounded-full bg-[#079B73]/40" />
      <div aria-hidden="true" className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-[#079B73]/30" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Headline */}
        <h2
          id="cta-heading"
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#11172B] tracking-tight leading-tight"
        >
          Bring Every Viewport Into Focus.
        </h2>

        {/* Supporting text */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-[#3F5496] max-w-2xl mx-auto leading-relaxed">
          Start exploring responsive layouts from a single, flexible workspace.
        </p>

        {/* URL Input */}
        <div className="mt-10 max-w-2xl mx-auto">
          <UrlInputBar
            id="cta-preview-input"
            placeholder="Enter a website URL..."
            buttonText="Preview Website"
            variant="cta"
            showQuickPills={false}
          />
        </div>

        {/* Secondary workspace link */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs sm:text-sm text-[#5B71B5]">
          <span>Or skip URL entry:</span>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1 font-semibold text-[#11172B] hover:text-[#079B73] underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors"
          >
            <span>Open Empty Workspace Canvas</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#079B73]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
