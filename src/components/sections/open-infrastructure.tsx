import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  OPEN_INFRA,
  OPEN_INFRA_MODEL,
  OPEN_INFRA_SECTION,
} from "@/content/open-infrastructure";

export function OpenInfrastructure() {
  return (
    <Section id="open" ruled>
      <SectionHeader
        eyebrow={OPEN_INFRA_SECTION.eyebrow}
        heading={OPEN_INFRA_SECTION.heading}
        lead={OPEN_INFRA_SECTION.lead}
      />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2">
        {OPEN_INFRA.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 0.05} className="bg-ground">
            <div className="flex h-full flex-col gap-3 p-7 sm:p-8">
              <h3 className="font-display text-xl text-ink">{item.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* The money answer, given its own panel rather than buried in a list.
          It is the question this audience asks first, and hiding it in prose
          reads as evasion whatever the words say. */}
      <Reveal className="mt-12">
        <div className="flex flex-col gap-5 rounded-card border border-edge-strong bg-surface p-7 shadow-soft sm:p-10">
          <h3 className="font-display text-2xl text-ink">{OPEN_INFRA_MODEL.heading}</h3>
          <div className="flex flex-col gap-4">
            {OPEN_INFRA_MODEL.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="measure-wide leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
