import type { Metadata } from "next";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Bitplaza collects, uses, discloses, and protects information.",
};

/**
 * The owner's privacy policy, second revision (2026-07-30, superseding the
 * 14-section version published earlier the same day). Published VERBATIM —
 * unnumbered sections, and a new "Open-source software and personal
 * information" section that pairs with /open's AGPL-3.0 page. Do not edit,
 * tighten, or "fix" the wording without the owner: this page is a legal
 * document, and every deviation is a commitment nobody reviewed.
 */

const CONTACT_EMAIL = "team@houseofnaka.com";

function ContactEmail() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
}

export default function PrivacyPage() {
  return (
    <ProsePage eyebrow="Legal" title="Privacy" updated="2026-08-01">
      <p>
        Bitplaza is operated by Bitcoin Culture Hub, referred to in this policy as “Bitplaza,”
        “we,” or “us.”
      </p>
      <p>
        This Privacy Policy explains how we collect, use, disclose, and protect information when
        you visit the Bitplaza website, join the waitlist, or contact us.
      </p>
      <p>
        Bitplaza is currently a pre-launch website. It does not yet provide user accounts,
        transactions, payments, marketplace services, or public community features. We will update
        this policy before introducing materially different data practices.
      </p>

      <ProseSection heading="Information we collect">
        <h3 className="font-semibold text-ink">Information you provide</h3>
        <p>When you join the waitlist or contact us, we may collect:</p>
        <ul>
          <li>Your name;</li>
          <li>Your email address;</li>
          <li>Information about your interests or how you expect to use Bitplaza;</li>
          <li>Referral or campaign information associated with your signup; and</li>
          <li>Any other information you choose to include in a form or message.</li>
        </ul>
        <p>
          Please do not submit sensitive personal information through the waitlist or general
          contact forms.
        </p>

        <h3 className="font-semibold text-ink">Information collected automatically</h3>
        <p>
          When you visit the website, Bitplaza and its hosting, security, and analytics providers
          may automatically process limited technical and usage information, including:
        </p>
        <ul>
          <li>Your IP address;</li>
          <li>Browser and device information;</li>
          <li>Referring page;</li>
          <li>Pages viewed and actions taken;</li>
          <li>Approximate location derived from your IP address; and</li>
          <li>The date and time of your visit.</li>
        </ul>
        <p>
          We use this information to operate and secure the website, understand how it is used,
          prevent abuse, and identify technical problems.
        </p>
      </ProseSection>

      <ProseSection heading="How we use information">
        <p>We may use the information we collect to:</p>
        <ul>
          <li>Operate, maintain, and secure the website;</li>
          <li>Add you to the Bitplaza waitlist;</li>
          <li>
            Send launch announcements, early-access invitations, testing opportunities, and
            material product updates;
          </li>
          <li>Respond to questions and requests;</li>
          <li>Understand who is interested in Bitplaza and how they expect to use it;</li>
          <li>Improve the website and planned product;</li>
          <li>Detect and prevent spam, fraud, abuse, and security threats;</li>
          <li>Maintain appropriate business records; and</li>
          <li>Comply with applicable law and lawful legal process.</li>
        </ul>
        <p>
          We do not treat joining the waitlist as permission to send materially unrelated
          marketing.
        </p>
      </ProseSection>

      <ProseSection heading="How we disclose information">
        <p>We may disclose information to service providers that help us:</p>
        <ul>
          <li>Host and secure the website;</li>
          <li>Operate waitlist and contact forms;</li>
          <li>Send and manage email communications;</li>
          <li>Measure website traffic and usage; and</li>
          <li>Maintain our technical systems.</li>
        </ul>
        <p>
          These providers process information on our behalf to operate, secure, analyze, and
          support the website.
        </p>
        <p>We may also disclose information when reasonably necessary to:</p>
        <ul>
          <li>Comply with applicable law or lawful legal process;</li>
          <li>
            Protect the rights, safety, or property of Bitplaza, Bitcoin Culture Hub, our users,
            or others;
          </li>
          <li>Investigate suspected fraud, abuse, or security incidents; or</li>
          <li>Establish, exercise, or defend legal rights.</li>
        </ul>
        <p>We do not sell personal information.</p>
        <p>
          We do not knowingly disclose personal information for cross-context behavioral
          advertising.
        </p>
      </ProseSection>

      <ProseSection heading="Open-source software and personal information">
        <p>
          Parts of the Bitplaza software are publicly available under the GNU Affero General
          Public License version 3, or AGPL-3.0.
        </p>
        <p>
          The publication and licensing of Bitplaza’s software does not make personal information
          public. It does not include or license waitlist submissions, email lists, private
          databases, production logs, account credentials, security keys, or other nonpublic
          information held by Bitplaza or its service providers.
        </p>
        <p>
          The public repository may not contain every production configuration, third-party
          service, credential, or internal system used to operate Bitplaza.
        </p>
      </ProseSection>

      <ProseSection heading="Email communications">
        <p>
          By joining the waitlist, you ask us to send you communications about Bitplaza, including
          launch information, early-access opportunities, testing invitations, and material
          product updates.
        </p>
        <p>
          You may unsubscribe from promotional emails at any time by using the unsubscribe link
          included in the email or by contacting us at <ContactEmail />.
        </p>
        <p>
          Unsubscribing from promotional communications will not prevent us from responding to a
          request you initiated or sending communications reasonably necessary to address legal,
          operational, or security matters.
        </p>
      </ProseSection>

      <ProseSection heading="Cookies and analytics">
        <p>
          Bitplaza and its service providers may use cookies, local storage, or similar
          technologies that are necessary to operate, secure, or measure use of the website.
        </p>
        <p>
          You can control cookies through your browser settings. Blocking some technologies may
          affect how the website functions.
        </p>
        <p>
          Bitplaza does not currently use waitlist information to serve targeted advertisements.
        </p>
      </ProseSection>

      <ProseSection heading="How long we keep information">
        <p>
          We retain waitlist information while Bitplaza remains in development, while you remain
          subscribed, and for as long as reasonably necessary for the purposes described in this
          policy.
        </p>
        <p>We may retain limited information for longer when reasonably necessary to:</p>
        <ul>
          <li>Maintain unsubscribe records;</li>
          <li>Protect the website and prevent abuse;</li>
          <li>Comply with legal obligations;</li>
          <li>Resolve disputes;</li>
          <li>Establish or defend legal claims; or</li>
          <li>Maintain appropriate business records.</li>
        </ul>
        <p>
          When information is no longer reasonably necessary, we may delete or anonymize it. Some
          information may remain temporarily in protected backups.
        </p>
      </ProseSection>

      <ProseSection heading="Your choices and requests">
        <p>You may ask us to:</p>
        <ul>
          <li>Tell you what personal information we hold about you;</li>
          <li>Correct inaccurate information;</li>
          <li>Remove you from the waitlist;</li>
          <li>Stop sending promotional communications; or</li>
          <li>Delete personal information associated with you.</li>
        </ul>
        <p>
          Send requests to <ContactEmail />.
        </p>
        <p>
          We may need to verify that a request relates to you before completing it. We may retain
          information where reasonably necessary or permitted for security, fraud prevention,
          legal compliance, recordkeeping, or the establishment or defense of legal claims.
        </p>
        <p>Depending on where you live, applicable law may provide additional privacy rights.</p>
      </ProseSection>

      <ProseSection heading="Children’s privacy">
        <p>
          Bitplaza is not directed to children under 13, and children under 13 may not join the
          waitlist.
        </p>
        <p>
          We do not knowingly collect personal information from children under 13. If you believe
          that a child under 13 has provided personal information through the website, contact us
          at <ContactEmail />, and we will investigate and take appropriate action.
        </p>
      </ProseSection>

      <ProseSection heading="Security">
        <p>
          We use reasonable administrative, technical, and organizational measures designed to
          protect the information we collect.
        </p>
        <p>
          No website, transmission method, or storage system can be guaranteed to be completely
          secure.
        </p>
      </ProseSection>

      <ProseSection heading="Third-party links">
        <p>The website may contain links to websites or services operated by others.</p>
        <p>
          We do not control their privacy, security, content, or business practices. Review their
          policies before providing information to them.
        </p>
      </ProseSection>

      <ProseSection heading="Changes to this policy">
        <p>
          We may update this Privacy Policy as Bitplaza develops or as our legal, technical, and
          business practices change.
        </p>
        <p>
          When we update the policy, we will revise the “Last updated” date. Changes apply
          prospectively from the date the updated policy is published.
        </p>
        <p>
          We will update this policy before launching user accounts, transactions, public
          profiles, community features, or other services involving materially different
          information practices.
        </p>
      </ProseSection>

      <ProseSection heading="Contact">
        <p>
          <strong>Bitcoin Culture Hub</strong>
          <br />
          Operating Bitplaza
          <br />
          <ContactEmail />
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
