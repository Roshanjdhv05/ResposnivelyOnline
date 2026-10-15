import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering insights, feature announcements, and community updates from the Responsively project.",
  alternates: {
    canonical: "/blog",
  },
};

interface BlogPost {
  title: string;
  url: string;
  date: string;
  summary: string;
  author: {
    name: string;
    url: string;
  };
}

const posts: BlogPost[] = [
  {
    title: "Exploring Responsively",
    url: "https://responsively.app/blog/responsively-app-guide",
    date: "September 15, 2024",
    summary: "In this post we are sharing the main features of Responsively.",
    author: {
      name: "Violeta R. Lozano",
      url: "https://violeta.dev/",
    },
  },
  {
    title:
      "Exciting News: Responsively App partners with BrowserStack to bring real device testing to your workflow",
    url: "https://responsively.app/blog/responsively-app-browserstack-partnership",
    date: "October 31, 2023",
    summary:
      "We're thrilled to announce our partnership with BrowserStack, which brings seamless real device testing to your workflow.",
    author: {
      name: "Manoj Vivek",
      url: "https://twitter.com/vivek_jonam",
    },
  },
  {
    title: "Learnings that led to Screenshot v2 (3-5x speed improvement over v1)",
    url: "https://responsively.app/blog/learnings-that-led-to-screenshot-v2",
    date: "September 15, 2020",
    summary: "In this post we are sharing the learnings from mechanism v1 that laid the base for v2.",
    author: {
      name: "Manoj Vivek",
      url: "https://twitter.com/vivek_jonam",
    },
  },
];

export default function BlogPage() {
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
          <div className="mb-14 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl font-black text-[#11172B] tracking-tight leading-none mb-3">
              Blog
            </h1>
            <p className="text-base sm:text-lg text-[#5B71B5] font-normal">
              News, engineering deep dives, and product announcements from the Responsively team.
            </p>
          </div>

          {/* Clean Unboxed Blog Posts List matching reference screenshot */}
          <div className="space-y-12 sm:space-y-16">
            {posts.map((post, index) => (
              <article key={post.title} className="group">
                {/* Date & Author Header */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#5B71B5] mb-2.5">
                  <span className="font-medium text-slate-500">{post.date}</span>
                  <span className="text-slate-300">•</span>
                  <span>By</span>
                  <a
                    href={post.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#079B73] hover:underline"
                  >
                    {post.author.name}
                  </a>
                </div>

                {/* Post Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11172B] tracking-tight group-hover:text-[#079B73] transition-colors leading-snug mb-3">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 focus:outline-none focus-visible:underline"
                  >
                    <span>{post.title}</span>
                    <ArrowUpRight className="w-5 h-5 shrink-0 text-[#079B73] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1" />
                  </a>
                </h2>

                {/* Excerpt / Summary */}
                <p className="text-base sm:text-[17px] text-[#4A5D8E] leading-relaxed max-w-3xl mb-4">
                  {post.summary}
                </p>

                {/* Read Link */}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#079B73] hover:text-[#05805e] transition-colors"
                >
                  <span>Read full post</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                {/* Clean divider between posts */}
                {index < posts.length - 1 && (
                  <div className="border-b border-slate-200/60 mt-12 sm:mt-16" />
                )}
              </article>
            ))}
          </div>
        </div>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
