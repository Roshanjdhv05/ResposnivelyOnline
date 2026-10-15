"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function BrandLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2 group">
      <div className="relative w-9 h-9 shrink-0 group-hover:scale-105 transition-transform duration-200">
        <Image
          src="/logo.png"
          alt="Responsivelyonline icon"
          width={36}
          height={36}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[17px] font-extrabold tracking-tight text-[#11172B] leading-none">
          Responsively<span className="font-semibold text-[#5B71B5]">Online</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#079B73] ml-0.5 align-baseline" />
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#8597CE] mt-0.5">
          Multi-Screen Studio
        </span>
      </div>
    </div>
  );
}

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Utilities", href: "/#utilities" },
  { label: "Resources", href: "/docs" },
  { label: "Documentation", href: "/docs" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Close menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-[#E8DDFD]/80 shadow-[0_4px_20px_-4px_rgba(232,221,253,0.5)] py-3"
          : "bg-white/40 backdrop-blur-md border-b border-[#E8DDFD]/40 py-4"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Wordmark */}
          <Link
            href="/"
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] rounded-lg"
            aria-label="Responsivelyonline — Home"
          >
            <BrandLogo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-[#1D284B] hover:text-[#079B73] rounded-full hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/responsively-org/responsively-app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm font-medium text-[#1D284B] hover:text-[#079B73] rounded-full hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors inline-flex items-center gap-1"
              aria-label="GitHub repository (opens in new tab)"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11172B] hover:bg-[#1D284B] text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] focus-visible:ring-offset-2 transition-all duration-200 cursor-pointer group"
            >
              <span>Open Workspace</span>
              <ArrowUpRight className="w-4 h-4 text-[#079B73] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2" ref={mobileMenuRef}>
            <Link
              href="/workspace"
              className="px-3 py-1.5 rounded-full bg-[#11172B] text-white text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
            >
              Workspace
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#11172B] hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="md:hidden mt-3 p-4 bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#E8DDFD] shadow-pastel-lg animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="px-3 py-2 text-sm font-medium text-[#11172B] hover:bg-[#FBE8F7]/60 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/responsively-org/responsively-app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="px-3 py-2 text-sm font-medium text-[#11172B] hover:bg-[#FBE8F7]/60 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors inline-flex items-center gap-2"
              >
                <GitHubIcon className="w-4 h-4" />
                GitHub
              </a>
              <div className="pt-2 mt-1 border-t border-[#E8DDFD]">
                <Link
                  href="/workspace"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#11172B] text-white text-sm font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
                >
                  <span>Launch Workspace</span>
                  <ArrowUpRight className="w-4 h-4 text-[#079B73]" />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
