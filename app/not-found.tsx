import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Home, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen text-[#11172B] font-sans flex flex-col justify-between"
      style={{
        background: `
          radial-gradient(ellipse 900px 700px at 0% 12%, rgba(246, 230, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%),
          radial-gradient(ellipse 900px 700px at 100% 16%, rgba(215, 238, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%),
          #FFFFFF
        `,
      }}
    >
      <Navbar />

      <main id="main-content" className="flex-1 flex items-center justify-center pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBE8F7] border border-[#E8DDFD] text-[#11172B] text-xs font-semibold mb-6">
            <span>404 Error</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-[#11172B] tracking-tight leading-none mb-4">
            Page Not Found
          </h1>

          <p className="text-base sm:text-lg text-[#3F5496] leading-relaxed mb-8 max-w-md mx-auto">
            The page you are looking for doesn&apos;t exist, has been removed, or the link may be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#11172B] hover:bg-[#1D284B] text-white text-sm font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#11172B] border border-[#E8DDFD] text-sm font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
            >
              <Compass className="w-4 h-4 text-[#079B73]" />
              <span>Open Workspace</span>
            </Link>

            <Link
              href="/docs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#3F5496] border border-[#E8DDFD] text-sm font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
            >
              <span>Documentation</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
