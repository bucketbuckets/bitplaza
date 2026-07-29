"use client";

import { m, LazyMotion, domAnimation, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * The single entry point for entrance animation.
 *
 * Every reveal on the site goes through here, which is what makes
 * `prefers-reduced-motion` a one-line guarantee rather than an audit. When
 * motion is reduced the content renders in its final state immediately — not
 * faded slowly, not translated a smaller distance. Reduced means absent.
 *
 * `LazyMotion` with `domAnimation` keeps the shipped bundle to the subset of
 * Motion actually used here; the full `motion` import is roughly three times
 * the size for animations this simple.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  /** Seconds. Keep under 0.3 — a stagger the user waits for is a bug. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduced = useReducedMotion();
  const Component = m[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <Component
        className={className}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </Component>
    </LazyMotion>
  );
}

/**
 * Reveals children in sequence. Index-based delay is capped so a long list
 * never leaves the last item waiting — past ~6 items the stagger stops reading
 * as choreography and starts reading as lag.
 */
export function Stagger({
  children,
  className,
  step = 0.05,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  as?: "div" | "li";
}) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <Reveal key={i} as={as} delay={Math.min(i, 6) * step} className={className}>
              {child}
            </Reveal>
          ))
        : (
            <Reveal as={as} className={cn(className)}>
              {children}
            </Reveal>
          )}
    </>
  );
}
