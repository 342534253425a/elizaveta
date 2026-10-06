"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { afterSmoother } from "@/components/smooth-scroll";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cx } from "@/lib/cx";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (!ref.current || prefersReducedMotion()) return;
      return afterSmoother(contextSafe, () => {
        if (!ref.current) return;
        gsap.fromTo(
          ref.current,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cx("motion-safe:opacity-0", className)}>
      {children}
    </div>
  );
}

export function Entrance({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cx("motion-safe:opacity-0", className)}>
      {children}
    </div>
  );
}

export function KenBurns({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { scale: 1.06, yPercent: 0 },
        { scale: 1.12, yPercent: -2.2, duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

export function useBatchReveal(scope: RefObject<HTMLElement | null>, selector = "[data-reveal]") {
  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;
      return afterSmoother(contextSafe, () => {
        const items = gsap.utils.toArray<HTMLElement>(selector, root);
        if (!items.length) return;
        gsap.set(items, { autoAlpha: 0, y: 18 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out", overwrite: true });
          },
        });
      });
    },
    { scope },
  );
}
