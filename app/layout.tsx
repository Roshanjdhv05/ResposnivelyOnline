import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const SITE_URL = "https://responsively.online";
const SITE_NAME = "Responsivelyonline";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Responsivelyonline – Responsive Website Preview & Testing",
    template: "%s — Responsivelyonline",
  },
  description:
    "Preview your website across mobile, tablet, laptop, and desktop viewports in one interactive workspace. Explore responsive layouts and test supported interactions.",
  keywords: [
    "responsive website tester",
    "responsive website preview",
    "responsive design testing tool",
    "multi-device website preview",
    "mobile and desktop preview",
    "website viewport tester",
    "responsive layout checker",
    "online responsive preview tool",
    "device viewport testing",
  ],
  authors: [{ name: "Responsivelyonline" }],
  creator: "Responsivelyonline",
  publisher: "Responsivelyonline",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Responsivelyonline – Responsive Website Preview & Testing",
    description:
      "Preview your website across mobile, tablet, laptop, and desktop viewports in one interactive workspace.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Responsivelyonline logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Responsivelyonline – Responsive Website Preview & Testing",
    description:
      "Preview your website across mobile, tablet, laptop, and desktop viewports in one interactive workspace.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "Preview your website across mobile, tablet, laptop, and desktop viewports in one interactive workspace.",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/workspace?url={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
      sameAs: ["https://github.com/responsively-org/responsively-app"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "A browser-based tool for viewing and inspecting a website across multiple viewport sizes simultaneously on an infinite canvas.",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#11172B] focus:text-white focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[#079B73]"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
