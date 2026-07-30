import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: "Open Source",
  description:
    "What is open about Bitplaza today: the public AGPL-3.0 repository, what the license permits, and what remains under development.",
};

/**
 * /open — the owner's Open Source document (2026-07-30), published VERBATIM
 * like /privacy and /terms. It replaces the earlier "precise promises" page,
 * deliberately softening claims that had outrun the implementation (the
 * CC BY-SA data promise, "no advertising, permanently") into intentions
 * with explicit caveats. Do not edit the wording without the owner. Its
 * repo link resolves the §22 Terms/AGPL tension: the code is publicly
 * AGPL-3.0 and this page says so; the Terms' express-license-notice
 * carve-out does the legal work.
 */

const REPO_URL = "https://github.com/bucketbuckets/bitplaza";
const CONTACT_EMAIL = "team@houseofnaka.com";

export default function OpenPage() {
  return (
    <ProsePage eyebrow="Open by design" title="Open Source" updated="2026-08-01">
      <ProseSection heading="The map belongs to the community">
        <p>
          Bitplaza is being built as open infrastructure for communities: a way to organize,
          preserve, and share the people, places, organizations, knowledge, and opportunities that
          make a community valuable.
        </p>
        <p>
          The Bitplaza source code is public and licensed under the GNU Affero General Public
          License version 3, or AGPL-3.0.
        </p>
        <p>
          This page explains what is open today, what the license permits, and what remains under
          development.
        </p>
      </ProseSection>

      <ProseSection heading="Public repository">
        <p>The Bitplaza source-code repository is publicly available at:</p>
        <p>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            github.com/bucketbuckets/bitplaza
          </a>
        </p>
        <p>
          Anyone can inspect the code, follow development, report issues, and review how Bitplaza
          is being built.
        </p>
        <p>
          The repository’s license file provides the controlling legal terms. If this page ever
          conflicts with that license, the license controls.
        </p>
      </ProseSection>

      <ProseSection heading="Software license">
        <p>Bitplaza’s software is licensed under AGPL-3.0.</p>
        <p>
          The license allows people to use, study, copy, modify, and redistribute the covered
          software, provided they comply with its terms. AGPL-3.0 is an open-source, copyleft
          license designed specifically to preserve access to source code when modified software is
          used over a network.
        </p>
        <p>
          In practical terms, someone who modifies covered Bitplaza software and allows users to
          interact with that modified version over a network may be required to offer those users
          access to the corresponding source code under AGPL-3.0.
        </p>
        <p>
          The license applies only to the materials covered by the repository’s license and
          notices. It does not automatically grant rights to Bitplaza trademarks, logos, branding,
          private data, third-party materials, or content governed by a different license.
        </p>
      </ProseSection>

      <ProseSection heading="Contributions">
        <p>
          We welcome people inspecting the code, opening issues, and participating in the project.
        </p>
        <p>
          Before accepting substantial outside code contributions, we may introduce contribution
          guidelines, authorship requirements, or a contributor agreement. Those rules will be
          published in the repository.
        </p>
        <p>
          Unless stated otherwise, contributions intentionally submitted for inclusion in the
          licensed project should be expected to be distributed under the project’s applicable
          license.
        </p>
        <p>
          Do not submit code, data, designs, or other materials that you do not have the right to
          contribute.
        </p>
      </ProseSection>

      <ProseSection heading="Portable identity">
        <p>Bitplaza is being designed around portable identity and open protocols.</p>
        <p>
          Our goal is for people to be able to carry their profiles, contributions, and reputation
          beyond a single Bitplaza application or server.
        </p>
        <p>
          This remains under development. We will document the implementation, limitations, and
          verification process when the feature is available to test.
        </p>
      </ProseSection>

      <ProseSection heading="Exportable community knowledge">
        <p>
          We intend for communities to be able to export the knowledge they contribute in
          practical, documented formats.
        </p>
        <p>
          Our longer-term goal is to support community-controlled archives, independent copies, and
          tools that reduce dependence on any single operator, including Bitplaza.
        </p>
        <p>
          The available formats, export process, data licenses, and independent-hosting options
          have not yet been finalized. Open-source software does not automatically mean that every
          dataset or piece of user-contributed content is open under the same license.
        </p>
        <p>
          We will publish the applicable data and content terms before describing community
          knowledge as freely reusable or independently hostable.
        </p>
      </ProseSection>

      <ProseSection heading="How contributions to maps are expected to work">
        <p>
          Bitplaza maps are being designed to begin with trusted curation and expand through
          community participation.
        </p>
        <p>The intended model is:</p>
        <ul>
          <li>Community leaders establish the initial structure;</li>
          <li>Members suggest additions and corrections;</li>
          <li>Reviews and decisions remain visible;</li>
          <li>AI helps draft, organize, and identify potentially outdated information; and</li>
          <li>People remain responsible for deciding what is accurate and what belongs.</li>
        </ul>
        <p>This model may change as we test Bitplaza with early communities.</p>
      </ProseSection>

      <ProseSection heading="How Bitplaza expects to make money">
        <p>Open-source software does not mean every Bitplaza service will be free.</p>
        <p>
          Bitplaza expects to charge organizations for software and services that help them create,
          operate, and understand their communities. These may include:
        </p>
        <ul>
          <li>Managed hosting and administration;</li>
          <li>Integrations;</li>
          <li>Analytics;</li>
          <li>Moderation and workflow tools;</li>
          <li>Advanced AI features;</li>
          <li>Implementation; and</li>
          <li>Support.</li>
        </ul>
        <p>
          Organizations may also use or operate the open-source software themselves in accordance
          with AGPL-3.0.
        </p>
        <p>
          We intend for basic community exploration and contribution to remain available without
          requiring every community member to pay. Final pricing and product boundaries have not
          yet been set.
        </p>
      </ProseSection>

      <ProseSection heading="Advertising and personal information">
        <p>Bitplaza does not currently sell personal information.</p>
        <p>
          The pre-launch website is not supported by advertising or paid placement. Waitlist
          information is not used to determine how communities, businesses, organizations, or
          people are ranked.
        </p>
        <p>
          Our current information practices are described in the{" "}
          <Link href={ROUTES.privacy}>Privacy Policy</Link>. If our business model or data
          practices materially change, we will update the relevant policies before applying those
          changes.
        </p>
      </ProseSection>

      <ProseSection heading="What the pre-launch website records">
        <p>
          When you join the waitlist, we may collect the information you submit, including:
        </p>
        <ul>
          <li>Your name;</li>
          <li>Your email address;</li>
          <li>Information you provide about your interests or intended use;</li>
          <li>Referral information; and</li>
          <li>Campaign information included in the link you used.</li>
        </ul>
        <p>
          We use this information to manage the waitlist, communicate about Bitplaza, understand
          interest in the product, and prevent abuse.
        </p>
        <p>
          The website and its service providers may also process limited technical and usage
          information needed to operate, secure, and understand the site.
        </p>
        <p>
          The <Link href={ROUTES.privacy}>Privacy Policy</Link> provides the controlling
          description of what information is collected, how it is used, and the choices available
          to you.
        </p>
      </ProseSection>

      <ProseSection heading="Your information">
        <p>
          You may contact us to ask what personal information we hold about you, correct it, leave
          the waitlist, or request deletion.
        </p>
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          Some limited information may be retained where reasonably necessary for legal compliance,
          security, fraud prevention, unsubscribe records, or protected backups.
        </p>
      </ProseSection>

      <ProseSection heading="Governance">
        <p>
          Bitplaza is open source today, but its long-term project governance is still being
          developed.
        </p>
        <p>
          We are evaluating how maintainership, contributions, moderation, releases, stewardship,
          and community decision-making should work as the project grows.
        </p>
        <p>
          We will publish those rules when they are concrete enough to be tested and relied upon.
        </p>
        <p>
          The AGPL-3.0 license already grants meaningful rights to use, inspect, modify, and share
          the covered software. This page does not replace or modify those rights. The
          repository’s license remains the controlling legal document.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
