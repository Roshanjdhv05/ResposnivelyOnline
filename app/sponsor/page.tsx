import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {
  Heart,
  CreditCard,
  Briefcase,
  Users,
  Handshake,
  Mail,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Sponsor",
  description:
    "Support Responsively as a free and open-source project. Explore GitHub Sponsors, Open Collective, and corporate partnerships.",
  alternates: {
    canonical: "/sponsor",
  },
};

export default function SponsorPage() {
  return (
    <div
      className="min-h-screen text-[#11172B] font-sans selection:bg-[#E8DDFD] selection:text-[#11172B] flex flex-col justify-between"
      style={{
        background: `
          radial-gradient(ellipse 900px 700px at 0% 12%, rgba(246, 230, 255, 0.75) 0%, rgba(255, 255, 255, 0) 70%),
          radial-gradient(ellipse 900px 700px at 100% 16%, rgba(215, 238, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%),
          #FFFFFF
        `,
      }}
    >
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title - No Box */}
          <div className="mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-6xl font-black text-[#11172B] tracking-tight leading-none mb-5">
              Become a{" "}
              <span className="relative inline-block text-[#079B73]">
                Sponsor
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#8CE3C7]"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C45 3 135 3 198 10"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#3F5496] leading-relaxed max-w-3xl">
              Being a free and open-source project that is supported by the community, your sponsorship is critical to our mission to keep the app free and accessible to everyone. Sponsoring is a great way to show your support for the open-source community and to help us maintain and improve our app.
            </p>
          </div>

          {/* Section: Ways to Sponsor - Unboxed */}
          <div className="mb-14 sm:mb-18">
            <h2 className="text-xl sm:text-2xl font-bold text-[#11172B] mb-5">
              Sponsorships can be done through the following ways:
            </h2>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="https://github.com/sponsors/responsively-org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#11172B] hover:bg-black text-white text-sm font-semibold transition-all hover:scale-102 shadow-sm"
              >
                <Heart className="w-4 h-4 text-[#EA4AAA] fill-current" />
                <span>GitHub Sponsors</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href="https://opencollective.com/responsively"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E6F8F3] hover:bg-[#D4F4EA] text-[#079B73] text-sm font-semibold transition-all hover:scale-102"
              >
                <CreditCard className="w-4 h-4" />
                <span>Open Collective</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

            <p className="text-sm sm:text-[15px] text-[#5B71B5] leading-relaxed max-w-3xl">
              Both recurring and one-time sponsorships are accepted. Recurring sponsorships are preferred as they help us cover our ongoing costs and plan for the future. If you have any questions about sponsoring Responsively App, please contact us at{" "}
              <a
                href="mailto:p.manoj.vivek@gmail.com"
                className="font-semibold text-[#079B73] underline underline-offset-2 hover:text-[#05805e]"
              >
                p.manoj.vivek@gmail.com
              </a>
            </p>
          </div>

          <div className="border-b border-slate-200/60 my-12" />

          {/* Section: Business Sponsors - Unboxed */}
          <div className="mb-14 sm:mb-18">
            <div className="flex items-center gap-2.5 mb-4">
              <Briefcase className="w-6 h-6 text-[#079B73]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11172B] tracking-tight">
                Business Sponsors
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#3F5496] leading-relaxed max-w-3xl">
              <p>
                Sponsoring Responsively App is a great way to enhance the reputation of your brand and showcase your commitment to open-source software development. Your support will help us deliver our mission and achieve our goals, which in turn will enhance your brand reputation and create positive associations with your company.
              </p>
              <p>
                By sponsoring Responsively App, you will put yourselves in front of a community of top talent in the open-source software development space. You can leverage this community to gain new talent, collaborate with other sponsors, and build long-term relationships with developers who share your values.
              </p>
              <p>
                If you&apos;re building a product or service that is relevant to the web development community, sponsoring Responsively App is a great way to increase your visibility through the badges on our website. Your sponsorship will help you reach a wider audience and generate more leads for your company.
              </p>
            </div>
          </div>

          <div className="border-b border-slate-200/60 my-12" />

          {/* Section: Individual Sponsors - Unboxed */}
          <div className="mb-14 sm:mb-18">
            <div className="flex items-center gap-2.5 mb-4">
              <Users className="w-6 h-6 text-[#079B73]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11172B] tracking-tight">
                Individual Sponsors
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#3F5496] leading-relaxed max-w-3xl">
              <p>
                We&apos;re grateful for the support of the developers community in a lot of ways and We understand that individual contributions come in different sizes and forms, so whether you are able to offer a small or large amount, every bit of support counts. We appreciate your consideration of this request, and we thank you for being a valued member of our community.
              </p>
              <p>
                We know it&apos;s a big ask, but if you work for a company that uses and benefits from Responsively App, please consider asking your employer to sponsor Responsively App. We understand that companies have budgets and financial constraints, but we would greatly appreciate your efforts in spreading the word about our project and the benefits it provides.
              </p>
              <p>
                Besides sponsoring, you can also contribute to the project by submitting bug reports, feature requests, and pull requests. You can also help us spread the word about Responsively App by sharing it with your friends and colleagues.
              </p>
            </div>
          </div>

          <div className="border-b border-slate-200/60 my-12" />

          {/* Section: Partnership - Unboxed */}
          <div className="mb-14 sm:mb-18">
            <div className="flex items-center gap-2.5 mb-4">
              <Handshake className="w-6 h-6 text-[#079B73]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11172B] tracking-tight">
                Partnership
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#3F5496] leading-relaxed max-w-3xl">
              <p>
                If you&apos;re interested in exploring partnership opportunities with us, please don&apos;t hesitate to reach out to us at{" "}
                <a
                  href="mailto:p.manoj.vivek@gmail.com"
                  className="font-bold text-[#079B73] underline underline-offset-2 hover:text-[#05805e]"
                >
                  p.manoj.vivek@gmail.com
                </a>
                . We&apos;d love to hear from you and discuss how we can work together to achieve mutual success.
              </p>

              <p className="font-medium text-[#11172B]">
                Thank you again for considering sponsoring Responsively App. Your support will help us continue to innovate and improve our app, and make a meaningful contribution to the open-source software development community.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="mailto:p.manoj.vivek@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#079B73] hover:bg-[#068361] text-white text-sm font-semibold transition-all shadow-sm hover:scale-102"
              >
                <Mail className="w-4 h-4" />
                <span>Contact via Email</span>
              </a>
              <a
                href="https://github.com/sponsors/responsively-org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#11172B] text-sm font-semibold transition-colors"
              >
                <Heart className="w-4 h-4 text-[#EA4AAA] fill-current" />
                <span>GitHub Sponsors</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
