"use client";

import {
  Monitor,
  Maximize,
  RotateCcw,
  ZoomIn,
  RefreshCw,
  GitFork,
  Move,
  Globe,
  PlusCircle,
  Expand,
  Check,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function UtilitiesSection() {
  const utilities = [
    {
      name: "Device Presets",
      desc: "Instant selection of popular devices: iPhone 14/15, iPad Mini, iPad Pro, MacBook Pro, and standard desktop screens.",
      icon: Monitor,
      status: "Available Now",
      isLive: true,
      href: "/docs#presets",
      linkText: "Device Guide",
    },
    {
      name: "Custom Viewport Dimensions",
      desc: "Specify exact pixel widths and heights (e.g. 360 × 740, 1024 × 768) to test edge-case breakpoints and foldable screens.",
      icon: Maximize,
      status: "Available Now",
      isLive: true,
      href: "/docs#presets",
      linkText: "Learn Dimensions",
    },
    {
      name: "Portrait & Landscape Rotation",
      desc: "Swap width and height dynamically on mobile and tablet frames without reloading the embedded document.",
      icon: RotateCcw,
      status: "Available Now",
      isLive: true,
      href: "/docs#presets",
      linkText: "Rotation Guide",
    },
    {
      name: "Zoom and Fit-to-Screen",
      desc: "Scale individual previews (50%, 75%, 100%) or compute a shared proportional fit scale across all active devices.",
      icon: ZoomIn,
      status: "Available Now",
      isLive: true,
      href: "/docs#canvas",
      linkText: "Canvas Guide",
    },
    {
      name: "Refresh All Previews",
      desc: "One-click simultaneous reload for all active viewports to test code changes or verify fresh server state.",
      icon: RefreshCw,
      status: "Available Now",
      isLive: true,
      href: "/workspace",
      linkText: "Open Workspace",
    },
    {
      name: "Synchronized Interactions",
      desc: "Mirror scrolling positions, click navigation, and form interactions between compatible viewport frames.",
      icon: GitFork,
      status: "Available Now",
      isLive: true,
      href: "/docs#sync",
      linkText: "Sync Guide",
    },
    {
      name: "Infinite Canvas Navigation",
      desc: "Smooth spatial pan and zoom with interactive wave dot grid, device dragging, and automatic arrangement algorithms.",
      icon: Move,
      status: "Available Now",
      isLive: true,
      href: "/docs#canvas",
      linkText: "Canvas Guide",
    },
    {
      name: "URL Loading & Normalization",
      desc: "Smart address formatting (auto-prefixing https:// or localhost http://) with X-Frame-Options embedding verification.",
      icon: Globe,
      status: "Available Now",
      isLive: true,
      href: "/docs#troubleshooting",
      linkText: "Troubleshooting",
    },
    {
      name: "Add or Remove Devices",
      desc: "Flexibly expand your testing matrix from 1 up to 10+ devices, or trim down to inspect a single layout in detail.",
      icon: PlusCircle,
      status: "Available Now",
      isLive: true,
      href: "/workspace",
      linkText: "Try in Workspace",
    },
    {
      name: "Full-Screen Preview",
      desc: "Leverages the browser Fullscreen API on individual device previews for distraction-free UI evaluation.",
      icon: Expand,
      status: "Available Now",
      isLive: true,
      href: "/workspace",
      linkText: "Try in Workspace",
    },
  ];

  return (
    <section id="utilities" className="py-10 sm:py-14 bg-[#F8FAFD] relative border-y border-[#E8DDFD]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#11172B] tracking-tight">
            Your Responsive Testing Toolkit.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3F5496] leading-relaxed">
            Every utility you need to inspect, rotate, measure, and validate responsive layouts is built right into the infinite canvas.
          </p>
        </div>

        {/* 10 Utilities in a clean grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {utilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-5 rounded-2xl bg-white border border-[#E8DDFD]/80 hover:border-[#079B73]/60 shadow-xs hover:shadow-pastel-sm transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FBE8F7]/70 text-[#11172B]">
                      <Icon className="w-4 h-4 text-[#11172B]" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#079B73] bg-[#E6F6F2] px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#11172B] tracking-tight">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs text-[#5B71B5] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DDFD]/40">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#079B73] hover:text-[#067a5b] transition-colors"
                  >
                    <span>{item.linkText}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
