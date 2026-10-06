"use client";

import { useRef, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { educationMore } from "@/lib/content";

export function EducationPanel() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const body = bodyRef.current;
      const icon = iconRef.current;
      if (!body || !icon) return;
      if (prefersReducedMotion()) {
        gsap.set(body, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
        gsap.set(icon, { rotation: open ? 45 : 0 });
        return;
      }
      gsap.to(icon, { rotation: open ? 45 : 0, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      gsap.to(body, {
        height: open ? "auto" : 0,
        autoAlpha: open ? 1 : 0,
        duration: open ? 0.5 : 0.35,
        ease: open ? "power3.out" : "power2.inOut",
        overwrite: "auto",
      });
    },
    { dependencies: [open], scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mt-6">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="group inline-flex h-11 items-center gap-3 rounded-full bg-white/70 pr-1.5 pl-4 text-sm ring-1 ring-line"
      >
        {open ? "Свернуть" : "Подробнее об образовании"}
        <span ref={iconRef} className="grid size-8 place-items-center rounded-full bg-plum text-white">
          <ArrowIcon className="size-3.5" />
        </span>
      </button>
      <div ref={bodyRef} className="overflow-hidden" style={{ height: 0 }} aria-hidden={!open}>
        <div className="space-y-3 pt-4 text-sm leading-relaxed text-muted">
          {educationMore.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
