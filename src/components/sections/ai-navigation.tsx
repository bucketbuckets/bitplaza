import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { AI_SECTION } from "@/content/ai";

/**
 * AI as navigation, not spectacle. Three constrained functions and the
 * operating principle, stated once, at weight. Server component: nothing here
 * needs state.
 */
export function AiNavigation() {
  return (
    <Section id="ai" tone="surface" ruled>
      <SectionHeader
        eyebrow={AI_SECTION.eyebrow}
        heading={AI_SECTION.heading}
        lead={AI_SECTION.lead}
      />

      <ul className="mt-12 grid gap-px overflow-hidden rounded-card border border-edge bg-edge lg:grid-cols-3">
        {AI_SECTION.functions.map((fn, i) => (
          <Reveal
            as="li"
            key={fn.id}
            delay={i * 0.05}
            className="flex flex-col gap-2 bg-surface p-6"
          >
            <h3 className="font-display text-lg text-ink">{fn.title}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{fn.body}</p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3">
        <p className="font-display text-heading-1 text-ink">{AI_SECTION.principle}</p>
        <p className="measure-wide text-sm text-ink-muted">{AI_SECTION.control}</p>
      </div>
    </Section>
  );
}
