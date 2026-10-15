"use client";

import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/types";

interface WaveDotGridCanvasProps {
  pan: { x: number; y: number };
  zoom: number;
  theme: Theme;
  enabled?: boolean;
}

const BASE_SPACING = 32;

export default function WaveDotGridCanvas({
  pan,
  zoom,
  theme,
  enabled = true,
}: WaveDotGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  const themeRef = useRef(theme);
  const enabledRef = useRef(enabled);

  panRef.current = pan;
  zoomRef.current = zoom;
  themeRef.current = theme;
  enabledRef.current = enabled;

  // Track mouse position over canvas for gentle interactive ripple
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active:
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Main canvas animation & rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let prefersReducedMotion = false;

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotion = mediaQuery.matches;
      const updateMotionPreference = (e: MediaQueryListEvent) => {
        prefersReducedMotion = e.matches;
      };
      mediaQuery.addEventListener?.("change", updateMotionPreference);
    }

    const render = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetWidth = Math.floor(width * dpr);
      const targetHeight = Math.floor(height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const curPan = panRef.current;
      const curZoom = zoomRef.current;
      const isDark = themeRef.current === "dark";
      const isAnimated = enabledRef.current && !prefersReducedMotion;

      // Color palettes for minimal, low-contrast, elegant aesthetic
      const r = isDark ? 148 : 100;
      const g = isDark ? 163 : 116;
      const b = isDark ? 184 : 139;

      // Calculate visible world bounds based on current pan and zoom
      const minWx = -curPan.x / curZoom;
      const maxWx = (width - curPan.x) / curZoom;
      const minWy = -curPan.y / curZoom;
      const maxWy = (height - curPan.y) / curZoom;

      // Adaptive grid spacing when heavily zoomed out to maintain high performance
      let stepMultiplier = 1;
      if (curZoom < 0.35) stepMultiplier = 3;
      else if (curZoom < 0.6) stepMultiplier = 2;
      const spacing = BASE_SPACING * stepMultiplier;

      const startCol = Math.floor(minWx / spacing) - 1;
      const endCol = Math.ceil(maxWx / spacing) + 1;
      const startRow = Math.floor(minWy / spacing) - 1;
      const endRow = Math.ceil(maxWy / spacing) + 1;

      // Time variable for continuous, seamless wave undulation
      const t = isAnimated ? time * 0.0016 : 0;

      // World mouse coordinates
      const mouse = mouseRef.current;
      const mouseActive = mouse.active && isAnimated;
      const mouseWx = (mouse.x - curPan.x) / curZoom;
      const mouseWy = (mouse.y - curPan.y) / curZoom;
      const mouseInfluenceRadius = 260;

      const baseDotRadius = Math.max(1.1, Math.min(2.1, 1.45 * Math.sqrt(curZoom)));

      // Draw dots across visible grid
      for (let c = startCol; c <= endCol; c++) {
        const wx = c * spacing;
        const baseSx = wx * curZoom + curPan.x;

        for (let rRow = startRow; rRow <= endRow; rRow++) {
          const wy = rRow * spacing;
          const baseSy = wy * curZoom + curPan.y;

          let wave = 0;
          let mouseDist = 9999;

          if (isAnimated) {
            // Gentle 2D traveling sine wave
            const w1 = Math.sin(wx * 0.005 + wy * 0.0035 + t);
            const w2 = Math.cos(wx * 0.0035 - wy * 0.0055 + t * 0.85);
            wave = (w1 + w2) * 0.5;

            // Subtle mouse ripple
            if (mouseActive) {
              const dx = wx - mouseWx;
              const dy = wy - mouseWy;
              mouseDist = Math.hypot(dx, dy);

              if (mouseDist < mouseInfluenceRadius) {
                const falloff = Math.cos((mouseDist / mouseInfluenceRadius) * (Math.PI / 2));
                const ripple = Math.sin(mouseDist * 0.04 - t * 3.2) * falloff * 0.45;
                wave += ripple;
              }
            }
          }

          // Subtle position shift (keeping wave gentle and non-distracting)
          const dispX = isAnimated ? Math.cos(wave * Math.PI) * 1.2 * Math.min(curZoom, 1.2) : 0;
          const dispY = isAnimated ? wave * 2.2 * Math.min(curZoom, 1.2) : 0;

          const px = baseSx + dispX;
          const py = baseSy + dispY;

          // Subtle opacity shift along the sine wave pattern
          let opacity = isDark
            ? 0.12 + (wave + 1) * 0.09
            : 0.14 + (wave + 1) * 0.11;

          if (mouseActive && mouseDist < mouseInfluenceRadius) {
            const proximity = 1 - mouseDist / mouseInfluenceRadius;
            opacity += proximity * 0.15;
          }

          opacity = Math.max(0.06, Math.min(0.55, opacity));

          const dotRadius = isAnimated
            ? baseDotRadius * (0.85 + (wave + 1) * 0.15)
            : baseDotRadius;

          ctx.beginPath();
          ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(3)})`;
          ctx.fill();
        }
      }

      ctx.restore();

      if (isAnimated) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (enabled && !prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      // Static render for reduced-motion or disabled animation
      render(0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pan, zoom, theme, enabled]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
    />
  );
}
