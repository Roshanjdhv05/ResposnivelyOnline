"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "All Devices at Once",
    desc: "Compare mobile, tablet, laptop, and desktop layouts side-by-side. Four default devices open immediately: iPhone 14 Pro (393×852), iPad Mini (768×1024), MacBook Pro (1440×900), and Desktop (1920×1080).",
    tag: "MULTI-DEVICE PREVIEWS",
    benefit: "Spot layout differences instantly",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="9" width="22" height="14" rx="2" stroke="#11172B" strokeWidth="2.2" fill="none" />
        <path d="M1 25.5h26" stroke="#079B73" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="24" y="13" width="12" height="17" rx="2.5" stroke="#079B73" strokeWidth="2.2" fill="#E6F8F3" />
        <circle cx="30" cy="26.5" r="1" fill="#079B73" />
      </svg>
    ),
  },
  {
    title: "Infinite Canvas",
    desc: "Pan, zoom, and position device frames freely on an open spatial workspace. Drag previews anywhere, zoom in to inspect details, or zoom out for a bird's-eye view of all viewports at once.",
    tag: "INFINITE CANVAS",
    benefit: "Open spatial layout — no fixed grid",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="20" cy="20" r="13" stroke="#11172B" strokeWidth="2.2" fill="none" />
        <path d="M20 7v26M7 20h26" stroke="#079B73" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill="#079B73" />
      </svg>
    ),
  },
  {
    title: "Synchronized Interactions",
    desc: "Mirror supported scrolling, clicks, and navigation across compatible viewport frames. When you navigate on one device, other previews follow — where cross-origin security policies permit.",
    tag: "SYNCHRONIZED INTERACTIONS",
    benefit: "Test user flows across breakpoints",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 5A14.5 14.5 0 0 1 34.5 19.5" stroke="#079B73" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M34.5 12v7.5H27" stroke="#079B73" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 34A14.5 14.5 0 0 1 5.5 19.5" stroke="#11172B" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M5.5 27v-7.5H13" stroke="#11172B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Instant URL Preview",
    desc: "Paste any URL and watch it load across all configured viewports simultaneously. The app auto-prefixes https:// (or http:// for localhost), validates the address, and checks embedding headers before loading.",
    tag: "INSTANT URL LOADING",
    benefit: "See your site in every viewport immediately",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="20" cy="20" r="13" stroke="#11172B" strokeWidth="2.2" fill="none" />
        <path d="M7 20h26M20 7c-4 6-4 20 0 26M20 7c4 6 4 20 0 26" stroke="#079B73" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Custom Viewports",
    desc: "Specify exact pixel widths and heights (e.g. 360×740, 1024×768) for edge-case breakpoints. Rotate supported devices between portrait and landscape without reloading the embedded page.",
    tag: "CUSTOM VIEWPORTS",
    benefit: "Test any breakpoint precisely",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="6" y="10" width="16" height="22" rx="2" stroke="#11172B" strokeWidth="2.2" fill="none" />
        <rect x="20" y="14" width="14" height="10" rx="2" stroke="#079B73" strokeWidth="2.2" fill="#E6F8F3" />
        <path d="M11 30h6" stroke="#079B73" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Device Library",
    desc: "Select from built-in presets including iPhone 14 Pro, iPad Mini, iPad Pro, MacBook Pro, and desktop monitors. Add fully custom dimensions for foldable screens or specific target devices.",
    tag: "DEVICE LIBRARY",
    benefit: "Popular presets plus custom sizes",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 6L35 13.5L20 21L5 13.5L20 6Z" stroke="#11172B" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
        <path d="M5 19.5L20 27L35 19.5" stroke="#079B73" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 25.5L20 33L35 25.5" stroke="#11172B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Preview Suites",
    desc: "Save device selections, zoom levels, orientations, and workspace theme to localStorage. Your preferred configuration persists between sessions so you can return to exactly your testing setup.",
    tag: "PREVIEW SUITES",
    benefit: "Persistent workspace preferences",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="10" y1="6" x2="10" y2="34" stroke="#11172B" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="7" y="11" width="6" height="9" rx="3" fill="#079B73" />
        <line x1="20" y1="6" x2="20" y2="34" stroke="#11172B" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="17" y="21" width="6" height="9" rx="3" fill="#079B73" />
        <line x1="30" y1="6" x2="30" y2="34" stroke="#11172B" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="27" y="14" width="6" height="9" rx="3" fill="#079B73" />
      </svg>
    ),
  },
  {
    title: "Canvas Controls",
    desc: "Refresh all previews simultaneously, zoom all devices to a proportional fit, reset the layout, toggle compact mode, or switch between dark and light workspace themes — all from the top toolbar.",
    tag: "CANVAS CONTROLS",
    benefit: "One-click workspace management",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="5" y="8" width="30" height="5" rx="2.5" stroke="#11172B" strokeWidth="2" fill="none" />
        <rect x="5" y="18" width="20" height="5" rx="2.5" stroke="#079B73" strokeWidth="2" fill="none" />
        <rect x="5" y="28" width="25" height="5" rx="2.5" stroke="#11172B" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "Route Navigation",
    desc: "Click links within a preview to navigate to new pages while the other viewports follow along. iframes are sandboxed to allow scripts, forms, and popups while preventing top-level navigation away from the workspace.",
    tag: "ROUTE NAVIGATION",
    benefit: "Inspect multi-page flows across sizes",
    href: "/workspace",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 20h18M20 12l8 8-8 8" stroke="#079B73" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="20" r="4" stroke="#11172B" strokeWidth="2.2" fill="none" />
      </svg>
    ),
  },
  {
    title: "Developer Workflow",
    desc: "Inspect your localhost or staging URL simultaneously across screen sizes in one workspace. In development mode, private and loopback addresses are fully accessible for local project testing.",
    tag: "DEVELOPER WORKFLOW",
    benefit: "Localhost support in dev mode",
    href: "/docs",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M14 16l-6 4 6 4M26 16l6 4-6 4" stroke="#11172B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 12l-4 16" stroke="#079B73" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#FAFCFE] via-white to-[#F8FBFA] relative overflow-hidden"
    >
      {/* Soft pastel ambient glows */}
      <div aria-hidden="true" className="absolute top-10 left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-[#FBE8F7]/60 rounded-full blur-3xl pointer-events-none -z-0" />
      <div aria-hidden="true" className="absolute top-16 right-1/4 translate-x-1/2 w-[500px] h-[300px] bg-[#D1F4E9]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F8F3] text-xs font-bold tracking-wider text-[#079B73] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#079B73]" aria-hidden="true" />
            <span>Features</span>
          </div>

          <h2
            id="features-heading"
            className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#11172B] tracking-tight leading-[1.1]"
          >
            Everything You Need for{" "}
            <span className="relative inline-block text-[#079B73]">
              Responsive Web Testing
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#8CE3C7]"
                viewBox="0 0 400 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M4 14C85 5 240 4 396 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-6 text-sm sm:text-base md:text-[17px] text-[#5B71B5] leading-relaxed max-w-2xl mx-auto">
            From multiple device previews to synchronized interactions, Responsivelyonline makes it
            simple to test, compare, and perfect responsive designs.
          </p>
        </div>

        {/* Editorial borderless feature list with dividers */}
        <div className="space-y-0">
          {features.map((item, index) => (
            <div key={item.title}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start py-10 sm:py-12 group">
                {/* Icon + tag column */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-4 md:gap-5">
                  <div className="shrink-0 text-[#11172B]">{item.icon}</div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#079B73] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#079B73] shrink-0" aria-hidden="true" />
                      {item.tag}
                    </span>
                    <p className="mt-1.5 text-[11px] text-[#8597CE] font-medium leading-tight hidden md:block">
                      {item.benefit}
                    </p>
                  </div>
                </div>

                {/* Content column */}
                <div className="md:col-span-7">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#11172B] tracking-tight mb-3 group-hover:text-[#079B73] transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-[#64748B] leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                  <p className="mt-2 text-[11px] text-[#8597CE] font-medium md:hidden">
                    {item.benefit}
                  </p>
                </div>

                {/* Link column */}
                <div className="md:col-span-2 flex md:justify-end md:pt-1">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#079B73] hover:text-[#05805e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] focus-visible:ring-offset-2 rounded transition-colors group/link"
                    aria-label={`Explore ${item.title} in workspace`}
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Divider between features */}
              {index < features.length - 1 && (
                <div className="border-b border-[#E8DDFD]/70" role="separator" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
