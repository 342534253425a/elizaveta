"use client";

import { useRef } from "react";
import { afterSmoother } from "@/components/smooth-scroll";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

export function ProcessCurve() {
  const ref = useRef<SVGPathElement>(null);

  useGSAP((_context, contextSafe) => {
    if (prefersReducedMotion()) return;
    return afterSmoother(contextSafe, () => {
      const path = ref.current;
      if (!path) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1280px)", () => {
        const length = path.getTotalLength();
        if (!length) return;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: path,
            start: "top 85%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    });
  });

  return (
    <svg className="pointer-events-none absolute top-16 right-0 left-0 hidden h-16 w-full xl:block" viewBox="0 0 1000 80" fill="none" aria-hidden>
      <path ref={ref} d="M40 48C180 10 280 70 420 36C560 4 680 64 820 28C900 10 950 24 980 20" stroke="currentColor" className="text-white" strokeWidth="1.4" />
    </svg>
  );
}
