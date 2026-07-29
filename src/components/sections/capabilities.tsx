import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { CAPABILITIES, CAPABILITIES_SECTION } from "@/content/capabilities";

/**
 * What users can do: four verbs, one sentence each. Deliberately not a
 * bordered card grid — the titles carry the hierarchy and a single hairline
 * per row keeps the section quiet.
 */
export function Capabilities() {
  return (
    <Section id="capabilities" ruled>
      <SectionHeader
        eyebrow={CAPABILITIES_SECTION.eyebrow}
        heading={CAPABILITIES_SECTION.heading}
      />

      <ul className="mt-12 grid gap-x-16 sm:grid-cols-2">
        {CAPABILITIES.map((capability, i) => (
          <Reveal
            as="li"
            key={capability.id}
            delay={Math.min(i, 3) * 0.05}
            className="flex flex-col gap-2 border-t border-edge py-8"
          >
            <h3 className="font-display text-heading-1 text-ink">{capability.title}</h3>
            <p className="measure text-ink-muted">{capability.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
