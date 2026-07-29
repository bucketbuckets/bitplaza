import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { PILLARS, PILLARS_SECTION } from "@/content/pillars";

/**
 * Deliberately not numbered. The four pillars are simultaneous, not sequential,
 * and 01/02/03 markers would assert an order that does not exist — they read as
 * decoration precisely because the content does not earn them.
 */
export function Pillars() {
  return (
    <Section id="pillars" tone="surface" ruled>
      <SectionHeader
        eyebrow={PILLARS_SECTION.eyebrow}
        heading={PILLARS_SECTION.heading}
        lead={PILLARS_SECTION.lead}
      />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-edge bg-edge lg:grid-cols-2">
        {PILLARS.map((pillar, i) => (
          <Reveal as="li" key={pillar.id} delay={i * 0.05} className="bg-surface">
            <div className="flex h-full flex-col gap-4 p-7 sm:p-9">
              <h3 className="font-display text-2xl text-ink">{pillar.title}</h3>
              <p className="text-base leading-relaxed text-ink-muted">{pillar.body}</p>
              <p className="mt-auto border-t border-edge pt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {pillar.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
