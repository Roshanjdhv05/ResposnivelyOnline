"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RotateCw,
  Maximize2,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  ArrowRight,
  MousePointer2,
} from "lucide-react";

type DemoTheme = "saas" | "store" | "portfolio";

export default function HeroShowcase() {
  const [activeTheme, setActiveTheme] = useState<DemoTheme>("saas");
  const [phoneRotated, setPhoneRotated] = useState(false);
  const [tabletRotated, setTabletRotated] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(85);

  const demoSites = {
    saas: {
      title: "FlowMetrics Cloud",
      url: "flowmetrics.app/dashboard",
      heroTitle: "Accelerate Your Team's Velocity",
      metric1: "$124,500",
      metric1Label: "Monthly Volume",
      metric2: "99.98%",
      metric2Label: "Sync Accuracy",
      accent: "#079B73",
    },
    store: {
      title: "Nordic Atelier",
      url: "nordic-atelier.store/collection",
      heroTitle: "Minimalist Objects for Daily Rituals",
      metric1: "3,420+",
      metric1Label: "Curated Goods",
      metric2: "4.9 / 5.0",
      metric2Label: "Customer Score",
      accent: "#2B3C6E",
    },
    portfolio: {
      title: "Aura Creative Studio",
      url: "aurastudio.design/works",
      heroTitle: "Crafting High-Impact Digital Brands",
      metric1: "48 Awards",
      metric1Label: "Global Recognition",
      metric2: "120+ Brands",
      metric2Label: "Worldwide Clients",
      accent: "#8597CE",
    },
  };

  const current = demoSites[activeTheme];

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-12 sm:mt-16">
      {/* Outer container with soft pastel canvas frame */}
      <div className="relative rounded-3xl p-3 sm:p-6 lg:p-8 bg-gradient-to-b from-white/90 to-[#EFF5FF]/80 border border-[#E8DDFD] shadow-pastel-lg backdrop-blur-md overflow-hidden">
        {/* Subtle Canvas Dot Grid Background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />

        {/* Ambient Pastel Glow Balls */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FBE8F7] blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#E8DDFD] blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-[#DCEBFF] blur-3xl opacity-50 pointer-events-none" />

        {/* Top Canvas Controls Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-[#E8DDFD]/80">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11172B] text-white text-xs font-semibold shadow-xs">
              <Layers className="w-3.5 h-3.5 text-[#079B73]" />
              <span>Preview Studio</span>
            </span>
          </div>

          {/* Sample Preset Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/90 rounded-xl border border-[#E8DDFD] shadow-xs text-xs font-medium">
            <span className="text-slate-400 px-2 hidden lg:inline">Sample Site:</span>
            <button
              type="button"
              onClick={() => setActiveTheme("saas")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTheme === "saas"
                  ? "bg-[#11172B] text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              SaaS Cloud
            </button>
            <button
              type="button"
              onClick={() => setActiveTheme("store")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTheme === "store"
                  ? "bg-[#11172B] text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Storefront
            </button>
            <button
              type="button"
              onClick={() => setActiveTheme("portfolio")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTheme === "portfolio"
                  ? "bg-[#11172B] text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Studio
            </button>
          </div>

          {/* Canvas Zoom & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/90 rounded-xl border border-[#E8DDFD] text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                className="p-1 hover:text-[#11172B] rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 font-mono text-[11px]">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(110, z + 10))}
                className="p-1 hover:text-[#11172B] rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FBE8F7]/60 text-[#11172B] text-xs font-semibold border border-[#E8DDFD] shadow-xs hover:shadow-sm transition-all"
            >
              <span>Live Workspace</span>
              <ExternalLink className="w-3 h-3 text-[#079B73]" />
            </Link>
          </div>
        </div>

        {/* Live Multi-Device Viewports Grid */}
        <div className="relative z-10 pt-6 sm:pt-8 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* 1. Desktop Monitor / 1920x1080 Scaled (Columns 1-7) */}
          <div className="md:col-span-7 flex flex-col group">
            {/* Device Header Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#11172B] text-white rounded-t-xl text-xs">
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-[#079B73]" />
                <span className="font-semibold text-slate-200">Desktop Display</span>
                <span className="text-[11px] text-slate-400 font-mono">1920 × 1080</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#079B73]"></span>
                <span>Full Breakpoint</span>
              </div>
            </div>

            {/* Monitor Frame & Browser Chrome */}
            <div className="bg-[#1C284B] p-2 rounded-b-2xl shadow-device border border-slate-700/50">
              <div className="bg-[#090D1A] rounded-t-lg px-3 py-1.5 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/90" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-slate-800/80 rounded-md px-3 py-0.5 text-[11px] font-mono text-slate-300 truncate text-center">
                  https://{current.url}
                </div>
              </div>

              {/* Desktop Rendered Screen */}
              <div className="bg-slate-900 text-white rounded-b-lg p-4 sm:p-5 overflow-hidden min-h-[260px] sm:min-h-[300px]">
                {/* Desktop Site Nav */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#079B73]" />
                    <span className="font-bold tracking-tight text-white">{current.title}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px]">
                    <span className="text-white font-medium">Overview</span>
                    <span>Features</span>
                    <span>Pricing</span>
                    <span>Docs</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#079B73] text-white font-semibold text-[10px]">
                    Connect
                  </span>
                </div>

                {/* Hero Inside Desktop Screen */}
                <div className="pt-5 pb-3">
                  <div className="inline-block px-2 py-0.5 rounded-full bg-[#079B73]/20 text-[#079B73] font-semibold text-[10px] mb-2">
                    RESPONSIVE LAYOUT ENGINE
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {current.heroTitle}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">
                    Seamless multi-viewport scaling tested simultaneously across modern browser breakpoints.
                  </p>
                </div>

                {/* Metrics 3-Column Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-3">
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                    <div className="text-[10px] text-slate-400">{current.metric1Label}</div>
                    <div className="text-sm sm:text-base font-bold text-white mt-0.5">{current.metric1}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                    <div className="text-[10px] text-slate-400">{current.metric2Label}</div>
                    <div className="text-sm sm:text-base font-bold text-[#079B73] mt-0.5">{current.metric2}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                    <div className="text-[10px] text-slate-400">Layout Match</div>
                    <div className="text-sm sm:text-base font-bold text-sky-400 mt-0.5">100%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitor Stand Base */}
            <div className="w-20 h-3 bg-slate-400/80 mx-auto rounded-b-md shadow-xs" />
            <div className="w-32 h-1.5 bg-slate-400/60 mx-auto rounded-full mt-0.5" />
          </div>

          {/* Right Column: Tablet & Mobile (Columns 8-12) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* 2. Tablet Viewport (iPad Mini / Pro) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#11172B] text-white rounded-t-xl text-xs">
                <div className="flex items-center gap-2">
                  <Tablet className="w-3.5 h-3.5 text-[#079B73]" />
                  <span className="font-semibold text-slate-200">iPad Pro</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {tabletRotated ? "1180 × 820" : "820 × 1180"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTabletRotated(!tabletRotated)}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Rotate Tablet"
                >
                  <RotateCw className="w-3 h-3 text-[#079B73]" />
                  <span>Rotate</span>
                </button>
              </div>

              {/* Tablet Frame */}
              <div
                className={`bg-slate-800 p-2.5 rounded-b-2xl shadow-device border border-slate-700 transition-all duration-300 ${
                  tabletRotated ? "aspect-video" : ""
                }`}
              >
                <div className="bg-slate-900 rounded-xl p-3 text-white overflow-hidden">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-bold text-white text-[11px]">{current.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                      {current.url}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-200 leading-tight">
                      {current.heroTitle}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-1.5 rounded bg-slate-800 text-[10px]">
                        <span className="text-slate-400 block">{current.metric1Label}</span>
                        <span className="font-bold text-white">{current.metric1}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-800 text-[10px]">
                        <span className="text-slate-400 block">{current.metric2Label}</span>
                        <span className="font-bold text-[#079B73]">{current.metric2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Mobile Viewport (iPhone 15 Pro) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#11172B] text-white rounded-t-xl text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-[#079B73]" />
                  <span className="font-semibold text-slate-200">iPhone 15 Pro</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {phoneRotated ? "852 × 393" : "393 × 852"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhoneRotated(!phoneRotated)}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Rotate Phone"
                >
                  <RotateCw className="w-3 h-3 text-[#079B73]" />
                  <span>Rotate</span>
                </button>
              </div>

              {/* iPhone Frame with Dynamic Island */}
              <div
                className={`bg-[#0F172A] p-2.5 rounded-b-3xl shadow-device border-2 border-slate-700 transition-all duration-300 ${
                  phoneRotated ? "aspect-video" : "max-w-[280px] mx-auto w-full"
                }`}
              >
                {/* Dynamic Island pill */}
                <div className="w-16 h-3 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>

                <div className="bg-slate-900 rounded-2xl p-3 text-white">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px]">
                    <span className="font-bold text-white">{current.title}</span>
                    <span className="w-4 h-3 flex flex-col justify-between">
                      <span className="w-full h-0.5 bg-slate-400 rounded" />
                      <span className="w-full h-0.5 bg-slate-400 rounded" />
                      <span className="w-full h-0.5 bg-slate-400 rounded" />
                    </span>
                  </div>
                  <div className="pt-2 text-center">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#079B73]/20 text-[#079B73] font-bold">
                      MOBILE BREAKPOINT
                    </span>
                    <div className="text-xs font-bold text-white mt-1 leading-snug">
                      {current.heroTitle}
                    </div>
                    <div className="mt-2 p-2 rounded bg-slate-800 text-left text-[10px]">
                      <span className="text-slate-400 block text-[9px]">{current.metric1Label}</span>
                      <span className="font-bold text-white text-xs">{current.metric1}</span>
                    </div>
                  </div>
                </div>

                {/* Home Indicator bar */}
                <div className="w-20 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges Bar */}
        <div className="relative z-10 mt-8 pt-5 border-t border-[#E8DDFD]/80 flex flex-wrap items-center justify-between gap-4 text-xs text-[#2B3C6E]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#079B73]" />
              Native CSS media queries intact
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#079B73]" />
              Independent per-device zoom & rotation
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#079B73]" />
              No browser extensions required
            </span>
          </div>

          <Link
            href="/workspace"
            className="group inline-flex items-center gap-1 font-semibold text-[#11172B] hover:text-[#079B73] transition-colors"
          >
            <span>Launch Live Infinite Canvas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
