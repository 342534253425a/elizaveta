"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Cta } from "@/components/cta";
import { Dialog } from "@/components/dialog";
import { ArrowIcon, ChatIcon } from "@/components/icons";
import { Reveal, useBatchReveal } from "@/components/reveal";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Ribbon } from "@/components/ribbon";
import { topicById, topics, type TopicId } from "@/lib/content";

export function Topics() {
  const [active, setActive] = useState<TopicId | null>(null);
  const topic = topicById(active ?? undefined);
  const listRef = useRef<HTMLDivElement>(null);
  useBatchReveal(listRef, "[data-topic]");

  return (
    <section id="topics" className="relative overflow-hidden py-8 md:py-16">
      <Ribbon className="absolute top-0 right-[-6%] w-[min(640px,70vw)] opacity-80" />
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-80 opacity-70" aria-hidden>
        <Image src="/images/botanical.jpg" alt="" fill sizes="320px" className="object-cover object-right-top mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
      </div>
      <div className="shell relative">
        <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="eyebrow">С чем я работаю</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.35rem)]">
              Темы, с которыми
              <br /> ко мне обращаются
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
              Ниже — основные направления моей работы. Это не полный список, и ваш запрос может быть другим.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="max-w-sm lg:ml-auto lg:text-right">
              <p className="display text-[1.7rem] leading-tight">Каждая ситуация уникальна</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Если вы не нашли здесь свой запрос, вы всё равно можете написать мне и обсудить его.
              </p>
            </div>
          </Reveal>
        </div>

        <div ref={listRef} className="scroller mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 xl:grid xl:grid-cols-6 xl:overflow-visible">
          {topics.map((item) => (
            <article key={item.id} data-topic className="w-[72vw] shrink-0 snap-start motion-safe:opacity-0 sm:w-[250px] xl:w-auto">
              <TopicPhoto radius={item.radius} src={item.image} position={item.position} />
              <h3 className="display mt-4 text-[1.45rem] leading-[1.12]">
                {item.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h3>
              <p className="mt-2 min-h-12 text-[13.5px] leading-relaxed text-muted">{item.teaser}</p>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                aria-label={`Подробнее: ${item.title.join(" ")}`}
                className="mt-4 grid size-9 place-items-center rounded-full bg-white/70 text-plum ring-1 ring-line transition hover:bg-plum hover:text-white"
              >
                <ArrowIcon className="size-4" />
              </button>
            </article>
          ))}
        </div>

        <div className="soft-card mt-8 flex flex-col gap-5 rounded-[28px] px-4 py-4 md:flex-row md:items-center md:justify-between md:rounded-full md:py-3 md:pr-3 md:pl-3">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-plum">
              <ChatIcon className="size-5" />
            </span>
            <p className="display text-[1.55rem] leading-none sm:text-[1.7rem]">
              Что делать, если
              <br /> я не нашла свою тему?
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Вы можете написать мне и коротко описать свой запрос. Я бесплатно подскажу, подойдёт ли вам мой формат работы.
          </p>
          <Cta href="/booking?topic=other&format=intro" className="shrink-0">
            Написать мне
          </Cta>
        </div>
      </div>

      <Dialog open={Boolean(topic)} title={topic ? topic.title.join(" ") : ""} onClose={() => setActive(null)}>
        {topic ? (
          <>
            <div className="relative mb-5 h-40 overflow-hidden" style={{ borderRadius: topic.radius }}>
              <Image src={topic.image} alt="" fill sizes="480px" className="object-cover" style={{ objectPosition: topic.position }} />
            </div>
            <p>{topic.text}</p>
            <div className="mt-6">
              <Cta href={`/booking?topic=${topic.id}`}>Обсудить эту тему</Cta>
            </div>
          </>
        ) : null}
      </Dialog>
    </section>
  );
}

function TopicPhoto({ radius, src, position }: { radius: string; src: string; position: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const photo = ref.current;
      if (!photo || !contextSafe) return;
      const grow = contextSafe(() => {
        if (prefersReducedMotion()) return;
        gsap.to(photo, { scale: 1.06, duration: 0.8, ease: "power3.out" });
      });
      const shrink = contextSafe(() => {
        gsap.to(photo, { scale: 1, duration: 0.7, ease: "power3.out" });
      });
      photo.addEventListener("mouseenter", grow);
      photo.addEventListener("mouseleave", shrink);
      return () => {
        photo.removeEventListener("mouseenter", grow);
        photo.removeEventListener("mouseleave", shrink);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative mx-auto aspect-[1.15/1] w-full max-w-[230px] overflow-hidden" style={{ borderRadius: radius }}>
      <Image src={src} alt="" fill sizes="230px" className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
