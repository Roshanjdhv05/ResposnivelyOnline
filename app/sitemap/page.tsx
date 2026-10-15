import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ExternalLink, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Site Map",
  description: "Complete site map for Responsivelyonline — all pages and sections.",
  robots: { index: false },
};

interface SiteNode {
  label: string;
  href: string;
  desc: string;
  external?: boolean;
  children?: { label: string; href: string }[];
}

const siteMap: SiteNode[] = [
  {
    label: "Home",
    href: "/",
    desc: "Landing page with all main sections",
    children: [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Utilities", href: "/#utilities" },
      { label: "Use Cases", href: "/#use-cases" },
      { label: "Workflow Comparison", href: "/#workflow-comparison" },
      { label: "Resources", href: "/#resources" },
      { label: "FAQ", href: "/#faq" },
      { label: "CTA / Preview Input", href: "/" },
    ],
  },
  {
    label: "Workspace",
    href: "/workspace",
    desc: "Live multi-viewport responsive previewer",
    children: [
      { label: "Device presets & custom sizes", href: "/workspace" },
      { label: "Infinite canvas", href: "/workspace" },
      { label: "Synchronized interactions", href: "/workspace" },
      { label: "URL input & normalization", href: "/workspace" },
    ],
  },
  {
    label: "Documentation",
    href: "/docs",
    desc: "Guides for all features",
    children: [
      { label: "Getting Started", href: "/docs#getting-started" },
      { label: "Device & Viewport Guide", href: "/docs#device-guide" },
      { label: "Infinite Canvas Guide", href: "/docs#canvas-guide" },
      { label: "Synchronized Interactions", href: "/docs#sync-guide" },
      { label: "URL Troubleshooting", href: "/docs#troubleshooting" },
      { label: "Contribution Guide", href: "/docs#contributing" },
      { label: "Bug Reporting", href: "/docs#bug-reporting" },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    desc: "Engineering articles and updates",
    children: [
      { label: "Learnings That Led to Screenshot v2", href: "https://responsively.app/blog/learnings-that-led-to-screenshot-v2" },
      { label: "All blog posts", href: "/blog" },
    ],
  },
  {
    label: "Sponsor",
    href: "/sponsor",
    desc: "Support the open-source project",
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    desc: "How data is handled",
  },
  {
    label: "Terms of Service",
    href: "/terms",
    desc: "Usage terms",
  },
  {
    label: "GitHub Repository",
    href: "https://github.com/responsively-org/responsively-app",
    desc: "Source code, issues, and contributions",
    external: true,
  },
];

export default function SiteMapPage() {
  return (
    <div className="min-h-screen bg-white text-[#11172B] font-sans flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-[#11172B] tracking-tight leading-none mb-4">
              Site Map
            </h1>
            <p className="text-base sm:text-lg text-[#3F5496] leading-relaxed">
              All pages and sections of Responsivelyonline, at a glance.
            </p>
          </div>

          <div className="space-y-8">
            {siteMap.map((node) => (
              <div key={node.href} className="border-b border-[#E8DDFD]/60 pb-8 last:border-0 last:pb-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#079B73] mt-2.5 shrink-0" aria-hidden="true" />
                  <div>
                    {node.external ? (
                      <a
                        href={node.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-lg font-bold text-[#11172B] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
                      >
                        {node.label}
                        <ExternalLink className="w-4 h-4 text-[#079B73]" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={node.href}
                        className="inline-flex items-center gap-1.5 text-lg font-bold text-[#11172B] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
                      >
                        {node.label}
                        <ArrowRight className="w-4 h-4 text-[#079B73]" aria-hidden="true" />
                      </Link>
                    )}
                    <p className="text-sm text-[#5B71B5] mt-0.5">{node.desc}</p>
                  </div>
                </div>

                {node.children && (
                  <ul className="ml-6 space-y-2 mt-3">
                    {node.children.map((child) => (
                      <li key={child.href + child.label} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#C4B5FD] shrink-0" aria-hidden="true" />
                        {child.href.startsWith("http") ? (
                          <a
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline"
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            href={child.href}
                            className="text-sm text-[#3F5496] hover:text-[#079B73] transition-colors focus:outline-none focus-visible:underline"
                          >
                            {child.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
