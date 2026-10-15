"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E8DDFD] pt-12 pb-10 text-[#11172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-8 border-b border-[#E8DDFD]/70">
          {/* Brand Col (Span 5) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] rounded-lg"
                aria-label="Responsivelyonline — Home"
              >
                <Image
                  src="/Responsively Device Logo.png"
                  alt="Responsivelyonline — Multi-Screen Studio"
                  width={240}
                  height={60}
                  className="h-10 w-auto object-contain hover:opacity-90 transition-opacity"
                />
              </Link>
              <p className="mt-4 text-sm text-[#3F5496] max-w-sm leading-relaxed">
                A modern responsive website previewing tool that displays websites across mobile,
                tablet, laptop, and desktop screens simultaneously on an interactive infinite canvas.
                Free and open source.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-[#5B71B5]">
              <span>Crafted for developers &amp; designers worldwide.</span>
            </div>
          </div>

          {/* Product links (Span 2) */}
          <nav className="md:col-span-2" aria-label="Product links">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11172B] mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/#features" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#utilities" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  Utilities
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/workspace" className="text-[#079B73] font-semibold hover:underline focus:outline-none focus-visible:underline">
                  Open Workspace
                </Link>
              </li>
            </ul>
          </nav>

          {/* Resources (Span 3) */}
          <nav className="md:col-span-3" aria-label="Resource links">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11172B] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/docs" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sponsor" className="text-[#079B73] font-semibold hover:underline focus:outline-none focus-visible:underline">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  Site Map
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/responsively-org/responsively-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline"
                  aria-label="GitHub Repository (opens in new tab)"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-[#5B71B5]" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal (Span 2) */}
          <nav className="md:col-span-2" aria-label="Legal links">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11172B] mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-xs text-[#5B71B5] block pt-1">MIT License</span>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B71B5]">
          <p>
            <span aria-label={`Copyright ${year} Responsivelyonline`}>
              &copy; {year} Responsivelyonline.
            </span>{" "}
            Free and Open Source (MIT).
          </p>

          <div className="flex items-center gap-4">
            <span className="font-sans text-[11px]">
              Built with Next.js, Tailwind CSS &amp; Lucide
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
