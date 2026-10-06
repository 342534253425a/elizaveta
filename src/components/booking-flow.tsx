"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Cta } from "@/components/cta";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { Entrance } from "@/components/reveal";
import { ClientPortal } from "@/components/smooth-scroll";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { formatById, formats, site, topicById, type FormatId } from "@/lib/content";
import { cx } from "@/lib/cx";
import { formatLongDate, formatMonthTitle, formatPrice } from "@/lib/format";
import { notifyBooking, type MailResult } from "@/lib/notify";
import { detailsSchema, type DetailsInput } from "@/lib/schema";
import {
  WEEKDAYS,
  addMonthsISO,
  buildCalendar,
  isSlotBookable,
  monthParts,
  moscowDateISO,
  slotKey,
} from "@/lib/schedule";

const steps = ["Формат", "Время", "О вас"] as const;
const timeGroups = [
  { label: "Утро", times: ["09:00", "10:00", "11:00", "12:00"] },
  { label: "День", times: ["13:00", "14:00", "15:00", "16:00"] },
  { label: "Вечер", times: ["17:00", "18:00", "19:00", "20:00"] },
];

type DoneBooking = {
  id: string;
  date: string;
  time: string;
  formatId: string;
};

export function BookingFlow({
  initialFormat,
  initialTopic,
}: {
  initialFormat?: string;
  initialTopic?: string;
}) {
  const topic = topicById(initialTopic);
  const topicLabel = topic ? topic.title.join(" ") : initialTopic === "other" ? "Свой запрос" : null;
  const [step, setStep] = useState(0);
  const [formatId, setFormatId] = useState<FormatId | null>(formatById(initialFormat)?.id ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [cursor, setCursor] = useState(() => monthParts());
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [hint, setHint] = useState("");
  const [pending, setPending] = useState(false);
  const [mail, setMail] = useState<MailResult | null>(null);
  const [done, setDone] = useState<DoneBooking | null>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const form = useForm<DetailsInput>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: "", email: "", contact: "", message: "", consent: false },
    mode: "onTouched",
  });

  async function loadSlots() {
    setLoadingSlots(true);
    try {
      const response = await fetch("/api/bookings", { cache: "no-store" });
      const data = (await response.json()) as { taken: Array<{ date: string; time: string }> };
      setTaken(new Set(data.taken.map((slot) => slotKey(slot.date, slot.time))));
    } catch {
      setHint("Не удалось сверить занятые окна. Если время окажется занято, я попрошу выбрать другое.");
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadSlots();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selected = formatById(formatId ?? undefined);
  const today = moscowDateISO();
  const maxDate = addMonthsISO(today, 4);
  const cells = useMemo(() => buildCalendar(cursor.year, cursor.monthIndex), [cursor]);
  const minMonth = monthParts(today);
  const maxMonth = monthParts(maxDate);
  const canPrev = cursor.year > minMonth.year || (cursor.year === minMonth.year && cursor.monthIndex > minMonth.monthIndex);
  const canNext = cursor.year < maxMonth.year || (cursor.year === maxMonth.year && cursor.monthIndex < maxMonth.monthIndex);

  function shiftMonth(delta: number) {
    setCursor((current) => {
      const next = new Date(current.year, current.monthIndex + delta, 1);
      return { year: next.getFullYear(), monthIndex: next.getMonth() };
    });
  }

  function chooseDate(iso: string) {
    setDate(iso);
    setTime(null);
    setHint("");
  }

  function goNext() {
    if (step === 0 && !selected) {
      setHint("Выберите формат — можно начать с бесплатного знакомства.");
      return;
    }
    if (step === 1 && (!date || !time)) {
      setHint("Выберите день и свободный час.");
      return;
    }
    setHint("");
    setStep((value) => Math.min(value + 1, 2));
  }

  async function onSubmit(values: DetailsInput) {
    if (!selected || !date || !time) {
      setStep(date ? 1 : 0);
      return;
    }
    setPending(true);
    setHint("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          formatId: selected.id,
          date,
          time,
          topicId: initialTopic || undefined,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        mail?: MailResult;
        booking?: DoneBooking;
      };
      if (!response.ok || !data.ok || !data.booking) {
        setHint(data.message ?? "Не получилось отправить заявку. Попробуйте ещё раз.");
        if (response.status === 409) {
          setTime(null);
          setStep(1);
          await loadSlots();
        }
        return;
      }
      let mailResult = data.mail ?? "failed";
      if (mailResult !== "sent") {
        mailResult = await notifyBooking({
          ...values,
          formatId: selected.id,
          date,
          time,
          topicId: initialTopic || undefined,
          id: data.booking.id,
          createdAt: new Date().toISOString(),
        });
      }
      setMail(mailResult);
      setDone(data.booking);
    } catch {
      setHint("Связь прервалась. Напишите мне в Telegram или попробуйте ещё раз.");
    } finally {
      setPending(false);
    }
  }

  useGSAP(
    () => {
      if (!stepRef.current || prefersReducedMotion()) return;
      gsap.fromTo(
        stepRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "transform" },
      );
    },
    { dependencies: [step, done], scope: stepRef, revertOnUpdate: true },
  );

  if (done && selected) {
    return (
      <section className="shell flex min-h-[calc(100svh-4.5rem)] flex-col justify-center pb-28 pt-28">
        <Entrance className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-plum text-white">
            <CheckIcon className="size-6" />
          </span>
          <p className="eyebrow mt-8">Заявка принята</p>
          <h1 className="display mt-4 text-[clamp(2.8rem,5vw,4.4rem)]">Я получила ваш запрос</h1>
          <p className="mt-5 text-lg text-muted">
            {formatLongDate(done.date)}, {done.time}. {selected.title.toLowerCase()}
            {selected.price === 0 ? ", бесплатно" : `, ${formatPrice(selected.price)}`}.
          </p>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
            Это ещё не финальное подтверждение. Я напишу вам, чтобы закрепить время и прислать детали встречи.
          </p>
          {mail === "activation" ? (
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-plum">
              Письмо с заявкой пока не дошло: почту {site.email} нужно один раз подтвердить. Откройте письмо
              FormSubmit с кнопкой Activate Form — оно может лежать в спаме. После этого уведомления начнут
              приходить.
            </p>
          ) : null}
          {mail === "failed" ? (
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-plum">
              Заявка сохранилась, но письмо на почту не отправилось. Напишите в Telegram, чтобы я точно её увидела.
            </p>
          ) : null}
          {mail === "sent" ? (
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
              Уведомление отправлено на {site.email}.
            </p>
          ) : null}
          <p className="mt-6 text-xs tracking-[0.18em] text-plum-soft uppercase">Номер заявки {done.id}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Cta href="/">На главную</Cta>
            <Cta href={site.telegram} variant="ghost">
              Написать в Telegram
            </Cta>
          </div>
        </Entrance>
      </section>
    );
  }

  return (
    <section className="shell min-h-[calc(100svh-4.5rem)] pb-40 pt-32">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Консультация</p>
        <h1 className="display mt-4 text-[clamp(2.7rem,5vw,4.5rem)]">
          {step === 0 ? "Выберите формат" : step === 1 ? "Выберите день и время" : "Расскажите немного о себе"}
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
          {step === 0
            ? "Спокойно, без спешки. Можно начать с короткого бесплатного знакомства."
            : step === 1
              ? "Календарь показывает только свободные часы. Время московское."
              : "Этого достаточно, чтобы я поняла запрос и ответила вам лично."}
        </p>
        {topicLabel ? (
          <p className="mt-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm text-plum">Тема: {topicLabel}</p>
        ) : null}

        <ol className="mt-8 flex items-center gap-3 text-sm">
          {steps.map((label, index) => (
            <li key={label} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (index < step) setStep(index);
                }}
                className={cx("transition", index === step ? "text-foreground" : "text-muted", index < step && "hover:text-foreground")}
                disabled={index > step}
              >
                <span className="mr-2 text-xs tracking-[0.16em]">{String(index + 1).padStart(2, "0")}</span>
                {label}
              </button>
              {index < steps.length - 1 ? <span className="hidden h-px w-8 bg-line sm:block" /> : null}
            </li>
          ))}
        </ol>
      </div>

      <form id="booking-form" className="mx-auto mt-10 max-w-3xl" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div ref={stepRef}>
            {step === 0 ? (
              <ul className="divide-y divide-line/80">
                {formats.map((item) => {
                  const active = item.id === formatId;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setFormatId(item.id);
                          setHint("");
                        }}
                        aria-pressed={active}
                        className={cx(
                          "flex w-full flex-col gap-2 rounded-3xl px-4 py-5 text-left transition sm:flex-row sm:items-center sm:gap-6 sm:px-5",
                          active ? "bg-white/80 shadow-soft" : "hover:bg-white/40",
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="display block text-[1.7rem] leading-none">{item.title}</span>
                          <span className="mt-2 block text-sm leading-relaxed text-muted">{item.description}</span>
                        </span>
                        <span className="shrink-0 sm:text-right">
                          <span className="display block text-[1.45rem]">{formatPrice(item.price)}</span>
                          <span className="mt-1 block text-sm text-muted">{item.duration}</span>
                          {"note" in item && item.note ? <span className="mt-1 block text-xs text-plum-soft">{item.note}</span> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {step === 1 ? (
              <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="display text-[2rem]">{formatMonthTitle(cursor.year, cursor.monthIndex)}</h2>
                    <div className="flex gap-1">
                      <button type="button" aria-label="Предыдущий месяц" disabled={!canPrev} onClick={() => shiftMonth(-1)} className="grid size-10 place-items-center rounded-full text-plum disabled:opacity-30">
                        <ChevronIcon direction="left" className="size-5" />
                      </button>
                      <button type="button" aria-label="Следующий месяц" disabled={!canNext} onClick={() => shiftMonth(1)} className="grid size-10 place-items-center rounded-full text-plum disabled:opacity-30">
                        <ChevronIcon direction="right" className="size-5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted">Московское время</p>
                  <div className="mt-6 grid grid-cols-7 gap-y-1 text-center">
                    {WEEKDAYS.map((day) => (
                      <div key={day} className="pb-2 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                        {day}
                      </div>
                    ))}
                    {cells.map((cell) => {
                      const disabled = !cell.inMonth || cell.iso < today || cell.iso > maxDate;
                      const selectedDay = cell.iso === date;
                      const isToday = cell.iso === today;
                      return (
                        <div key={cell.iso}>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => chooseDate(cell.iso)}
                            className={cx(
                              "mx-auto grid size-10 place-items-center rounded-full text-sm transition",
                              selectedDay && "bg-plum text-white",
                              !selectedDay && isToday && "ring-1 ring-plum/40",
                              !selectedDay && !disabled && "hover:bg-white",
                              disabled && "text-foreground/25",
                            )}
                          >
                            {cell.day}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  {date ? (
                    <>
                      <h2 className="display text-[2rem] leading-none">{formatLongDate(date)}</h2>
                      <p className="mt-2 text-sm text-muted">{loadingSlots ? "Сверяю свободные часы…" : "Выберите удобный час"}</p>
                      <div className="mt-6 space-y-5">
                        {timeGroups.map((group) => (
                          <div key={group.label}>
                            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">{group.label}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {group.times.map((slot) => {
                                const busy = taken.has(slotKey(date, slot)) || !isSlotBookable(date, slot);
                                const active = time === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={busy || loadingSlots}
                                    onClick={() => {
                                      setTime(slot);
                                      setHint("");
                                    }}
                                    className={cx(
                                      "h-10 rounded-full px-4 text-sm transition",
                                      active ? "bg-plum text-white" : "bg-white/50 text-foreground hover:bg-white",
                                      (busy || loadingSlots) && "text-foreground/30 line-through decoration-foreground/20 hover:bg-transparent",
                                    )}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="script text-4xl text-plum/80">Сначала выберите день — и я покажу свободные часы.</p>
                  )}
                </div>
              </div>
            ) : null}

            {step === 2 && selected && date && time ? (
              <div className="grid items-start gap-12 md:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <Field label="Имя" error={form.formState.errors.name?.message}>
                    <input className="field" autoComplete="name" placeholder="Как к вам обращаться" {...form.register("name")} />
                  </Field>
                  <Field label="Email" error={form.formState.errors.email?.message}>
                    <input className="field" type="email" autoComplete="email" placeholder="example@mail.com" {...form.register("email")} />
                  </Field>
                  <Field label="Телефон или мессенджер" error={form.formState.errors.contact?.message}>
                    <input className="field" autoComplete="tel" placeholder="Telegram, WhatsApp или номер" {...form.register("contact")} />
                  </Field>
                  <Field label="Коротко о запросе" error={form.formState.errors.message?.message}>
                    <textarea
                      className="field min-h-28 resize-y"
                      placeholder={topicLabel ? `Можно начать с темы «${topicLabel}»` : "С чем хотите поработать? Можно в свободной форме."}
                      {...form.register("message")}
                    />
                  </Field>
                  <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <input type="checkbox" className="mt-1 size-4 accent-plum" {...form.register("consent")} />
                    <span>
                      Я согласен(на) с{" "}
                      <Link href="/privacy" target="_blank" className="text-foreground underline decoration-line underline-offset-4">
                        политикой конфиденциальности
                      </Link>
                    </span>
                  </label>
                  {form.formState.errors.consent ? <p className="text-sm text-rose">{form.formState.errors.consent.message}</p> : null}
                </div>
                <aside className="border-l border-line pl-6">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Ваша встреча</p>
                  <p className="display mt-3 text-[2rem] leading-none">{selected.title}</p>
                  <p className="mt-4 text-muted">{formatLongDate(date)}</p>
                  <p className="text-muted">{time} · {selected.duration}</p>
                  <p className="display mt-5 text-[1.8rem]">{formatPrice(selected.price)}</p>
                  {"note" in selected && selected.note ? <p className="mt-1 text-sm text-plum-soft">{selected.note}</p> : null}
                </aside>
              </div>
            ) : null}
        </div>

        {hint ? (
          <p className="mx-auto mt-6 max-w-3xl text-sm text-rose" role="status">
            {hint}
          </p>
        ) : null}

        <ClientPortal>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-white/80 bg-white/75 px-2 py-2 shadow-float backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setHint("");
                setStep((value) => Math.max(0, value - 1));
              }}
              className={cx("rounded-full px-4 py-2 text-sm text-muted", step === 0 && "invisible")}
            >
              Назад
            </button>
            <p className="hidden min-w-0 truncate text-sm text-muted sm:block">
              {selected ? `${selected.title} · ${formatPrice(selected.price)}` : "Формат не выбран"}
              {date && time ? ` · ${time}` : ""}
            </p>
            {step < 2 ? (
              <button type="button" onClick={goNext} className="rounded-full bg-plum px-5 py-2.5 text-sm text-white">
                Дальше
              </button>
            ) : (
              <button type="submit" form="booking-form" disabled={pending} className="rounded-full bg-plum px-5 py-2.5 text-sm text-white disabled:opacity-50">
                {pending ? "Отправляю…" : "Записаться"}
              </button>
            )}
          </div>
        </div>
        </ClientPortal>
      </form>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-rose">{error}</span> : null}
    </label>
  );
}
