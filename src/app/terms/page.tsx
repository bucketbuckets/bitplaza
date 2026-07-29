import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Bitplaza's terms of use.",
  robots: { index: false, follow: true },
};

/**
 * An honest placeholder, for the same reason as /privacy.
 *
 * Today the site does one thing: it takes waitlist signups. There is no account
 * to hold, no service to be unavailable, and no content to license. Publishing
 * terms of service for a product that has not shipped would be describing a
 * relationship that does not exist.
 */
export default function TermsPage() {
  return (
    <ProsePage eyebrow="Legal" title="Terms" updated="2026-07-29">
      <p>
        <strong>There are no terms of service yet, because there is no service yet.</strong> Today
        this site does one thing: it takes your name and email so we can tell you when Bitplaza
        opens. There is no account, nothing to log in to, and nothing you can lose.
      </p>

      <ProseSection heading="What joining the waitlist means">
        <ul>
          <li>We will email you about early access, and about very little else.</li>
          <li>Every email has an unsubscribe link, and using it removes you from the list.</li>
          <li>A place on the waitlist is not a promise of access, a price, or a launch date.</li>
          <li>
            Anything shown as a preview of the product — including the numbers in the plaza builder
            — is illustrative. It is not live data and does not describe anything that exists today.
          </li>
        </ul>
      </ProseSection>

      <ProseSection heading="What happens to what you told us">
        <p>
          <Link href={ROUTES.open}>The open page</Link> covers it. Short version: we keep what you
          typed, we do not sell it, and you can have it deleted by asking.
        </p>
      </ProseSection>

      <ProseSection heading="When real terms arrive">
        <p>
          Terms of service will be published before the product opens, reviewed by counsel, and
          alongside the editorial and moderation policies that govern what appears in a plaza. We
          will not quietly apply them to your waitlist signup in the meantime.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
