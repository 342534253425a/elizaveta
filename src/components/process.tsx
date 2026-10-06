import Image from "next/image";
import { Cta } from "@/components/cta";
import { CalendarIcon, IconByName } from "@/components/icons";
import { ProcessCurve } from "@/components/process-curve";
import { Reveal } from "@/components/reveal";
import { Ribbon } from "@/components/ribbon";
import { steps } from "@/lib/content";

const radii = [
  "58% 42% 48% 52% / 46% 54% 46% 54%",
  "46% 54% 42% 58% / 56% 42% 58% 44%",
  "52% 48% 60% 40% / 44% 58% 42% 56%",
  "48% 52% 40% 60% / 58% 40% 54% 46%",
];

export function Process() {
  return (
    <section id="process" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute top-0 right-0 h-[420px] w-[560px] opacity-60" aria-hidden>
        <Image src="/images/silk.jpg" alt="" fill sizes="560px" className="object-cover object-right mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
      </div>
      <Ribbon className="absolute top-16 left-[-8%] w-[420px] opacity-70" />
      <div className="shell relative">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <p className="eyebrow">Как проходит работа</p>
            <h2 className="display mt-4 flex items-start gap-3 text-[clamp(2.6rem,5vw,4.35rem)]">
              <span className="mt-3 size-2 shrink-0 rotate-45 bg-plum/80" />
              <span>
                Простой
                <br /> и понятный процесс
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted">
              Спокойное и безопасное пространство, где вы можете говорить о важном и находить свои решения в удобном для вас темпе.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="display max-w-xs text-[1.7rem] leading-snug lg:ml-auto lg:text-right">
              Весь процесс строится вокруг вашего комфорта, уважения и реальных результатов.
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          <ProcessCurve />
          {steps.map((step, index) => (
            <li key={step.n}>
              <Reveal delay={index * 0.06}>
                <p className="display text-sm tracking-[0.18em] text-plum-soft">{step.n}</p>
                <div
                  className="mt-4 grid size-28 place-items-center bg-white/55 text-plum shadow-soft"
                  style={{ borderRadius: radii[index] }}
                >
                  <IconByName name={step.icon} className="size-7" />
                </div>
                <h3 className="display mt-5 text-[1.7rem]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="soft-card mt-14 flex flex-col gap-5 rounded-[28px] px-4 py-4 md:flex-row md:items-center md:justify-between md:rounded-full md:py-3 md:pr-3 md:pl-3">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-plum">
              <CalendarIcon className="size-5" />
            </span>
            <p className="display text-[1.55rem] leading-none sm:text-[1.75rem]">
              Готовы сделать
              <br /> первый шаг?
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Запишитесь на бесплатную встречу в удобном формате. Я буду рада познакомиться и ответить на ваши вопросы.
          </p>
          <Cta href="/booking?format=intro" className="shrink-0">
            Записаться на консультацию
          </Cta>
        </div>
      </div>
    </section>
  );
}
