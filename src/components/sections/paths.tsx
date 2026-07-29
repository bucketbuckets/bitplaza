"use client";

import { useState } from "react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { FEATURED_PATHS, MORE_PATHS, PATHS_SECTION } from "@/content/paths";

/**
 * The product distinction. Three paths lead with their outcomes fully
 * visible — a path's outcome is the argument, so nothing hides behind an
 * interaction. The remaining paths sit behind one restrained disclosure.
 */
export function Paths() {
  const [expanded, setExpanded] = useState(false);
  const paths = expanded ? [...FEATURED_PATHS, ...MORE_PATHS] : FEATURED_PATHS;

  return (
    <Section id="paths" tone="surface" ruled>
      <div className="flex flex-col gap-4">
        <p className="eyebrow text-apricot-ink">{PATHS_SECTION.eyebrow}</p>
        <h2 className="font-display text-display-2 text-ink">
          {PATHS_SECTION.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="measure-wide text-lg leading-relaxed text-ink-muted">
          {PATHS_SECTION.lead}
        </p>
      </div>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path, i) => (
          <Reveal
            as="li"
            key={path.id}
            delay={Math.min(i % 3, 2) * 0.05}
            className="flex flex-col gap-2 bg-paper p-6"
          >
            <h3 className="font-display text-lg text-ink">{path.name}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{path.outcome}</p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-8">
        <Button
          type="button"
          variant="secondary"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? PATHS_SECTION.lessLabel : PATHS_SECTION.moreLabel}
        </Button>
      </div>
    </Section>
  );
}
