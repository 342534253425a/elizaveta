import Image from "next/image";
import { Cta } from "@/components/cta";
import { IconByName } from "@/components/icons";
import { KenBurns, Reveal } from "@/components/reveal";
import { homeStats, quote } from "@/lib/content";

export function AboutPreview() {
  return (
    <section id="about" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute -top-16 right-[-10%] h-[480px] w-[640px]" aria-hidden>
        <Image src="/images/silk.jpg" alt="" fill sizes="640px" className="object-cover opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 68% 42%, transparent 0%, #f4eef2 68%)" }} />
      </div>
      <div className="shell relative grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
            <div className="absolute -inset-8 -z-10 rounded-full bg-white/50 blur-3xl" />
            <div
              className="relative h-full overflow-hidden shadow-soft"
              style={{ borderRadius: "58% 42% 46% 54% / 48% 56% 44% 52%" }}
            >
              <KenBurns className="absolute inset-0">
                <Image
                  src="/images/portrait.jpg"
                  alt="Елизавета в мягком свете у окна"
                  fill
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className="object-cover object-[46%_32%]"
                />
              </KenBurns>
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">Обо мне</p>
            <h2 className="display mt-4 max-w-[12em] text-[clamp(2.5rem,4.6vw,4.15rem)]">
              Я — психолог, и для меня важно создавать безопасное пространство
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted">
              В своей работе я объединяю научный подход и искренний человеческий интерес к людям. Верю, что каждый
              может лучше понимать себя, строить более тёплые отношения и жить в большем контакте со своими ценностями.
            </p>
            <div className="mt-7">
              <Cta href="/about">Подробнее обо мне</Cta>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
              {homeStats.map((item, index) => (
                <li
                  key={item.label}
                  className={index === 0 ? "" : "sm:border-l sm:border-line sm:pl-4"}
                >
                  <IconByName name={item.icon} className="size-5 text-plum-soft" />
                  <p className="display mt-3 text-[1.85rem] leading-none">{item.value}</p>
                  <p className="mt-2 text-sm leading-snug text-muted">{item.label}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.16}>
            <blockquote className="mt-10 max-w-lg">
              <p className="display text-[1.65rem] leading-snug font-medium italic text-foreground/90">
                <span className="mr-1 text-plum-soft">“</span>
                {quote}
              </p>
            </blockquote>
            <p className="mt-10 flex items-center gap-4 text-[11px] font-semibold tracking-[0.24em] text-muted uppercase">
              Спокойнее, ближе к себе
              <span className="h-px w-14 bg-line" />
              02 / 04
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
