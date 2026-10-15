import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Responsivelyonline.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11172B] tracking-tight mb-6">
          Privacy Policy
        </h1>
        <div className="prose prose-slate max-w-none text-[#3F5496] space-y-4 text-sm sm:text-base leading-relaxed">
          <p>
            Responsivelyonline is committed to respecting your privacy. As a client-side web application tool, we do not collect, store, or sell your personal browsing data.
          </p>
          <h2 className="text-xl font-bold text-[#11172B] pt-4">Data Processing</h2>
          <p>
            When you enter a URL to preview, that address is processed directly within your browser session. If you use our optional server-side header checker (/api/check), only the HTTP response headers (X-Frame-Options and Content Security Policy) are inspected to inform you whether the target site permits iframe embedding.
          </p>
          <h2 className="text-xl font-bold text-[#11172B] pt-4">Local Storage</h2>
          <p>
            Your preferences, such as selected viewport presets, canvas zoom, and last-entered URL, are stored locally in your browser’s localStorage and never transmitted to external databases.
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
