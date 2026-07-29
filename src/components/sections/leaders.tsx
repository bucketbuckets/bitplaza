"use client";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { LEADERS_SECTION } from "@/content/leaders";
import { capture } from "@/lib/analytics/client";

/**
 * The community-leader conversion section. Four operational benefits, one
 * action, and a note that communicates focus rather than scarcity.
 */
export function Leaders() {
  return (
    <Section id="leaders" ruled>
      <div className="flex flex-col gap-4">
        <p className="eyebrow text-apricot-ink">{LEADERS_SECTION.eyebrow}</p>
        <h2 className="font-display text-display-2 text-ink">
          {LEADERS_SECTION.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="measure-wide text-lg leading-relaxed text-ink-muted">
          {LEADERS_SECTION.lead}
        </p>
      </div>

      <ul className="mt-12 grid gap-x-16 sm:grid-cols-2">
        {LEADERS_SECTION.benefits.map((benefit, i) => (
          <Reveal
            as="li"
            key={benefit.id}
            delay={Math.min(i, 3) * 0.05}
            className="flex flex-col gap-2 border-t border-edge py-7"
          >
            <h3 className="text-lg font-semibold text-ink">{benefit.title}</h3>
            <p className="measure text-sm leading-relaxed text-ink-muted">{benefit.body}</p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-start gap-4">
        <Button asChild size="lg">
          <a
            href={LEADERS_SECTION.cta.href}
            onClick={() => capture("leader_cta_clicked", { location: "section" })}
          >
            {LEADERS_SECTION.cta.label}
          </a>
        </Button>
        <p className="measure text-sm text-ink-faint">{LEADERS_SECTION.note}</p>
      </div>
    </Section>
  );
}
