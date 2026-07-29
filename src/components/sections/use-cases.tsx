import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { USE_CASES, USE_CASES_SECTION } from "@/content/use-cases";

/**
 * No icons. An icon beside each of six abstract capabilities is decoration
 * pretending to be information — there is no visual language that distinguishes
 * "find people" from "find opportunities" without becoming a guessing game.
 * The type carries it.
 */
export function UseCases() {
  return (
    <Section id="ai" tone="surface" ruled>
      <SectionHeader
        eyebrow={USE_CASES_SECTION.eyebrow}
        heading={USE_CASES_SECTION.heading}
        lead={USE_CASES_SECTION.lead}
      />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((useCase, i) => (
          <Reveal as="li" key={useCase.id} delay={Math.min(i, 5) * 0.04} className="bg-surface">
            <div className="flex h-full flex-col gap-3 p-7 sm:p-8">
              <h3 className="font-display text-xl leading-snug text-ink">{useCase.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted">{useCase.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
