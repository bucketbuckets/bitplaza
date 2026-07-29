import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { PROBLEM } from "@/content/problem";

export function Problem() {
  return (
    <Section id="problem" ruled>
      <SectionHeader eyebrow={PROBLEM.eyebrow} heading={PROBLEM.heading} lead={PROBLEM.lead} />

      {/* Hairline grid — the Wayfinding rule doing structural work. The 1px gaps
          are the edge colour showing through, so no cell needs its own border
          and nothing doubles up where two cells meet. */}
      <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2">
        {PROBLEM.symptoms.map((symptom, i) => (
          <Reveal as="li" key={symptom.id} delay={i * 0.05} className="bg-ground">
            <div className="flex h-full flex-col gap-3 p-7 sm:p-8">
              <h3 className="font-display text-xl text-ink">{symptom.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted">{symptom.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* The turn. Given the largest type on the page after the hero, because
          it is the actual thesis and everything before it was setup. */}
      <Reveal className="mt-16 sm:mt-20">
        <blockquote className="flex flex-col gap-5 border-l-2 border-accent pl-6 sm:pl-10">
          <p className="font-display text-display-sm text-ink measure-wide">
            {PROBLEM.turn.statement}
          </p>
          <p className="measure text-lg leading-relaxed text-muted">{PROBLEM.turn.support}</p>
        </blockquote>
      </Reveal>
    </Section>
  );
}
