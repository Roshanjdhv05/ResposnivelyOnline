"use client";

import Link from "next/link";
import { ExternalLink, ArrowRight, ShieldCheck, Code2 } from "lucide-react";

export default function ResourcesSection() {
  return (
    <section id="resources" className="py-10 sm:py-14 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#11172B] tracking-tight">
            Resources for Better Web Experiences.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3F5496] leading-relaxed">
            Essential architectural deep dives, viewport guides, and community engineering writeups.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured External Article by Manoj Vivek (Span 7) */}
          <div className="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#FBE8F7]/40 via-white to-[#E8DDFD]/40 border-2 border-[#E8DDFD] shadow-pastel-sm hover:shadow-pastel-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11172B] text-white text-xs font-semibold">
                  <ExternalLink className="w-3 h-3 text-[#079B73]" />
                  <span>External Technical Post</span>
                </span>
                <span className="text-xs font-mono text-[#5B71B5]">Architecture Deep-Dive</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#11172B] tracking-tight group-hover:text-[#079B73] transition-colors leading-snug">
                Learnings That Led to Screenshot v2
              </h3>

              {/* Explicit Attribution to Manoj Vivek */}
              <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-[#079B73]">
                <span>By Manoj Vivek</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-normal">Original Article on responsively.app</span>
              </div>

              <p className="mt-4 text-sm sm:text-base text-[#3F5496] leading-relaxed">
                An insightful look into how cross-origin iframe restrictions, browser security boundaries,
                and the Screen Capture API shaped modern viewport screenshot engines. Learn why region capture
                and pixel ratio adjustments are critical for crisp device exports.
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-white/80 border border-[#E8DDFD] text-xs text-[#5B71B5] leading-relaxed">
                <p className="font-semibold text-[#11172B] mb-1">Key Engineering Takeaways:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Why browsers restrict direct pixel access across origin boundaries</li>
                  <li>Implementing Chrome & Edge Region Capture for exact viewport bounds</li>
                  <li>Handling pixel density multipliers on Retina and HiDPI screens</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#E8DDFD] flex items-center justify-between">
              <span className="text-xs text-slate-500">External resource • responsively.app</span>
              <a
                href="https://responsively.app/blog/learnings-that-led-to-screenshot-v2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11172B] text-white hover:bg-[#1D284B] text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#079B73]" />
              </a>
            </div>
          </div>

          {/* Secondary Curated Resources (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Guide 1 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DDFD] shadow-xs hover:shadow-pastel-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#079B73] mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security & Sandboxing</span>
                </div>
                <h4 className="text-lg font-bold text-[#11172B]">
                  Understanding Iframe Sandboxing & CSP Framing Headers
                </h4>
                <p className="text-xs sm:text-sm text-[#3F5496] mt-2 leading-relaxed">
                  How X-Frame-Options and Content Security Policy (frame-ancestors) protect web users, and how Responsivelyonline identifies framing policies upfront.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#11172B]">
                <span>Technical Explainer</span>
                <Link href="/docs#troubleshooting" className="text-[#079B73] hover:underline flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guide 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DDFD] shadow-xs hover:shadow-pastel-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#079B73] mb-2">
                  <Code2 className="w-4 h-4" />
                  <span>Open Source Community</span>
                </div>
                <h4 className="text-lg font-bold text-[#11172B]">
                  Contributing Custom Device Presets & Canvas Tools
                </h4>
                <p className="text-xs sm:text-sm text-[#3F5496] mt-2 leading-relaxed">
                  Join web developers contributing to the Responsively open source ecosystem. Submit new device dimensions and viewport profiles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#11172B]">
                <Link href="/docs#contributing" className="text-slate-600 hover:text-[#11172B] hover:underline flex items-center gap-1">
                  Contributor Docs
                </Link>
                <a
                  href="https://github.com/responsively-org/responsively-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#079B73] hover:underline flex items-center gap-1"
                >
                  GitHub Repo <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
