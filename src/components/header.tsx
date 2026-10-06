"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Cta } from "@/components/cta";
import { CloseIcon, Logo, MenuIcon } from "@/components/icons";
import { useScrollLock } from "@/components/smooth-scroll";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/lib/content";
import { cx } from "@/lib/cx";

export function Header() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = menuPath === pathname;
  const menuRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);

  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!open || !menu || prefersReducedMotion()) return;
      const items = menu.querySelectorAll("[data-menu-item]");
      gsap.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(items, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.055, ease: "power3.out", delay: 0.06 });
    },
    { dependencies: [open], scope: menuRef },
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const frame = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        К содержанию
      </a>
      <div
        className={cx(
          "transition duration-300",
          scrolled || open ? "border-b border-line bg-background/80 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="shell flex h-[76px] items-center justify-between">
          <Link href="/" aria-label={`${site.name}, на главную`} className="relative z-10">
            <Logo />
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex" aria-label="Основное меню">
            {nav.map((item) => {
              const active = item.href === pathname || (item.href === "/about" && pathname.startsWith("/about"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "text-[13.5px] transition hover:text-foreground",
                    active ? "text-foreground" : "text-foreground/75",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="relative z-10 flex items-center gap-2">
            <div className="hidden sm:block">
              <Cta href="/booking" variant="header">
                Записаться
              </Cta>
            </div>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full bg-white/50 ring-1 ring-line lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMenuPath(open ? null : pathname)}
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>
      {open ? (
        <div ref={menuRef} className="fixed inset-0 z-[70] flex flex-col bg-background px-6 pt-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full bg-white/70 ring-1 ring-line"
              aria-label="Закрыть меню"
              onClick={() => setMenuPath(null)}
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col" aria-label="Мобильное меню">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-menu-item
                className="display border-b border-line/70 py-3 text-[2rem]"
                onClick={() => setMenuPath(null)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div data-menu-item>
            <Cta href="/booking" className="mt-8" onClick={() => setMenuPath(null)}>
              Записаться
            </Cta>
          </div>
        </div>
      ) : null}
    </header>
  );
}
