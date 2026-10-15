import PreviewApp from "@/components/PreviewApp";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace — Responsivelyonline",
  description:
    "Live responsive website previewer and testing canvas across mobile, tablet, laptop, and desktop viewports.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/workspace",
  },
};

export default async function WorkspacePage(props: {
  searchParams: Promise<{ url?: string }>;
}) {
  const searchParams = await props.searchParams;
  const initialUrl = searchParams.url;

  return (
    <Suspense fallback={<div className="flex h-dvh w-full items-center justify-center bg-ws text-muted">Loading workspace...</div>}>
      <PreviewApp initialUrl={initialUrl} />
    </Suspense>
  );
}
