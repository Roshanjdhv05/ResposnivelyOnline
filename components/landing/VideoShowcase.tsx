"use client";

import { useRef, useState } from "react";
import { AlertCircle, Lock, Play } from "lucide-react";

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      id="video-showcase"
      aria-labelledby="video-showcase-heading"
      className="relative py-10 sm:py-14 bg-gradient-to-b from-[#FBE8F7]/70 via-[#E8DDFD]/50 to-white overflow-hidden"
    >
      {/* Decorative backdrop shapes */}
      <div aria-hidden="true" className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E8DDFD] blur-3xl opacity-60 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#DCEBFF] blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h2
            id="video-showcase-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#11172B] tracking-tight"
          >
            Watch Responsive Testing in Action.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3F5496] leading-relaxed">
            See synchronized navigation, freeform canvas panning, and instant viewport rotation
            streamline responsive web testing in real time.
          </p>
        </div>

        {/* Refined Browser-Style Frame */}
        <div
          className="max-w-5xl mx-auto rounded-3xl bg-[#11172B] p-2.5 sm:p-4 shadow-2xl border border-[#2B3C6E]/60 transition-all"
          role="figure"
          aria-label="Product walkthrough video demonstration"
        >
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/60 mb-2 sm:mb-3">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
            </div>

            {/* Address Bar */}
            <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono text-slate-300 max-w-md w-full justify-center">
              <Lock className="w-3 h-3 text-[#079B73]" aria-hidden="true" />
              <span className="truncate">responsively.online — product walkthrough</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span className="hidden sm:inline font-sans text-[11px] text-slate-300">Product Walkthrough</span>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
            {!hasError ? (
              <>
                <video
                  ref={videoRef}
                  src="/export-1792042068062.mp4"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls
                  onError={() => setHasError(true)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-contain bg-black"
                  title="Responsivelyonline product walkthrough — responsive testing demo"
                  aria-label="Product walkthrough video showing multi-device responsive testing"
                />
                {/* Custom play overlay shown before user interacts */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Play className="w-7 h-7 text-white ml-1" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Graceful Fallback */
              <div className="p-8 text-center text-slate-300 max-w-md" role="alert">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white mb-2">Video Unavailable</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-4">
                  The product walkthrough video could not be loaded. You can download it directly
                  or open the live workspace to explore features.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/export-1792042068062.mp4"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#079B73] text-white text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Download Demo Video (MP4)
                  </a>
                  <a
                    href="/workspace"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Open Live Workspace
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3 Key Takeaways */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#E8DDFD] shadow-xs flex items-start gap-3.5">
            <div
              aria-hidden="true"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FBE8F7] text-[#11172B] shrink-0 font-bold text-sm"
            >
              01
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#11172B]">Synchronized Interactions</h3>
              <p className="text-xs text-[#3F5496] mt-1 leading-relaxed">
                Scroll or navigate on one device and see all other active viewports mirror the
                action across compatible pages.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#E8DDFD] shadow-xs flex items-start gap-3.5">
            <div
              aria-hidden="true"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E8DDFD] text-[#11172B] shrink-0 font-bold text-sm"
            >
              02
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#11172B]">Infinite Spatial Workspace</h3>
              <p className="text-xs text-[#3F5496] mt-1 leading-relaxed">
                Drag, arrange, and zoom in/out of viewports without disturbing layout state or
                reloading iframes.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#E8DDFD] shadow-xs flex items-start gap-3.5">
            <div
              aria-hidden="true"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#DCEBFF] text-[#11172B] shrink-0 font-bold text-sm"
            >
              03
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#11172B]">Instant Viewport Rotation</h3>
              <p className="text-xs text-[#3F5496] mt-1 leading-relaxed">
                Test landscape orientations on smartphones and tablets instantly — swaps width and
                height without reloading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
