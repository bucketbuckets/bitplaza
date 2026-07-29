import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: "What we collect",
  description:
    "Exactly what Bitplaza records, what it does not, and how to turn measurement off. In plain language.",
};

/**
 * The plain-language data page `bch/plan.md` §1.4 rule 2 commits to, and §12
 * action 5 assigns to the owner before launch.
 *
 * Written to be checkable rather than reassuring. Everything stated here is
 * enforced somewhere in the codebase — the event list in
 * src/lib/analytics/events.ts, the client configuration in client.ts, the
 * opt-out in consent.ts — so a reader who does not believe it can go and look.
 * That is the point of writing it this way.
 */
export default function DataPage() {
  return (
    <ProsePage eyebrow="Openness" title="What we collect" updated="2026-07-29">
      <p>
        This page describes what this website records today. It is not a legal document — the{" "}
        <Link href={ROUTES.privacy}>privacy policy</Link> is that. It is the honest version, written
        so you can check it against the code rather than take our word for it.
      </p>

      <ProseSection heading="If you join the waitlist">
        <p>We keep what you typed into the form, and nothing more:</p>
        <ul>
          <li>Your first name and email address.</li>
          <li>The communities you selected and what you said you want Bitplaza to help you do.</li>
          <li>Which kind of member you told us you are.</li>
          <li>
            A referral code we generate for you, and the code of whoever referred you, if anyone.
          </li>
          <li>
            Where you arrived from, if the link carried campaign tags — the source, medium and
            campaign only.
          </li>
          <li>The time you ticked the consent box.</li>
        </ul>
        <p>
          We use it to email you about early access and to understand who is interested. We do not
          sell it, rent it, or share it with anyone for their own purposes.
        </p>
      </ProseSection>

      <ProseSection heading="If you are just reading">
        <p>
          We measure anonymous usage. <strong>No cookies are set</strong> and nothing is written to
          your browser&apos;s storage for measurement. The identifier lasts as long as the tab does
          and is thrown away when you close it, so there is no way to recognise you on a later
          visit.
        </p>
        <p>
          Twelve events are recorded — things like <em>a page was viewed</em>, <em>an interest was
          selected</em>, <em>an FAQ was opened</em>. Each carries counts and categories, never text
          you typed, never your email, never your referral code. The complete list is a single file
          in the source, and the code refuses to send anything that is not on it.
        </p>
        <p>We do not record your screen, your mouse movements, or your keystrokes.</p>
      </ProseSection>

      <ProseSection heading="Your IP address">
        <p>
          We ask our analytics provider not to store it, which also means we never learn your city
          or country. For the waitlist form we keep a one-way hash of it for a short window, purely
          to stop the form being used for spam. The address itself is never written down.
        </p>
      </ProseSection>

      <ProseSection heading="Turning measurement off">
        <p>
          There is a switch in the footer of every page. Turning it off stops measurement
          immediately and changes nothing else — the site works exactly the same, and we will not
          ask you again.
        </p>
        <p>
          If your browser sends Do Not Track or Global Privacy Control, we treat that as the same
          answer and do not measure at all. You do not have to do anything.
        </p>
        <p>
          There is no cookie banner because there are no cookies to consent to. A banner would be
          asking permission for something we deliberately built not to need.
        </p>
      </ProseSection>

      <ProseSection heading="Getting your data back, or deleting it">
        <p>
          Email us and we will send you everything we hold about you, or delete it. No explanation
          required and no attempt to talk you out of it. Deleting removes you from the waitlist,
          which is the only thing it affects.
        </p>
      </ProseSection>

      <ProseSection heading="Where this is going">
        <p>
          Bitplaza is being built so that the map of each community — the people, projects, events
          and organisations in it — is <strong>open</strong>, and belongs to everyone. The tools
          built on top of that map are how the company sustains the work of building them.
        </p>
        <p>
          What that commits us to: no advertising, no paid placement, and no selling of personal
          data. Anything we ever publish or share about how people use Bitplaza will be aggregate —
          patterns across many people, never one person&apos;s behaviour.
        </p>
        <p>
          The governance structure meant to hold that commitment is still being settled. We would
          rather say that plainly than describe an arrangement that does not exist yet.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
