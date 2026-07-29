"use client";

import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` on the page as it scrolls into view.
 *
 * Mounted once in the layout. One IntersectionObserver for the whole document
 * rather than one per element, and a MutationObserver so anything added later —
 * the waitlist success state, a dialog — is picked up without re-mounting.
 *
 * ## Why there is a sweep as well as an observer
 *
 * IntersectionObserver samples at frame boundaries. If the viewport moves past
 * an element *between* two frames it never reports an intersection, and the
 * element stays hidden for the rest of the session. That is not hypothetical:
 * it reproduced here on the Bitcoin domains grid, and it is what a real user
 * does whenever they press End, drag the scrollbar, or return to a page the
 * browser restores the scroll position for.
 *
 * So the observer handles ordinary scrolling, and `sweep()` handles everything
 * else by asking a question IO cannot miss: is this element at or above the
 * bottom of the viewport? If so it has been reached, and it is revealed
 * whether or not an intersection was ever reported.
 *
 * The rootMargin is in pixels, deliberately. Percentage values resolve against
 * the intersection root and behave inconsistently once the page height changes
 * underneath them — which happens here as fonts settle and the plaza canvas
 * sizes itself.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0 },
    );

    const pending = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");

    /** `observe` is idempotent per element, so this can run as often as needed. */
    function watch() {
      for (const el of pending()) io.observe(el);
    }

    /** Reveal anything the viewport has already reached, seen or not. */
    function sweep() {
      const limit = window.innerHeight;
      for (const el of pending()) {
        if (el.getBoundingClientRect().top < limit) {
          el.setAttribute("data-revealed", "");
          io.unobserve(el);
        }
      }
    }

    watch();

    const mo = new MutationObserver(() => watch());
    mo.observe(document.body, { childList: true, subtree: true });

    // Scroll and resize are passive and cheap — `pending()` empties as the page
    // reveals, so the sweep costs nothing once everything is shown.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        sweep();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Covers a restored scroll position or a deep link, where the page is
    // already past the fold before any scroll event fires.
    const settle = window.setTimeout(sweep, 400);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(settle);
    };
  }, []);

  return null;
}
