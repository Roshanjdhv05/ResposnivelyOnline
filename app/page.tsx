import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import VideoShowcase from "@/components/landing/VideoShowcase";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UtilitiesSection from "@/components/landing/UtilitiesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCasesSection from "@/components/landing/UseCasesSection";
import WorkflowComparisonSection from "@/components/landing/WorkflowComparisonSection";
import ResourcesSection from "@/components/landing/ResourcesSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsivelyonline – Responsive Website Preview & Testing",
  description:
    "Preview your website across mobile, tablet, laptop, and desktop viewports in one interactive workspace. Explore responsive layouts and test supported interactions.",
  alternates: { canonical: "https://responsively.online" },
  openGraph: {
    title: "Responsivelyonline – Responsive Website Preview & Testing",
    description:
      "Preview your website across mobile, tablet, laptop, and desktop viewports in one interactive workspace.",
    url: "https://responsively.online",
    type: "website",
  },
  verification: {
    google: "8BwvGG6Wz5cHFbrDM7mHnhbq9H5tQfN9Vjecfu-DvNo",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#11172B] selection:bg-[#E8DDFD] selection:text-[#11172B] font-sans">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <VideoShowcase />
        <FeaturesSection />
        <UtilitiesSection />
        <HowItWorks />
        <UseCasesSection />
        <WorkflowComparisonSection />
        <ResourcesSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
