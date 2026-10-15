"use client";

import { Globe, LayoutGrid, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Enter a URL",
      desc: "Paste the website address into the preview input. Responsivelyonline automatically normalizes the URL scheme and verifies framing headers.",
      icon: Globe,
      accent: "#FBE8F7",
      pill: "Instant Address Entry",
    },
    {
      step: "02",
      title: "Choose Your Screens",
      desc: "View across multiple device dimensions simultaneously — phone, tablet, laptop, and desktop viewports side-by-side on an infinite canvas.",
      icon: LayoutGrid,
      accent: "#E8DDFD",
      pill: "True Media Queries",
    },
    {
      step: "03",
      title: "Explore and Compare",
      desc: "Rotate devices, inspect layouts, navigate the canvas with zoom and pan, and test synchronized scroll & click interactions.",
      icon: Compass,
      accent: "#DCEBFF",
      pill: "Zero Guesswork QA",
    },
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-14 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#11172B] tracking-tight">
            How Responsivelyonline Works.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3F5496] leading-relaxed">
            From pasting a link to comprehensive responsive audit in less than three seconds.
          </p>
        </div>

        {/* Timeline (Horizontal on desktop, Vertical on mobile) */}
        <div className="relative">
          {/* Horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-[#FBE8F7] via-[#E8DDFD] to-[#DCEBFF] -translate-y-8 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-7 rounded-3xl bg-white border border-[#E8DDFD] shadow-pastel-sm hover:shadow-pastel-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Step Number & Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-black tracking-tight text-[#11172B]/80 font-mono">
                        {item.step}
                      </span>
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-2xl text-[#11172B] shadow-xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: item.accent }}
                      >
                        <Icon className="w-5 h-5 text-[#11172B]" />
                      </div>
                    </div>

                    <span className="inline-block text-[11px] font-semibold text-[#079B73] bg-[#E6F6F2] px-2.5 py-0.5 rounded-full mb-3">
                      {item.pill}
                    </span>

                    <h3 className="text-xl font-bold text-[#11172B] tracking-tight mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#3F5496] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8DDFD]/60 flex items-center justify-between text-xs font-semibold text-[#11172B]">
                    <span>Step {index + 1} of 3</span>
                    <ArrowRight className="w-4 h-4 text-[#079B73] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick action nudge */}
        <div className="mt-14 text-center">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#11172B] hover:bg-[#1D284B] text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>Try It Now in Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#079B73]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
