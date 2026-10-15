"use client";

const useCases = [
  {
    title: "Frontend Development",
    desc: "Preview localhost or staging URLs across all breakpoints simultaneously while you code. Catch layout bugs before they reach production — no more toggling browser devtools.",
    accent: "#FBE8F7",
  },
  {
    title: "Responsive Web Design",
    desc: "Verify that fluid grids, flexible images, and media queries behave as intended across mobile, tablet, and desktop widths. Inspect every breakpoint without resizing windows.",
    accent: "#E8DDFD",
  },
  {
    title: "Landing Page Testing",
    desc: "Ensure your marketing pages look polished across all entry points. Compare hero sections, CTAs, and pricing layouts on every viewport size before launch.",
    accent: "#DCEBFF",
  },
  {
    title: "Cross-Viewport QA",
    desc: "Run manual quality checks across multiple device sizes in one pass. Identify layout shifts, overflow issues, and clipped text faster than single-window inspection.",
    accent: "#FBE8F7",
  },
  {
    title: "UI Regression Inspection",
    desc: "After a code change, refresh all viewports simultaneously and visually compare the same page across screen sizes side-by-side to spot unexpected regressions.",
    accent: "#E8DDFD",
  },
  {
    title: "Website Redesigns",
    desc: "Compare the old and new design implementations at matching viewport sizes. Use the infinite canvas to position before/after versions next to each other.",
    accent: "#DCEBFF",
  },
  {
    title: "Agency Client Reviews",
    desc: "Walk clients through responsive behavior by presenting all device views simultaneously. Rotate tablets, zoom into mobile, and demonstrate how layouts adapt on every screen.",
    accent: "#FBE8F7",
  },
  {
    title: "Design System Validation",
    desc: "Check that design system components — typography scales, spacing, and component states — apply correctly across every configured viewport width.",
    accent: "#E8DDFD",
  },
];

export default function UseCasesSection() {
  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#F8FBFA] to-white relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DDFD]/60 text-xs font-bold tracking-wider text-[#5B71B5] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B71B5]" aria-hidden="true" />
            <span>Use Cases</span>
          </div>

          <h2
            id="use-cases-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#11172B] tracking-tight leading-[1.1]"
          >
            Who Benefits from Responsive Testing.
          </h2>

          <p className="mt-5 text-base sm:text-[17px] text-[#5B71B5] leading-relaxed max-w-2xl">
            Responsivelyonline fits naturally into daily development, QA, design, and agency
            workflows — anywhere viewport accuracy matters.
          </p>
        </div>

        {/* Use cases — editorial grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8DDFD]/40 rounded-3xl overflow-hidden border border-[#E8DDFD]/60">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className="bg-white p-6 sm:p-7 hover:bg-gradient-to-br hover:from-white hover:to-[#F8FBFF] transition-colors duration-200 group"
            >
              {/* Index number */}
              <span
                className="text-[11px] font-mono font-bold text-[#8597CE] mb-4 block"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Color accent strip */}
              <div
                className="w-8 h-1 rounded-full mb-4"
                style={{ backgroundColor: useCase.accent === "#FBE8F7" ? "#C084C5" : useCase.accent === "#E8DDFD" ? "#9B79E0" : "#5B9BD5" }}
                aria-hidden="true"
              />

              <h3 className="text-base sm:text-lg font-bold text-[#11172B] tracking-tight mb-2.5 group-hover:text-[#079B73] transition-colors duration-200">
                {useCase.title}
              </h3>

              <p className="text-sm text-[#64748B] leading-relaxed">
                {useCase.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
