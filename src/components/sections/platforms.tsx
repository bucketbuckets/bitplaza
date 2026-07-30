import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { PLATFORMS, PLATFORMS_SECTION } from "@/content/platforms";
import { SITE } from "@/content/site";

/**
 * The platform family: three raised cards, one pillar each. Deliberately
 * louder than the hairline lists around it — prominence is the brief — and
 * placed right after Capabilities so the narrative reads "what you can do →
 * the platforms that do it → zoom into the first map". A card becomes a
 * link the moment its `href` exists in content; until then it is a plain
 * card, never a guessed domain.
 */
export function Platforms() {
  return (
    <Section id="platforms" ruled>
      <SectionHeader
        eyebrow={PLATFORMS_SECTION.eyebrow}
        heading={PLATFORMS_SECTION.heading}
        lead={PLATFORMS_SECTION.lead}
      />

      <ul className="mt-12 grid gap-5 lg:grid-cols-3">
        {PLATFORMS.map((platform, i) => (
          <Reveal as="li" key={platform.id} delay={Math.min(i, 3) * 0.05} className="h-full">
            <PlatformCard
              href={platform.href}
              className="flex h-full flex-col rounded-card border border-edge bg-raised p-6 shadow-soft sm:p-8"
            >
              <p className="eyebrow text-apricot-ink">{platform.pillar}</p>
              <h3 className="mt-3 font-display text-heading-1 text-ink">{platform.name}</h3>
              <p className="measure mt-2 leading-relaxed text-ink-muted">{platform.body}</p>
            </PlatformCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function PlatformCard({
  href,
  className,
  children,
}: {
  href: string | null;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={className}>{children}</div>;

  // Off-site platforms open in a new tab: this page has one conversion (the
  // waitlist) and an ecosystem link must not navigate a visitor away from it.
  const external = !href.startsWith(SITE.url);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${className} transition-shadow hover:shadow-lift`}
    >
      {children}
    </a>
  );
}
