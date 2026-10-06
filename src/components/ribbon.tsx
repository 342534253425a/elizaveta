"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cx } from "@/lib/cx";

export function Ribbon({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || prefersReducedMotion()) return;

      const draw = () => {
        if (svg.dataset.drawn === "1" || svg.getBoundingClientRect().width === 0) return;
        const paths = svg.querySelectorAll("path");
        paths.forEach((path) => {
          const length = path.getTotalLength();
          if (!length) return;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "power2.inOut",
          stagger: 0.2,
          delay: 0.15,
        });
        gsap.from(svg.querySelectorAll("circle"), {
          autoAlpha: 0,
          scale: 0.4,
          transformOrigin: "center",
          duration: 0.55,
          stagger: 0.12,
          delay: 0.9,
          ease: "power2.out",
        });
        svg.dataset.drawn = "1";
      };

      draw();
      const observer = new ResizeObserver(draw);
      observer.observe(svg);
      return () => observer.disconnect();
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} className={cx("pointer-events-none text-white", className)} viewBox="0 0 860 420" fill="none" aria-hidden>
      <path
        d="M-20 250C120 310 210 70 360 120C520 174 590 330 760 230C860 176 900 90 940 120"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="1.2"
      />
      <path
        d="M-40 180C140 90 250 250 420 190C610 122 700 40 960 150"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <circle cx="360" cy="120" r="3.2" fill="currentColor" />
      <circle cx="360" cy="120" r="8" fill="currentColor" opacity="0.28" />
      <circle cx="760" cy="230" r="2.4" fill="currentColor" />
      <circle cx="760" cy="230" r="6.5" fill="currentColor" opacity="0.25" />
    </svg>
  );
}
