import { cn } from "@/lib/utils";

/**
 * The single entry point for entrance animation.
 *
 * This is a SERVER component and ships no JavaScript of its own. One observer,
 * mounted once in the layout, drives every reveal on the page.
 *
 * It replaced a Motion `whileInView` implementation, for reasons worth keeping:
 *
 *   · **Correctness.** Two reveals in the Bitcoin section never fired at all,
 *     verified in Chrome — content permanently invisible, which is the worst
 *     failure a decorative animation can produce.
 *   · **The default state was backwards.** `whileInView` commits `opacity: 0`
 *     inline during SSR, so no-JS and pre-hydration reduced-motion both rendered
 *     a blank page. It needed a `<noscript>` override and a `!important` CSS
 *     rule to undo a style the server should never have shipped.
 *   · **Cost.** Every `Reveal` was a client component wrapping its own
 *     `LazyMotion` — 27 of them on this page, for an opacity and a translate.
 *
 * The inversion is the whole idea: **content is visible by default**, and JS
 * opts into hiding it (via `html.js`, set before first paint). Anything that
 * goes wrong afterwards fails toward readable rather than blank.
 *
 * Motion stays a dependency — it is the right tool for the interest selector in
 * Stage 4, where there is real state to animate.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Component = "div",
}: {
  children: React.ReactNode;
  /** Seconds. Keep under 0.3 — a stagger the user waits for is a bug. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  return (
    <Component
      data-reveal=""
      className={cn(className)}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
