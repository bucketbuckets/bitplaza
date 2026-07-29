"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { OPEN_SECTION } from "@/content/open";
import { capture } from "@/lib/analytics/client";

/**
 * Open architecture: three plain-language promises. Licenses, protocols and
 * governance detail live on /open, where they can be stated precisely.
 *
 * The repo action renders only when `OPEN_SECTION.repoUrl` is a real public
 * repository. A dead or aspirational code link would cost more credibility
 * than the button earns.
 */
export function OpenArchitecture() {
  return (
    <Section id="open" ruled>
      <SectionHeader eyebrow={OPEN_SECTION.eyebrow} heading={OPEN_SECTION.heading} />

      <ul className="mt-12 grid gap-x-16 lg:grid-cols-3">
        {OPEN_SECTION.promises.map((promise, i) => (
          <Reveal
            as="li"
            key={promise.id}
            delay={i * 0.05}
            className="flex flex-col gap-2 border-t border-edge py-7"
          >
            <h3 className="text-lg font-semibold text-ink">{promise.title}</h3>
            <p className="measure text-sm leading-relaxed text-ink-muted">{promise.body}</p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button asChild variant="secondary" size="lg">
          <a
            href={OPEN_SECTION.architectureCta.href}
            onClick={() => capture("architecture_link_clicked", { location: "section" })}
          >
            {OPEN_SECTION.architectureCta.label}
          </a>
        </Button>

        {OPEN_SECTION.repoUrl ? (
          <Button asChild variant="secondary" size="lg">
            <a
              href={OPEN_SECTION.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => capture("repo_link_clicked", { location: "section" })}
            >
              {OPEN_SECTION.repoCtaLabel}
            </a>
          </Button>
        ) : null}
      </div>
    </Section>
  );
}
