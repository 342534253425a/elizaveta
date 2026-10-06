"use client";

import { useEffect, useState } from "react";
import { ClientPortal } from "@/components/smooth-scroll";
import { rail } from "@/lib/content";
import { cx } from "@/lib/cx";

export function ScrollRail() {
  const [active, setActive] = useState<string>(rail[0].id);

  useEffect(() => {
    const nodes = rail
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <ClientPortal>
    <nav className="fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 xl:block" aria-label="Разделы страницы">
      <ol className="relative space-y-5 border-l border-line pl-5">
        {rail.map((item, index) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "true" : undefined}
                className={cx(
                  "relative block text-[11px] font-semibold tracking-[0.16em] uppercase transition",
                  current ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                <span
                  className={cx(
                    "absolute top-1 -left-[25px] size-2 rounded-full transition",
                    current ? "bg-plum" : "bg-white ring-1 ring-plum/30",
                  )}
                />
                <span className="display mr-2 text-sm tracking-normal">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
    </ClientPortal>
  );
}
