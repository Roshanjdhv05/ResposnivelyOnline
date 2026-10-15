import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Responsivelyonline.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11172B] tracking-tight mb-6">
          Terms of Service
        </h1>
        <div className="prose prose-slate max-w-none text-[#3F5496] space-y-4 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to Responsivelyonline. By using this software, you agree to these terms.
          </p>
          <h2 className="text-xl font-bold text-[#11172B] pt-4">Intended Use</h2>
          <p>
            Responsivelyonline is an open-source development and quality assurance utility intended for previewing web layouts across multiple simulated device viewport widths.
          </p>
          <h2 className="text-xl font-bold text-[#11172B] pt-4">Third-Party Content</h2>
          <p>
            Any website loaded within viewport iframes is subject to the terms and privacy practices of the respective website owners. Responsivelyonline does not claim ownership or endorse third-party content loaded inside preview frames.
          </p>
          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-[#079B73] hover:underline"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
