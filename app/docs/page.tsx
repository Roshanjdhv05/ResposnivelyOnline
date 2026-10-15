import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Complete documentation for Responsivelyonline: Getting Started, Device Guide, Infinite Canvas, Synchronized Interactions, URL troubleshooting, and contribution guide.",
  alternates: { canonical: "https://responsively.online/docs" },
};

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <p>
          Responsivelyonline is a browser-based multi-viewport website previewer. No installation or
          account is required for the web version.
        </p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Quick Start</h3>
        <ol className="list-decimal list-inside space-y-2 pl-2">
          <li>Open the workspace at <Link href="/workspace" className="text-[#079B73] font-semibold hover:underline">/workspace</Link></li>
          <li>Type or paste a URL in the address bar — for example <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">example.com</code> or <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">https://stripe.com</code></li>
          <li>Press <strong>Preview</strong> or hit Enter — four device viewports load immediately</li>
          <li>Pan the canvas by clicking and dragging the background; zoom with the scroll wheel</li>
        </ol>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Self-Hosting Locally</h3>
        <p>Requires Node.js 18.18 or newer.</p>
        <pre className="bg-[#11172B] text-[#8CE3C7] text-xs font-mono rounded-xl p-4 overflow-x-auto">
          <code>{`git clone https://github.com/responsively-org/responsively-app
npm install
npm run dev    # → http://localhost:3000`}</code>
        </pre>
        <p>
          In development mode, localhost and private network addresses (e.g. <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">192.168.x.x</code>) are accessible. To allow them in a production build, set <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">ALLOW_PRIVATE_HOSTS=true</code>.
        </p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">URL Normalization</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li><code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">example.com</code> → <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">https://example.com</code> (https:// added automatically)</li>
          <li><code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">localhost:3000</code> → <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">http://localhost:3000</code> (http:// for local)</li>
          <li>Malformed URLs and non-HTTP/HTTPS schemes are rejected with a clear error message</li>
        </ul>
      </div>
    ),
  },
  {
    id: "device-guide",
    title: "Device & Viewport Guide",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <p>
          Each device preview is a native <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">&lt;iframe&gt;</code> sized to its configured CSS pixel dimensions. A <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">transform: scale()</code> wrapper makes it smaller on screen — so the site's media queries always see the true device viewport size.
        </p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Default Device Presets</h3>
        <div className="overflow-x-auto rounded-xl border border-[#E8DDFD]">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-[#F8FAFD] border-b border-[#E8DDFD]">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-[#11172B]">Device</th>
                <th className="text-left px-4 py-3 font-bold text-[#11172B]">Width</th>
                <th className="text-left px-4 py-3 font-bold text-[#11172B]">Height</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDFD]/60">
              {[
                ["iPhone 14 Pro", "393px", "852px"],
                ["iPad Mini", "768px", "1024px"],
                ["MacBook Pro", "1440px", "900px"],
                ["Desktop Monitor", "1920px", "1080px"],
              ].map(([name, w, h]) => (
                <tr key={name} className="hover:bg-[#FAFBFF]">
                  <td className="px-4 py-3 font-medium text-[#11172B]">{name}</td>
                  <td className="px-4 py-3 font-mono text-[#5B71B5]">{w}</td>
                  <td className="px-4 py-3 font-mono text-[#5B71B5]">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Per-Device Controls</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li><strong>Device name ▾</strong> — Switch this preview to another preset or custom size</li>
          <li><strong>Rotate</strong> — Swap width and height without reloading (animated transition)</li>
          <li><strong>Reload</strong> — Reload only this preview</li>
          <li><strong>50 / 75 / 100 / Fit</strong> — Zoom this device; Fit uses a shared proportional scale</li>
          <li><strong>Full Screen</strong> — Uses the browser Fullscreen API on this device preview</li>
          <li><strong>Open in New Tab</strong> — Opens the target URL directly</li>
          <li><strong>Screenshot</strong> — Captures via Screen Capture API (browser permission required)</li>
          <li><strong>✕</strong> — Remove this device from the workspace</li>
        </ul>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Custom Viewports</h3>
        <p>Click <strong>Add Device</strong> in the top toolbar, then select <strong>Custom Size</strong>. Enter any pixel width × height and an optional label. Custom sizes are stored in localStorage.</p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Persistence</h3>
        <p>Device selection, orientation, zoom, workspace theme, compact mode, and the last URL are stored in localStorage under the key <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">rwp:v1</code>.</p>
      </div>
    ),
  },
  {
    id: "canvas-guide",
    title: "Infinite Canvas Guide",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <p>
          The workspace is an open infinite canvas — there are no fixed columns or page boundaries. Device frames can be freely positioned, the view can be panned in any direction, and zoom level is adjustable.
        </p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Canvas Navigation</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li><strong>Pan</strong> — Click and drag the canvas background</li>
          <li><strong>Zoom</strong> — Scroll wheel, or use the zoom control in the toolbar</li>
          <li><strong>Drag devices</strong> — Click and drag a device header to reposition it</li>
        </ul>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Canvas Toolbar Controls</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li><strong>Refresh All</strong> — Reloads all active iframes simultaneously</li>
          <li><strong>Add Device</strong> — Opens preset selector or custom-size dialog</li>
          <li><strong>Zoom All to Fit</strong> — Scales all devices proportionally to fit the window</li>
          <li><strong>Reset Layout</strong> — Returns devices to default arrangement</li>
          <li><strong>Compact Layout</strong> — Tiles devices closely together</li>
          <li><strong>Dark / Light Theme</strong> — Toggles workspace canvas theme</li>
        </ul>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Minimap</h3>
        <p>A minimap in the corner provides a bird's-eye overview of where all device frames are positioned relative to the viewport.</p>
        <div className="p-4 rounded-xl bg-[#FBE8F7]/40 border border-[#E8DDFD] text-xs text-[#5B71B5]">
          <strong className="text-[#11172B]">Note:</strong> Zoom and layout changes never reload an iframe — the embedded page state is preserved when you move or resize the canvas view.
        </div>
      </div>
    ),
  },
  {
    id: "sync-guide",
    title: "Synchronized Interactions Guide",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <p>
          Synchronized interactions mirror scroll positions, clicks, and navigation events across compatible viewport frames.
        </p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">How It Works</h3>
        <p>
          A sync-bridge script (<code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">/sync-bridge.js</code>) is injected into each iframe. When an interaction occurs in one viewport, it sends a postMessage event; the other viewports receive and mirror it.
        </p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Supported Interactions</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Scroll position synchronization</li>
          <li>Link navigation within the site (same-origin, where policies allow)</li>
          <li>Basic click events on compatible elements</li>
        </ul>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Limitations</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Cross-origin iframes may block postMessage — synchronization is limited or unavailable</li>
          <li>Mobile and desktop DOM structures may differ significantly (e.g. a hamburger menu exists at mobile but not desktop)</li>
          <li>Authentication-dependent UI, modals triggered by JavaScript, and hover states are not reliably synchronized</li>
          <li>Sites that detect iframe embedding and redirect will not synchronize</li>
        </ul>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Enabling / Disabling</h3>
        <p>Use the Sync Toolbar in the workspace to toggle synchronized interactions on or off per session.</p>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
          <strong>Important:</strong> Synchronization depends on the target website's security configuration. Sites with strict CSP or cross-origin policies may not synchronize even when the option is enabled.
        </div>
      </div>
    ),
  },
  {
    id: "troubleshooting",
    title: "URL & Preview Troubleshooting",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <h3 className="text-base font-bold text-[#11172B]">Site Shows Blank or Error</h3>
        <p>Most commonly caused by the target website sending embedding-prevention headers:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">X-Frame-Options: DENY</code> or <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">X-Frame-Options: SAMEORIGIN</code></li>
          <li><code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">Content-Security-Policy: frame-ancestors 'none'</code></li>
        </ul>
        <p>Responsivelyonline detects these via <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">/api/check</code> and displays the exact header rather than showing a broken frame. Use <strong>Open in New Tab</strong> for non-embeddable sites.</p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">HTTP Errors (403, 404)</h3>
        <p>These are real HTTP responses from the target server — not embedding issues. A 404 means the URL path does not exist. A 403 means the server denied access.</p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Localhost Not Loading</h3>
        <p>In production deployments, private and loopback addresses are blocked by <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">/api/check</code>. Run <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">npm run dev</code> locally, or set <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">ALLOW_PRIVATE_HOSTS=true</code> in a self-hosted production build.</p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Mixed Content Warning</h3>
        <p>A secure (https) page cannot embed a non-secure (http) iframe. If you're previewing on an https deployment, the target site must also be https.</p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Screenshots Not Working</h3>
        <p>Screenshots use the Screen Capture API — your browser will ask you to select a tab to capture. Choose <strong>This Tab</strong>. Chrome and Edge support precise Region Capture; other browsers crop by position and require the preview to be fully visible. Safari and most mobile browsers do not support this API.</p>
      </div>
    ),
  },
  {
    id: "faq-link",
    title: "Frequently Asked Questions",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <p>
          The FAQ covers general questions, iframe embedding, device emulation, canvas controls,
          synchronized interactions, privacy, and community support.
        </p>
        <Link
          href="/#faq"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11172B] text-white text-sm font-semibold hover:bg-[#1D284B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors"
        >
          <span>Browse the Full FAQ</span>
          <ArrowRight className="w-4 h-4 text-[#079B73]" />
        </Link>
      </div>
    ),
  },
  {
    id: "contributing",
    title: "Contribution Guide",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <p>
          Responsivelyonline is open source. Contributions are welcome and reviewed on GitHub.
        </p>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Ways to Contribute</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Report bugs via GitHub Issues with reproduction steps</li>
          <li>Submit new device presets (name, width, height) as pull requests</li>
          <li>Improve documentation or add usage examples</li>
          <li>Fix accessibility issues or improve keyboard navigation</li>
          <li>Submit performance improvements or canvas enhancements</li>
        </ul>
        <h3 className="text-base font-bold text-[#11172B] mt-6">Getting Started</h3>
        <ol className="list-decimal list-inside space-y-1.5 pl-2">
          <li>Fork the repository on GitHub</li>
          <li>Run <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">npm install && npm run dev</code></li>
          <li>Make your changes in a dedicated branch</li>
          <li>Run <code className="bg-[#F0F4FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#11172B]">npm run typecheck</code> to verify TypeScript</li>
          <li>Open a pull request with a clear description</li>
        </ol>
        <a
          href="https://github.com/responsively-org/responsively-app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11172B] text-white text-sm font-semibold hover:bg-[#1D284B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors mt-2"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-4 h-4 text-[#079B73]" />
        </a>
      </div>
    ),
  },
  {
    id: "bug-reporting",
    title: "Bug Reporting",
    content: (
      <div className="space-y-4 text-sm sm:text-[15px] text-[#3F5496] leading-relaxed">
        <p>When filing a bug report, include:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>The URL you were previewing (if relevant)</li>
          <li>Steps to reproduce the issue</li>
          <li>Expected vs. actual behaviour</li>
          <li>Browser name and version (e.g. Chrome 128)</li>
          <li>Operating system (e.g. Windows 11, macOS 14)</li>
          <li>Any relevant browser console errors (F12 → Console)</li>
        </ul>
        <a
          href="https://github.com/responsively-org/responsively-app/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11172B] text-white text-sm font-semibold hover:bg-[#1D284B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors mt-2"
        >
          <span>Open a GitHub Issue</span>
          <ExternalLink className="w-4 h-4 text-[#079B73]" />
        </a>
      </div>
    ),
  },
];

