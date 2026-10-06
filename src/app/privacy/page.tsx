import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Конфиденциальность",
  description: "Какие данные нужны для записи и как они используются.",
};

export default function PrivacyPage() {
  return (
    <main className="shell max-w-3xl pb-24 pt-36">
      <p className="eyebrow">Конфиденциальность</p>
      <h1 className="display mt-4 text-[clamp(2.7rem,5vw,4.4rem)]">Как я берегу ваши слова</h1>
      <div className="mt-8 space-y-5 text-[16.5px] leading-relaxed text-muted">
        <p>
          Для записи мне нужны имя, способ связи, почта, выбранные дата и формат, а также короткое описание запроса.
          Этого достаточно, чтобы ответить вам и не поставить двух людей на одно время.
        </p>
        <p>
          Я не передаю эти сведения для рекламы и не публикую содержание переписки. Всё, что вы напишете в заявке и на
          встрече, остаётся между нами.
        </p>
        <p>
          Заявка хранится, чтобы окно в календаре оставалось занятым, пока мы не подтвердим или не перенесём встречу.
          Если захотите удалить данные, напишите на {site.email} — я уберу заявку.
        </p>
      </div>
    </main>
  );
}
