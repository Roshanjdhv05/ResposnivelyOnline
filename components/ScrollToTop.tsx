"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-7 right-7 z-40 w-11 h-11 rounded-full bg-[#079B73] hover:bg-[#068361] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#079B73] focus-visible:ring-offset-2"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
}