export default function DocsPage() {
  return (
    <div
      className="min-h-screen text-[#11172B] font-sans selection:bg-[#E8DDFD] selection:text-[#11172B] flex flex-col justify-between"
      style={{
        background: `
          radial-gradient(ellipse 900px 700px at 0% 12%, rgba(246, 230, 255, 0.65) 0%, rgba(255, 255, 255, 0) 70%),
          radial-gradient(ellipse 900px 700px at 100% 16%, rgba(215, 238, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%),
          #FFFFFF
        `,
      }}
    >
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-6xl font-black text-[#11172B] tracking-tight leading-none mb-4">
              Documentation
            </h1>
            <p className="text-base sm:text-lg text-[#3F5496] leading-relaxed max-w-2xl">
              Everything you need to know about using Responsivelyonline — from getting started to
              advanced canvas controls and contributing.
            </p>
          </div>

          {/* Doc section navigation */}
          <nav
            className="mb-10 flex flex-wrap gap-2"
            aria-label="Documentation sections"
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#5B71B5] bg-white border border-[#E8DDFD] hover:border-[#079B73]/50 hover:text-[#079B73] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>

          {/* Documentation sections */}
          <div className="space-y-16">
            {sections.map((section, index) => (
              <article key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-start gap-4 mb-6">
                  <span
                    className="text-[11px] font-mono font-bold text-[#8597CE] mt-1 shrink-0"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11172B] tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-8 border-l-2 border-[#E8DDFD]">
                  {section.content}
                </div>
                {index < sections.length - 1 && (
                  <div className="border-b border-[#E8DDFD]/60 mt-16" />
                )}
              </article>
            ))}
          </div>

          {/* Footer support line */}
          <div className="mt-16 pt-10 border-t border-[#E8DDFD]/70 text-center">
            <p className="text-sm text-[#5B71B5]">
              Still need help?{" "}
              <a
                href="https://github.com/responsively-org/responsively-app/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#079B73] hover:underline"
              >
                Report an issue on GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
