"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { ClientPortal, useScrollLock } from "@/components/smooth-scroll";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [prevOpen, setPrevOpen] = useState(open);
  const [visible, setVisible] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open || prefersReducedMotion()) setVisible(open);
  }

  useScrollLock(visible);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      if (!visible || !root || !panel) return;
      if (prefersReducedMotion()) return;

      if (!open) {
        const tl = gsap.timeline({ onComplete: () => setVisible(false) });
        tl.to(panel, { autoAlpha: 0, y: 12, duration: 0.22, ease: "power2.in" }, 0);
        tl.to(root, { autoAlpha: 0, duration: 0.26, ease: "power2.in" }, 0);
        return;
      }

      gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(panel, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" });
    },
    { dependencies: [open, visible], scope: rootRef, revertOnUpdate: true },
  );

  if (!visible) return null;

  return (
    <ClientPortal>
    <div ref={rootRef} className="fixed inset-0 z-[80] grid place-items-end px-3 py-3 sm:place-items-center sm:px-6">
      <button type="button" className="absolute inset-0 bg-[#2b2432]/28 backdrop-blur-[3px]" aria-label="Закрыть" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="soft-card relative z-10 max-h-[min(720px,calc(100svh-1.5rem))] w-full max-w-xl overflow-y-auto rounded-[28px] p-6 sm:p-8"
        onKeyDown={(event) => {
          if (event.key !== "Tab" || !panelRef.current) return;
          const items = panelRef.current.querySelectorAll<HTMLElement>("a, button, input, textarea, select");
          const first = items[0];
          const last = items[items.length - 1];
          if (!first || !last) return;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="dialog-title" className="display pr-6 text-[2.15rem] leading-[1.05]">
            {title}
          </h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-blush/80 text-plum"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
        <div className="mt-4 text-[15.5px] leading-relaxed text-muted">{children}</div>
      </div>
    </div>
    </ClientPortal>
  );
}
