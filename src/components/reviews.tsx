"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ChevronIcon, PersonIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { featuredQuote, reviewFilters, reviews, type ReviewFilter } from "@/lib/content";
import { cx } from "@/lib/cx";

export function Reviews() {
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const scroller = useRef<HTMLDivElement>(null);
  const previousFilter = useRef(filter);
  const visible = useMemo(
    () => (filter === "all" ? reviews : reviews.filter((review) => review.category === filter)),
    [filter],
  );

  useGSAP(
    () => {
      if (!scroller.current || previousFilter.current === filter) return;
      previousFilter.current = filter;
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        scroller.current.querySelectorAll("article"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" },
      );
    },
    { dependencies: [filter], scope: scroller, revertOnUpdate: true },
  );

  function slide(direction: number) {
    const root = scroller.current;
    const card = root?.querySelector("article");
    if (!root || !card) return;
    root.scrollBy({ left: direction * (card.clientWidth + 16), behavior: "smooth" });
  }

  return (
    <section id="reviews" className="relative overflow-hidden py-16 md:py-24">
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">Отзывы</p>
            <h2 className="display mt-4 text-[clamp(2.7rem,5vw,4.4rem)]">
              Истории
              <br /> моих клиентов
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
              Здесь собраны отзывы людей, с которыми мы уже работали. Эти истории — про доверие, поддержку и важные изменения.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <figure
              className="relative overflow-hidden px-8 py-10 sm:px-12"
              style={{ borderRadius: "46% 54% 48% 52% / 42% 48% 52% 58%" }}
            >
              <Image src="/images/botanical.jpg" alt="" fill sizes="640px" className="object-cover object-[70%_40%] opacity-70" />
              <div className="absolute inset-0 bg-white/72" />
              <blockquote className="display relative text-[1.55rem] leading-snug italic sm:text-[1.8rem]">
                <span className="mb-2 block text-3xl text-plum-soft not-italic">“</span>
                {featuredQuote}
              </blockquote>
            </figure>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Фильтр отзывов">
            {reviewFilters.map((item) => {
              const selected = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setFilter(item.id);
                    scroller.current?.scrollTo({ left: 0, behavior: "smooth" });
                  }}
                  className={cx(
                    "shrink-0 rounded-full px-4 py-2 text-sm transition",
                    selected ? "bg-plum text-white" : "bg-white/55 text-foreground ring-1 ring-line hover:bg-white",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 self-end">
            <button type="button" aria-label="Предыдущие отзывы" onClick={() => slide(-1)} className="grid size-11 place-items-center rounded-full bg-white/70 text-plum ring-1 ring-line">
              <ChevronIcon direction="left" className="size-5" />
            </button>
            <button type="button" aria-label="Следующие отзывы" onClick={() => slide(1)} className="grid size-11 place-items-center rounded-full bg-white/70 text-plum ring-1 ring-line">
              <ChevronIcon direction="right" className="size-5" />
            </button>
          </div>
        </div>

        <div ref={scroller} className="scroller mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {visible.map((review) => (
            <article key={review.id} className="soft-card w-[86vw] shrink-0 snap-start rounded-[26px] p-6 sm:w-[360px] lg:w-[calc((100%-2rem)/3)]">
              <div className="flex items-start justify-between gap-4">
                <span className="display text-4xl leading-none text-plum-soft">“</span>
                <p className="pt-2 text-right text-xs text-muted">{review.label}</p>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{review.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-blush text-plum">
                  <PersonIcon className="size-5" />
                </span>
                <p className="text-sm">
                  <span className="block font-medium">{review.name}</span>
                  <span className="text-muted">{review.meta}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
