import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/blog", "/sponsor", "/privacy", "/terms", "/sitemap"],
        // Disallow workspace preview states with arbitrary URL params - no user value in indexing
        disallow: ["/workspace?*", "/preview?*", "/api/"],
      },
    ],
    sitemap: "https://responsively.online/sitemap.xml",
  };
}
