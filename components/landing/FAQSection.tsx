"use client";

import { useState, useCallback, useRef, useId } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Search } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  link?: { text: string; href: string; external?: boolean };
}

interface FAQCategory {
  id: string;
  label: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    id: "general",
    label: "General",
    items: [
      {
        id: "what-is",
        question: "What is Responsivelyonline?",
        answer:
          "Responsivelyonline is a browser-based tool for viewing and inspecting a website across multiple viewport sizes within one workspace. You paste a URL and the site loads simultaneously inside configurable device frames — mobile, tablet, laptop, and desktop — arranged on an infinite, pannable, zoomable canvas.",
      },
      {
        id: "who-should-use",
        question: "Who should use Responsivelyonline?",
        answer:
          "Responsivelyonline is useful for frontend developers testing responsive CSS, designers verifying layouts across breakpoints, QA engineers doing manual cross-viewport checks, agencies reviewing client sites, and website owners who want to see how their pages look on different screen sizes.",
      },
      {
        id: "how-to-start",
        question: "How do I get started?",
        answer:
          "Open the workspace, type or paste a URL (e.g. example.com or https://example.com), and press Preview or Enter. Four device viewports load immediately. You can add more devices, change their sizes, rotate them, and pan or zoom the canvas freely.",
        link: { text: "Open Workspace", href: "/workspace" },
      },
      {
        id: "install",
        question: "Do I need to install anything?",
        answer:
          "Responsivelyonline runs entirely in your browser — no installation, extension, or account is required for the web version. If you prefer to run it locally, clone the repository and run npm install && npm run dev. Node.js 18.18 or newer is required.",
        link: {
          text: "GitHub Repository",
          href: "https://github.com/responsively-org/responsively-app",
          external: true,
        },
      },
      {
        id: "cost",
        question: "Is Responsivelyonline free?",
        answer:
          "Yes. Responsivelyonline is free and open source under the MIT license. There are no paid subscriptions, credit limits, or paywalled viewports. You can self-host it, modify it, and use it commercially.",
      },
      {
        id: "account",
        question: "Do I need an account?",
        answer:
          "No account or sign-up is required. Your device preferences, viewport settings, zoom level, workspace theme, and last URL are stored locally in your browser's localStorage (key: rwp:v1) and never sent to a server.",
      },
    ],
  },
  {
    id: "previewing",
    label: "Website Previewing",
    items: [
      {
        id: "how-preview",
        question: "How do I preview a website?",
        answer:
          "Paste or type any URL into the input field and press Preview Website (or hit Enter). The URL is validated, normalised (https:// is added automatically; http:// is used for localhost and IP addresses), and loaded into all configured device iframes simultaneously.",
      },
      {
        id: "any-site",
        question: "Can I preview any website?",
        answer:
          "Most ordinary websites can be inspected when their security configuration permits iframe embedding. However, many websites send X-Frame-Options: DENY or a Content Security Policy frame-ancestors directive that instructs browsers not to display them in frames. When this happens, Responsivelyonline detects it via a server-side header check and displays a clear explanation rather than a blank or broken frame.",
      },
      {
        id: "blank-screen",
        question: "Why does a website show a blank screen or an error?",
        answer:
          "Common causes include: X-Frame-Options: DENY or SAMEORIGIN set by the site; a CSP frame-ancestors directive that excludes your origin; login or authentication walls; mixed-content blocking (an https page embedding an http resource); heavy JavaScript that behaves differently in an iframe; or the site detecting iframe embedding and redirecting away. Responsivelyonline attempts to identify framing blocks before loading and displays the relevant header. For non-embeddable sites, use the Open in New Tab button.",
      },
      {
        id: "different-pages",
        question: "Can I open different pages on the same website?",
        answer:
          "Yes, when synchronised interaction is enabled, navigating via links within one preview can cause other viewports to follow (where cross-origin iframe security permits). You can also type a different path directly in the workspace URL bar to load a new page across all viewports.",
      },
      {
        id: "resources",
        question: "Do images, fonts, and scripts load correctly?",
        answer:
          "Resources are loaded by the target website within the iframe — they are fetched by the browser just as they would be on a normal page visit. Whether they load depends on the target website's CDN, CORS policies, network conditions, and any iframe-specific JavaScript behaviour.",
      },
      {
        id: "localhost",
        question: "Does it support local development websites?",
        answer:
          "Yes, in development mode (npm run dev) you can preview localhost and local-network addresses such as localhost:3000 or 192.168.1.x. In a publicly deployed production build, private and loopback addresses are blocked by the /api/check endpoint to prevent misuse. To allow them in a self-hosted production build, set the environment variable ALLOW_PRIVATE_HOSTS=true.",
      },
      {
        id: "private-sites",
        question: "Can I preview a private or password-protected website?",
        answer:
          "Responsivelyonline cannot bypass authentication walls. If a site requires login, the iframe will show the login screen — not the authenticated content — unless your browser already holds a valid session cookie for that site. Cookie-based sessions are shared with the iframe because it runs in the same browser, so if you're already logged in, the site may load correctly.",
      },
      {
        id: "data-storage",
        question: "Does Responsivelyonline store the websites I preview?",
        answer:
          "No. URLs you preview are processed within your browser session. When the optional /api/check endpoint is used, only the HTTP response headers (X-Frame-Options, Content-Security-Policy) of the target URL are inspected server-side. The URL itself is not logged, stored, or shared. Your viewport preferences are stored in your browser's localStorage and never transmitted.",
      },
    ],
  },
  {
    id: "devices",
    label: "Device Compatibility",
    items: [
      {
        id: "device-sizes",
        question: "Which device sizes are available?",
        answer:
          "Built-in presets include iPhone 14 Pro (393×852), iPad Mini (768×1024), iPad Pro (1024×1366), MacBook Pro (1440×900), and a standard Desktop display (1920×1080). More presets can be added through the device selector in the workspace toolbar.",
      },
      {
        id: "custom-sizes",
        question: "Can I add custom device sizes?",
        answer:
          "Yes. The Add Device button opens a dialog where you can enter any pixel width and height, giving the device a label. Custom viewports are saved to localStorage alongside your preset selections.",
      },
      {
        id: "rotate",
        question: "Can I rotate phones and tablets?",
        answer:
          "Yes. Each device has a Rotate button in its per-device toolbar that swaps its width and height. The iframe resizes smoothly with a CSS transition so the embedded page responds to the new viewport without reloading.",
      },
      {
        id: "emulation",
        question: "Does it emulate real iPhones and Android devices?",
        answer:
          "No. Responsivelyonline sets the CSS viewport to the configured pixel dimensions using an iframe and CSS transform: scale(). This means all CSS media queries respond correctly for the given width and height. However, it does not emulate the operating system, mobile browser engine, touch input stack, GPU, or device-specific rendering. For final device validation, test on real hardware or a dedicated emulator.",
      },
      {
        id: "real-devices",
        question: "Does it replace testing on real devices?",
        answer:
          "No, and it is not designed to replace hardware testing. Responsivelyonline accelerates day-to-day responsive CSS review and layout comparison. Physical device testing remains essential for touch latency, GPU throttling, camera and biometric APIs, iOS Safari quirks, and device-specific browser behaviour.",
      },
    ],
  },
  {
    id: "canvas",
    label: "Infinite Canvas",
    items: [
      {
        id: "what-is-canvas",
        question: "What is the infinite canvas?",
        answer:
          "The canvas is an open spatial workspace where device frames are positioned, panned, and zoomed freely. There is no fixed grid or page boundary — you can place previews anywhere, spread them across a wide area to compare, or bring them close together. A wave dot-grid background provides visual reference while panning.",
      },
      {
        id: "drag-previews",
        question: "Can I drag device previews anywhere?",
        answer:
          "Device frames can be repositioned across the canvas. The workspace also supports automatic arrangement options (Reset Layout, Compact Layout) accessible from the top toolbar for quickly tidying up the canvas.",
      },
      {
        id: "zoom-fit",
        question: "How do I zoom in, zoom out, or fit all devices?",
        answer:
          "Each device has per-device zoom options (50%, 75%, 100%, or Fit). The Fit option computes a proportional scale that makes that device fill its visible area. The Zoom All to Fit toolbar button scales all devices proportionally to fit the current browser window. Canvas-wide pan and zoom are also available via scroll and drag.",
      },
      {
        id: "arrange",
        question: "Can I arrange devices into custom layouts?",
        answer:
          "Yes. You can drag devices freely on the canvas. The top toolbar provides Reset Layout (returns devices to the default positions) and Compact Layout (tiles them closely). Individual device positions persist in localStorage.",
      },
    ],
  },
  {
    id: "sync",
    label: "Synchronized Interactions",
    items: [
      {
        id: "sync-scroll",
        question: "How does synchronized scrolling work?",
        answer:
          "Responsivelyonline injects a sync-bridge script into each iframe via a postMessage-based system. When you scroll in one iframe, it broadcasts the scroll position and the other iframes attempt to match it. Synchronization works for same-origin iframes and compatible pages; cross-origin security policies may limit or prevent it on some sites.",
      },
      {
        id: "sync-clicks",
        question: "Can clicking a button on one screen trigger the same action on other screens?",
        answer:
          "Click and navigation events are mirrored across viewports where the sync mechanism can intercept them. Because each viewport is a separate iframe, interactions that depend on authenticated state, dynamic DOM structure, or iframe isolation may not propagate perfectly. Synchronisation works best on straightforward, publicly accessible pages.",
      },
      {
        id: "sync-forms",
        question: "Are form inputs, dropdowns, modals, and navigation synchronized?",
        answer:
          "Basic navigation and scroll synchronization are supported. Complex interactions — multi-step form submission, dynamic modals triggered by JavaScript, dropdown menus that depend on hover state — are not guaranteed to synchronize perfectly across viewports, especially when responsive DOM structure differs between breakpoints.",
      },
      {
        id: "sync-failure",
        question: "Why might synchronization fail on some websites?",
        answer:
          "Synchronization can fail due to cross-origin restrictions (the browser blocks postMessage across origins), dynamic layout differences (a mobile menu may not exist in the desktop DOM), JavaScript that prevents event propagation, iframes that re-render on user interaction, or Content Security Policy rules that block script injection.",
      },
      {
        id: "disable-sync",
        question: "Can I disable synchronization?",
        answer:
          "Yes. The SyncToolbar in the workspace allows you to toggle synchronized interactions on and off. When disabled, each device preview operates independently.",
      },
    ],
  },
  {
    id: "troubleshooting",
    label: "Performance & Troubleshooting",
    items: [
      {
        id: "slow-load",
        question: "Why is a preview loading slowly?",
        answer:
          "Loading multiple full-page iframes simultaneously is resource-intensive. Slow load times can result from: a heavy target website with many third-party scripts; limited network bandwidth; browser tab throttling when the window is inactive; or running too many previews at once. Try closing unused device frames or refreshing selectively.",
      },
      {
        id: "http-errors",
        question: "Why does a preview show a 403, 404, or browser error?",
        answer:
          "These are genuine HTTP responses from the target website. A 404 means the URL path does not exist. A 403 means the site returned an access-denied response (distinct from an iframe-embedding block). A browser-level error (such as ERR_CONNECTION_REFUSED) means the host could not be reached at all.",
      },
      {
        id: "image-font-fail",
        question: "Why do images or fonts fail to load?",
        answer:
          "Resources within the target page are fetched by the embedded iframe under normal browser security rules. Missing images or fonts may be caused by CORS restrictions on the target server, relative paths that resolve differently in an iframe context, or network issues reaching third-party CDNs.",
      },
      {
        id: "layout-differences",
        question: "Why do mobile and desktop layouts look different?",
        answer:
          "Each iframe is sized to the CSS viewport dimensions of the device (e.g. 393px wide for iPhone 14 Pro). The target site's media queries, fluid grids, and responsive rules respond to those exact viewport dimensions — producing genuine responsive rendering differences between device sizes. This is expected and correct behaviour.",
      },
      {
        id: "refresh-all",
        question: "How do I refresh all device previews?",
        answer:
          "The top workspace toolbar has a Refresh All button (circular arrow icon) that reloads every active iframe simultaneously. Individual device frames also have their own Reload button in their per-device toolbar.",
      },
      {
        id: "not-working",
        question: "What should I do if the previewer is not working?",
        answer:
          "Check whether the target URL is reachable directly in a new browser tab. Verify that the site does not send X-Frame-Options or CSP frame-ancestors headers blocking embedding. Try clearing browser cache and localStorage. Ensure JavaScript is enabled and no browser extension is blocking iframes. If the problem persists, report it on GitHub with the URL, browser version, and any console errors.",
        link: {
          text: "Report an issue on GitHub",
          href: "https://github.com/responsively-org/responsively-app/issues",
          external: true,
        },
      },
    ],
  },
  {
    id: "community",
    label: "Community & Support",
    items: [
      {
        id: "report-bug",
        question: "How do I report a bug?",
        answer:
          "Open an issue on the GitHub repository. Include the URL you were previewing, a description of the observed behaviour, your browser and OS version, and any relevant console messages.",
        link: {
          text: "Open GitHub Issues",
          href: "https://github.com/responsively-org/responsively-app/issues",
          external: true,
        },
      },
      {
        id: "request-feature",
        question: "How do I request a feature?",
        answer:
          "Feature requests and workflow suggestions can be submitted via GitHub Issues. Search existing issues first to avoid duplicates, then open a new issue with your use case and rationale.",
        link: {
          text: "Submit a feature request",
          href: "https://github.com/responsively-org/responsively-app/issues",
          external: true,
        },
      },
      {
        id: "contribute",
        question: "How can I contribute to Responsivelyonline?",
        answer:
          "Contributions are welcome. You can contribute bug fixes, new device presets, documentation improvements, and UI enhancements. Look for issues labelled 'good first issue' on the GitHub repository to find a good starting point.",
        link: {
          text: "View GitHub Repository",
          href: "https://github.com/responsively-org/responsively-app",
          external: true,
        },
      },
      {
        id: "contact",
        question: "How can I contact the team?",
        answer:
          "For partnership and sponsorship enquiries, you can reach Manoj Vivek (the project maintainer) at p.manoj.vivek@gmail.com. For bug reports and feature requests, use GitHub Issues.",
        link: {
          text: "Sponsor the project",
          href: "/sponsor",
        },
      },
      {
        id: "docs",
        question: "Where can I find documentation?",
        answer:
          "Documentation for all implemented features — Getting Started, Device Guide, Infinite Canvas, Synchronized Interactions, and URL troubleshooting — is available in the Docs section.",
        link: { text: "Browse Documentation", href: "/docs" },
      },
    ],
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const buttonId = `faq-btn-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white ${
        isOpen
          ? "border-[#079B73]/50 shadow-pastel-sm ring-1 ring-[#079B73]/20"
          : "border-[#E8DDFD]/80 hover:border-[#C4B5FD] shadow-xs"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] focus-visible:ring-offset-1 rounded-2xl"
        >
          <span className="text-base sm:text-[17px] font-bold text-[#11172B] tracking-tight">
            {item.question}
          </span>
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-transform duration-200 ${
              isOpen ? "bg-[#11172B] text-white rotate-180" : "bg-[#FBE8F7]/80 text-[#11172B]"
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4" />
          </span>
        </button>
      </h3>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <p>{item.answer}</p>
          {item.link && (
            <div className="mt-3.5 pt-3 border-t border-[#E8DDFD]/60">
              {item.link.external ? (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#079B73] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
                >
                  <span>{item.link.text}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href={item.link.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#079B73] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73]"
                >
                  {item.link.text}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("what-is");
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const searchId = useId();

  const handleToggle = useCallback(
    (id: string) => setOpenId((prev) => (prev === id ? null : id)),
    []
  );

  // Filter by search
  const filteredData = faqData
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !searchQuery ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const displayData = searchQuery
    ? filteredData
    : faqData.filter((cat) => cat.id === activeCategory);

  const totalResults = filteredData.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-10 sm:py-14 bg-[#FBFBFE] relative border-t border-[#E8DDFD]/60"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#11172B] tracking-tight"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3F5496] leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about browser-based rendering, iframe sandboxing,
            device emulation limits, and more.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-lg mx-auto">
          <label htmlFor={searchId} className="sr-only">
            Search frequently asked questions
          </label>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8597CE] pointer-events-none"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setOpenId(null);
            }}
            placeholder="Search questions…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DDFD] bg-white text-sm text-[#11172B] placeholder:text-[#8597CE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] focus-visible:border-[#079B73] transition-all"
            aria-label="Search frequently asked questions"
          />
          {searchQuery && (
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {totalResults} result{totalResults !== 1 ? "s" : ""} found
            </div>
          )}
        </div>

        {/* Category tabs — hidden when searching */}
        {!searchQuery && (
          <div
            className="flex flex-wrap gap-2 justify-center mb-8"
            role="tablist"
            aria-label="FAQ categories"
          >
            {faqData.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-controls={`faq-panel-cat-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenId(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] ${
                  activeCategory === cat.id
                    ? "bg-[#11172B] text-white shadow-sm"
                    : "bg-white border border-[#E8DDFD] text-[#5B71B5] hover:border-[#079B73]/50 hover:text-[#079B73]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Search results count */}
        {searchQuery && (
          <p className="text-center text-xs text-[#8597CE] mb-6">
            {totalResults === 0
              ? "No matching questions found."
              : `${totalResults} question${totalResults !== 1 ? "s" : ""} match "${searchQuery}"`}
          </p>
        )}

        {/* FAQ accordion items */}
        <div className="space-y-3.5">
          {displayData.map((category) => (
            <div
              key={category.id}
              id={`faq-panel-cat-${category.id}`}
              role="tabpanel"
              aria-label={`${category.label} questions`}
            >
              {searchQuery && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8597CE] mb-3 px-1">
                  {category.label}
                </h3>
              )}
              <div className="space-y-3">
                {category.items.map((item) => (
                  <FAQItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() => handleToggle(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support footer */}
        <div className="mt-10 pt-8 border-t border-[#E8DDFD]/70 text-center">
          <p className="text-sm text-[#5B71B5]">
            Still need help?{" "}
            <Link href="/docs" className="font-semibold text-[#079B73] hover:underline">
              Visit documentation
            </Link>{" "}
            or{" "}
            <a
              href="https://github.com/responsively-org/responsively-app/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#079B73] hover:underline"
            >
              report an issue
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
