import Image from "next/image";
import Link from "next/link";
import { Logo, MailIcon, TelegramIcon, WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/content";

const socials = [
  { href: site.telegram, label: "Telegram", icon: TelegramIcon },
  { href: site.whatsapp, label: "WhatsApp", icon: WhatsAppIcon },
  { href: `mailto:${site.email}`, label: "Email", icon: MailIcon },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 bottom-0 h-[460px] w-[min(720px,90vw)]" aria-hidden>
        <Image
          src="/images/botanical.jpg"
          alt=""
          fill
          sizes="720px"
          className="object-cover object-[20%_70%] opacity-80 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background" />
      </div>
      <div className="shell relative pb-8 pt-6">
        <p className="script text-[clamp(2.15rem,4vw,3.25rem)] leading-[1.12] text-plum">
          <span className="block">Психология — это путь</span>
          <span className="block">к более спокойной</span>
          <span className="block">и осознанной жизни</span>
        </p>
        <div className="mt-16 flex flex-col gap-6 border-t border-line/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label={`${site.name}, на главную`}>
            <Logo className="size-8" />
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-muted">
            © {new Date().getFullYear()}. Психолог {site.name}.
            <br />
            Все права защищены.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={item.label}
                className="grid size-10 place-items-center rounded-full text-plum-soft transition hover:bg-white hover:text-plum"
              >
                <item.icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
