import type { Metadata } from "next";
import { Cta } from "@/components/cta";
import { EducationPanel } from "@/components/education-panel";
import { IconByName } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Ribbon } from "@/components/ribbon";
import { aboutStats, education, path, values } from "@/lib/content";

export const metadata: Metadata = {
  title: "Обо мне",
  description: "Подход, образование и ценности в работе психолога Елизаветы.",
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden pt-32 pb-20">
      <section className="shell">
        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="eyebrow">Обо мне</p>
            <h1 className="display mt-4 max-w-[10em] text-[clamp(3rem,6vw,5rem)]">Я — практикующий психолог</h1>
            <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted">
              В своей работе я объединяю научный подход и искренний человеческий интерес к людям. Верю, что каждый
              может лучше понимать себя, строить более тёплые отношения и жить в большем контакте со своими ценностями.
            </p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {aboutStats.map((item) => (
              <li key={item.label} className="text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/70 text-plum ring-1 ring-white">
                  <IconByName name={item.icon} className="size-5" />
                </span>
                <p className="display mt-3 text-[1.8rem] leading-none">{item.value}</p>
                <p className="mt-2 text-sm leading-snug text-muted">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell mt-16">
        <div className="soft-card rounded-[32px] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow">Образование и подход</p>
              <p className="mt-4 max-w-xs text-[15.5px] leading-relaxed text-muted">
                Я постоянно учусь и развиваюсь, чтобы быть более полезной своим клиентам.
              </p>
              <EducationPanel />
            </div>
            <ul className="grid gap-6 sm:grid-cols-3">
              {education.map((item) => (
                <li key={item.title}>
                  <span className="grid size-11 place-items-center rounded-full bg-blush text-plum">
                    <IconByName name={item.icon} className="size-5" />
                  </span>
                  <h2 className="display mt-4 text-[1.45rem] leading-tight">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell mt-20">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">Мои ценности в работе</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.3rem)]">Принципы, на которых держится встреча</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Они помогают создавать безопасное пространство и быть рядом в важные моменты.
            </p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {values.map((item) => (
              <li key={item.title} className="rounded-[24px] bg-white/55 p-5 ring-1 ring-white">
                <IconByName name={item.icon} className="size-5 text-plum" />
                <h3 className="display mt-4 text-[1.55rem]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative mt-20">
        <Ribbon className="absolute top-0 right-0 w-[520px] opacity-80" />
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Мой путь</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.5vw,3.8rem)]">Как я пришла к психологии</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              Здесь — короткая история: что привело в профессию, какой опыт повлиял и что для меня важно в этой работе.
            </p>
            <div className="mt-8">
              <Cta href="/booking?format=intro">Познакомиться</Cta>
            </div>
          </Reveal>
          <ol className="relative space-y-8 border-l border-line pl-8">
            {path.map((item) => (
              <li key={item.n} className="relative">
                <span className="absolute top-1 -left-[39px] size-2.5 rounded-full bg-plum" />
                <p className="text-xs font-semibold tracking-[0.16em] text-plum-soft">{item.n}</p>
                <h3 className="display mt-1 text-[1.7rem]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
