import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms governing use of the Bitplaza website and waitlist.",
};

/**
 * The real terms, replacing the pre-counsel placeholder (2026-07-30), same
 * day and same rules as /privacy: the text is the owner's document,
 * published VERBATIM. Do not edit, tighten, or "fix" the wording without
 * the owner — this page is a legal document. The noindex is gone with the
 * placeholder.
 *
 * One tension a resumer should know exists and leave alone: "Ownership and
 * licensing" states Bitplaza is not currently distributed under an
 * open-source license, while this repository is public under AGPL-3.0. The
 * clause's own carve-out ("unless specific material includes an express
 * license notice") covers the repo's LICENSE file; reconciling the two is
 * the owner's call, flagged at publish time.
 */

const CONTACT_EMAIL = "team@houseofnaka.com";

export default function TermsPage() {
  return (
    <ProsePage eyebrow="Legal" title="Terms of Use" updated="2026-08-01">
      <p>These Terms govern your use of the Bitplaza website and waitlist.</p>
      <p>
        Bitplaza is operated by Bitcoin Culture Hub, a Delaware corporation, referred to here as
        “Bitplaza,” “we,” or “us.”
      </p>

      <ProseSection heading="What Bitplaza is today">
        <p>Bitplaza is currently a pre-launch website.</p>
        <p>
          Today, the site allows you to learn about the product, view early concepts, join the
          waitlist, and contact us. It does not currently provide user accounts, transactions,
          payments, marketplace services, or public community features.
        </p>
        <p>Separate or updated terms will apply before those services become available.</p>
      </ProseSection>

      <ProseSection heading="Joining the waitlist">
        <p>
          By joining the waitlist, you ask us to send you information about Bitplaza, including
          launch announcements, early-access opportunities, testing invitations, and material
          product updates.
        </p>
        <p>Joining the waitlist does not:</p>
        <ul>
          <li>Create a Bitplaza account;</li>
          <li>Guarantee access or a particular place in line;</li>
          <li>Reserve a username, community, location, or other identifier;</li>
          <li>Guarantee a launch date, feature, or price; or</li>
          <li>
            Create an investment, employment, partnership, or other business relationship.
          </li>
        </ul>
        <p>You may unsubscribe from promotional emails at any time.</p>
      </ProseSection>

      <ProseSection heading="Product previews">
        <p>
          Mockups, maps, plaza builders, statistics, listings, profiles, activity, and other
          product previews may contain fictional, estimated, simulated, incomplete, or placeholder
          information.
        </p>
        <p>
          Unless we clearly say otherwise, previews are illustrative. They are not live data,
          promises, offers, financial projections, or guarantees that a feature, user, business,
          community, transaction, or opportunity currently exists or will be released.
        </p>
        <p>Bitplaza may change its features, design, pricing, timing, and product plans.</p>
      </ProseSection>

      <ProseSection heading="Ownership and licensing">
        <p>
          The Bitplaza website, brand, designs, text, software, and other materials are owned by or
          licensed to Bitcoin Culture Hub and are protected by applicable law.
        </p>
        <p>Bitplaza is not currently distributed under an open-source license.</p>
        <p>
          We may publish some software under an open-source license in the future. Unless specific
          material includes an express license notice, no permission is granted to copy, modify,
          distribute, host, sell, sublicense, or create derivative works from it.
        </p>
        <p>
          Public access to a website, repository, design, document, or source file does not by
          itself grant an open-source or other intellectual-property license.
        </p>
        <p>You may access and view the public website for personal and informational use.</p>
      </ProseSection>

      <ProseSection heading="Responsible use">
        <p>You may not use the website to:</p>
        <ul>
          <li>Break the law or harm another person;</li>
          <li>Impersonate another person or submit information without permission;</li>
          <li>Interfere with the site or attempt to bypass its security;</li>
          <li>Introduce malicious code or abusive automated traffic; or</li>
          <li>Misrepresent an affiliation with Bitplaza or Bitcoin Culture Hub.</li>
        </ul>
        <p>
          We may restrict access when reasonably necessary to protect the website, our users, or
          others.
        </p>
      </ProseSection>

      <ProseSection heading="Privacy">
        <p>
          Our collection and use of information are described in the{" "}
          <Link href={ROUTES.privacy}>Bitplaza Privacy Policy</Link>.
        </p>
        <p>
          You must be at least 13 years old to join the waitlist. Bitplaza is not directed to
          children under 13, and we do not knowingly collect their personal information.
        </p>
      </ProseSection>

      <ProseSection heading="Availability and disclaimers">
        <p>
          The website and its content are provided on an “as is” and “as available” basis.
        </p>
        <p>
          We do not promise that Bitplaza will launch, that any person will receive access, that
          every proposed feature will be released, or that the website will always be available or
          error-free.
        </p>
        <p>
          To the maximum extent permitted by law, we are not responsible for indirect or
          consequential losses arising from your use of the current pre-launch website.
        </p>
        <p>Nothing in these Terms limits rights or liabilities that cannot legally be limited.</p>
      </ProseSection>

      <ProseSection heading="Governing law">
        <p>
          These Terms are governed by the laws of the State of Delaware, without regard to its
          conflict-of-law rules.
        </p>
        <p>
          Any dispute arising from these Terms or the website will be brought in the state or
          federal courts located in Delaware, except where applicable law provides otherwise.
        </p>
      </ProseSection>

      <ProseSection heading="Changes">
        <p>
          We may update these Terms as Bitplaza develops. Updated Terms apply prospectively from
          the date they are posted.
        </p>
        <p>
          Joining the waitlist does not mean that you automatically accept future marketplace,
          account, payment, moderation, or transaction terms. We may require you to review and
          accept new terms before using future services.
        </p>
      </ProseSection>

      <ProseSection heading="Contact">
        <p>
          <strong>Bitcoin Culture Hub</strong>
          <br />
          Operating Bitplaza
          <br />
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          40 N 4th St.
          <br />
          Brooklyn, NY 11222
          <br />
          United States
        </p>
      </ProseSection>
    </ProsePage>
  );
}
