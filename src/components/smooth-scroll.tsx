"use client";

import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { prefersReducedMotion, ScrollSmoother, ScrollTrigger, useGSAP } from "@/lib/gsap";

const SMOOTHER_READY = "elizaveta-smoother-ready";

function subscribe() {
  return () => {};
}

export function ClientPortal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!locked || !smoother) return;
    smoother.paused(true);
    return () => {
      ScrollSmoother.get()?.paused(false);
    };
  }, [locked]);
}

type ContextSafe = <T extends (...args: never[]) => unknown>(func: T) => T;

export function afterSmoother(contextSafe: ContextSafe | undefined, setup: () => void | (() => void)) {
  if (!contextSafe) return;
  const boot = contextSafe(setup);
  if (ScrollSmoother.get() || prefersReducedMotion()) {
    boot();
    return;
  }
  window.addEventListener(SMOOTHER_READY, boot);
  return () => window.removeEventListener(SMOOTHER_READY, boot);
}

function samePageHash(anchor: HTMLAnchorElement) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return null;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || !url.hash) return null;
  if (url.pathname !== window.location.pathname) return null;
  const target = document.querySelector(url.hash);
  return target instanceof HTMLElement ? { target, url } : null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useGSAP(() => {
    if (prefersReducedMotion()) {
      window.dispatchEvent(new Event(SMOOTHER_READY));
      return;
    }

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.9,
      smoothTouch: false,
      effects: false,
      ignoreMobileResize: true,
    });
    window.dispatchEvent(new Event(SMOOTHER_READY));

    const onClick = (event: Event) => {
      if (!(event instanceof MouseEvent) || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const match = samePageHash(anchor);
      const current = ScrollSmoother.get();
      if (!match || !current) return;
      event.preventDefault();
      window.history.pushState(null, "", `${match.url.pathname}${match.url.search}${match.url.hash}`);
      current.scrollTo(match.target, true, "top 96px");
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      smoother.kill();
    };
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const smoother = ScrollSmoother.get();
      const hash = window.location.hash;
      const target = hash ? document.querySelector(hash) : null;
      if (smoother) {
        if (target instanceof HTMLElement) smoother.scrollTo(target, false, "top 96px");
        else smoother.scrollTo(0, false);
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
