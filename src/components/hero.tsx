"use client";

import Image from "next/image";
import { useRef } from "react";
import { Cta } from "@/components/cta";
import { KenBurns } from "@/components/reveal";
import { Ribbon } from "@/components/ribbon";
import { afterSmoother } from "@/components/smooth-scroll";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/content";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = root.current;
      if (!section || prefersReducedMotion()) return;

      const title = section.querySelector("[data-hero-title]");
      const parts = section.querySelectorAll<HTMLElement>("[data-hero]");
      const media = section.querySelector("[data-hero-media]");
      let split: SplitText | undefined;

      if (title) {
        split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          aria: "auto",
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.05,
              stagger: 0.08,
              ease: "power3.out",
              delay: 0.12,
            });
          },
        });
      }

      gsap.fromTo(
        parts,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1, ease: "power3.out", delay: 0.28 },
      );

      const stopParallax = afterSmoother(contextSafe, () => {
        if (!media) return;
        gsap.to(media, {
          y: -48,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });

      return () => {
        stopParallax?.();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div data-hero-media className="absolute inset-0">
          <KenBurns className="absolute inset-0">
            <Image
              src="/images/hero.jpg"
              alt="Спокойный закат у воды: мягкий свет, цветы и тишина"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[68%_42%]"
            />
          </KenBurns>
        </div>
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #f4eef2 0%, rgba(244,238,242,0.94) 26%, rgba(244,238,242,0.72) 42%, rgba(244,238,242,0.18) 62%, rgba(244,238,242,0) 78%)",
          }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(244,238,242,0.28) 0%, rgba(244,238,242,0.08) 34%, rgba(244,238,242,0.78) 68%, #f4eef2 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>
      <Ribbon className="absolute right-[-8%] top-[18%] hidden w-[min(720px,52vw)] md:block" />
      <div className="shell flex min-h-[100svh] items-end pb-16 pt-32 md:items-center md:pb-24">
        <div className="max-w-xl">
          <p data-hero className="eyebrow motion-safe:opacity-0">
            {site.role}
          </p>
          <h1 data-hero-title className="display mt-5 max-w-[9.2em] text-[clamp(3.15rem,7vw,5.55rem)] leading-[1.08]">
            Место, где можно быть собой
          </h1>
          <p data-hero className="mt-6 max-w-[28rem] text-[17px] leading-relaxed text-muted motion-safe:opacity-0">
            {site.description}
          </p>
          <div data-hero className="mt-8 motion-safe:opacity-0">
            <Cta href="/booking">Записаться на консультацию</Cta>
          </div>
          <p
            data-hero
            className="mt-8 flex items-center gap-4 text-[11px] font-semibold tracking-[0.22em] text-muted uppercase motion-safe:opacity-0"
          >
            <span className="h-px w-10 bg-foreground/20" />
            Больше, чем просто разговор
          </p>
        </div>
      </div>
    </section>
  );
}
