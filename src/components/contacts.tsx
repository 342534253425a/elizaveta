import { ArrowIcon, MailIcon, TelegramIcon, WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/content";

const channels = [
  { href: site.telegram, label: "Telegram", value: site.telegramLabel, icon: TelegramIcon, external: true },
  { href: site.whatsapp, label: "WhatsApp", value: site.whatsappLabel, icon: WhatsAppIcon, external: true },
  { href: `mailto:${site.email}`, label: "Email", value: site.email, icon: MailIcon, external: false },
];

export function Contacts() {
  return (
    <section id="contacts" className="relative py-16 md:py-24">
      <div className="shell grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow">Контакты</p>
          <h2 className="display mt-4 max-w-[11em] text-[clamp(2.6rem,5vw,4.2rem)]">
            Остались вопросы или хотите записаться?
          </h2>
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
            Вы можете написать мне любым удобным способом. Я отвечу и мы подберём подходящее время для встречи.
          </p>
        </Reveal>
        <ul className="space-y-3">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-full bg-white/55 px-3 py-3 ring-1 ring-white transition hover:bg-white"
              >
                <span className="grid size-12 place-items-center rounded-full bg-blush text-plum">
                  <channel.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-muted">{channel.label}</span>
                  <span className="block truncate text-[15px]">{channel.value}</span>
                </span>
                <ArrowIcon className="mr-2 size-4 text-plum-soft transition group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
