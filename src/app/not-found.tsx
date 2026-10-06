import { Cta } from "@/components/cta";

export default function NotFound() {
  return (
    <main className="shell grid min-h-[70svh] place-items-center py-32 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 text-[clamp(2.8rem,5vw,4.5rem)]">Такой страницы нет</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">Возможно, ссылка устарела. Вернитесь на главную или выберите время для встречи.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Cta href="/">На главную</Cta>
          <Cta href="/booking" variant="ghost">
            Записаться
          </Cta>
        </div>
      </div>
    </main>
  );
}
