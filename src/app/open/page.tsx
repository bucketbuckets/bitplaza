import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: "Open architecture",
  description:
    "How Bitplaza's openness is structured: licenses, data portability, protocol direction, the contribution model, and exactly what the site records. Precise about what exists today.",
};

/**
 * /open — the precise version of the homepage's three promises, plus the
 * data-practices page folded in. The rule for this page: every claim is
 * either checkable today or explicitly marked as being built. Nothing here
 * may outrun the implementation.
 */
export default function OpenPage() {
  return (
    <ProsePage eyebrow="Open by design" title="The map belongs to the community." updated="2026-07-29">
      <p>
        This page is the precise version of the promises on the homepage. It says what is open
        today, what is licensed to stay open, and what is still being built. Where something does
        not exist yet, it says so.
      </p>

      <ProseSection heading="Licenses">
        <p>
          The code is licensed <strong>AGPL-3.0</strong>: anyone can inspect it, modify it, and run
          it, and anyone offering it as a service must publish their changes. Community knowledge
          (the entries that make up a map) is published under <strong>CC BY-SA</strong>:
          contributors keep credit, the dataset stays open, and anyone can hold a copy.
        </p>
        <p>
          The public repository opens alongside early access. Until it does, we do not link to one,
          and we do not claim you can read the code today. When it is public, the link will be
          here and on the homepage.
        </p>
      </ProseSection>

      <ProseSection heading="Portable identity">
        <p>
          Your profile, contributions, and the reputation attached to them are being built as
          signed, portable records on open protocols, so you can take them somewhere else without
          our permission or our servers. This is a design commitment being implemented, not a
          shipped feature. We will mark it here when it is real and verifiable.
        </p>
      </ProseSection>

      <ProseSection heading="Exportable knowledge">
        <p>
          A community&apos;s map is exportable in open formats and mirrorable outside Bitplaza.
          Communities can host their own copy independently. This is what makes the resilience
          answer structural: the map is built to outlive any single operator, including us.
        </p>
      </ProseSection>

      <ProseSection heading="The contribution model">
        <p>
          A map starts curated by its community&apos;s leaders, opens to member contribution with
          transparent review, and is designed to end up governed by the people in it. AI drafts
          candidate entries and flags stale ones at a scale volunteers cannot; people decide what
          is true and what belongs. That order does not reverse.
        </p>
      </ProseSection>

      <ProseSection heading="How the company sustains itself">
        <p>
          The community map is open. Bitplaza charges organizations for the software and services
          that help them create, operate, and understand their communities: hosting,
          administration, integrations, analytics, and advanced AI tools. Community members
          explore and contribute for free.
        </p>
        <p>
          What that rules out, permanently: no advertising, no paid placement, and no sale of
          personal data. Anything we ever publish about how people use Bitplaza will be aggregate
          patterns across many people, never one person&apos;s behavior.
        </p>
      </ProseSection>

      <ProseSection heading="What this website records">
        <p>
          If you join the waitlist, we keep what you typed into the form: your email, what you
          said you want to do, a referral code we generate, the code of whoever referred you if
          anyone, and campaign tags if your link carried them. We use it to email you about early
          access and to understand who is interested. We do not sell it, rent it, or share it.
        </p>
        <p>
          If you are just reading, we measure anonymous usage. <strong>No cookies are set</strong>{" "}
          and nothing is written to your browser&apos;s storage for measurement; the identifier
          dies with the tab. The events we record are counts and categories (a page was viewed, a
          territory was opened), never text you typed. The complete list is one file in the
          source, and the code refuses to send anything not on it. No session recording, no
          keystrokes, no mouse tracking.
        </p>
        <p>
          Your IP address is not stored by our analytics, and for the waitlist form we keep only a
          one-way hash of it for a short window to stop spam. The switch in the footer turns
          measurement off entirely, and Do Not Track or Global Privacy Control is honored without
          you doing anything. There is no cookie banner because there are no cookies to consent
          to.
        </p>
        <p>
          Email us and we will send you everything we hold about you, or delete it. No explanation
          required. The legal version of all this is the <Link href={ROUTES.privacy}>privacy
          policy</Link>.
        </p>
      </ProseSection>

      <ProseSection heading="Governance">
        <p>
          The structure meant to make these commitments binding beyond goodwill is still being
          settled. We would rather say that plainly than describe an arrangement that does not
          exist yet, and we will publish it here when it is real.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
