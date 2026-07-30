import type { Metadata } from "next";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Bitplaza collects, uses, discloses, and protects information.",
};

/**
 * The real policy, replacing the pre-counsel placeholder (2026-07-30).
 *
 * The text is the owner's document, published VERBATIM — including the
 * "Last updated" date. One correction, owner-sourced: the §14 ZIP arrived
 * as "1122" and was completed to 11222 from the address block in the
 * owner's Terms document (same session). Do not edit, tighten,
 * or "fix" the wording here without the owner: this page is a legal
 * document, and every deviation is a commitment nobody reviewed. The old
 * noindex is gone; a published policy has no reason to hide from indexing.
 */

const CONTACT_EMAIL = "team@houseofnaka.com";

function ContactEmail() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
}

export default function PrivacyPage() {
  return (
    <ProsePage eyebrow="Legal" title="Privacy Policy" updated="2026-08-01">
      <p>
        Bitplaza is operated by <strong>Bitcoin Culture Hub</strong> (“Bitplaza,” “Bitcoin
        Culture Hub,” “we,” “us,” or “our”).
      </p>
      <p>
        This Privacy Policy explains how we collect, use, disclose, and protect information when
        you visit Bitplaza, join our waitlist, communicate with us, or otherwise interact with the
        Bitplaza website.
      </p>
      <p>
        Bitplaza is currently a pre-launch website. It does not yet provide user accounts,
        marketplace transactions, payments, public profiles, community spaces, or other live
        platform services. We will update this Privacy Policy before introducing data practices
        that materially differ from those described here.
      </p>

      <ProseSection heading="1. Information We Collect">
        <h3 className="font-semibold text-ink">Information you provide</h3>
        <p>We may collect information that you voluntarily provide, including:</p>
        <ul>
          <li>Your name;</li>
          <li>Your email address;</li>
          <li>
            Your organization, interests, or other information included in a waitlist or interest
            form;
          </li>
          <li>Your communication preferences; and</li>
          <li>Information you include when you contact us.</li>
        </ul>
        <p>
          You are not required to provide this information, but we may be unable to add you to the
          waitlist or respond to your request without it.
        </p>

        <h3 className="font-semibold text-ink">Information collected automatically</h3>
        <p>
          When you visit the website, we and our service providers may automatically collect
          limited technical and usage information, such as:
        </p>
        <ul>
          <li>Internet Protocol address;</li>
          <li>Browser and device type;</li>
          <li>Operating system;</li>
          <li>Referring and exit pages;</li>
          <li>Pages viewed and actions taken;</li>
          <li>Approximate location derived from an IP address;</li>
          <li>Date, time, and duration of visits; and</li>
          <li>Cookie identifiers and similar technical information.</li>
        </ul>
        <p>
          We may use cookies, pixels, local storage, or similar technologies to operate the
          website, understand how it is used, measure interest in Bitplaza, prevent abuse, and
          improve the experience.
        </p>
      </ProseSection>

      <ProseSection heading="2. How We Use Information">
        <p>We may use the information we collect to:</p>
        <ul>
          <li>Maintain and operate the website;</li>
          <li>Add you to the Bitplaza waitlist;</li>
          <li>
            Send launch announcements, early-access invitations, product updates, surveys, and
            related communications;
          </li>
          <li>Respond to questions and requests;</li>
          <li>Understand interest in Bitplaza and improve the website;</li>
          <li>Measure website traffic and engagement;</li>
          <li>
            Detect, investigate, and prevent fraud, abuse, security incidents, and technical
            problems;
          </li>
          <li>Enforce our Terms of Use;</li>
          <li>Comply with applicable law and legal process; and</li>
          <li>Establish, exercise, or defend legal rights.</li>
        </ul>
        <p>We will not use waitlist registration as consent to materially unrelated marketing.</p>
      </ProseSection>

      <ProseSection heading="3. Email Communications">
        <p>
          By joining the waitlist, you ask us to send you communications concerning Bitplaza,
          including launch information, early-access opportunities, and material product updates.
        </p>
        <p>
          You may unsubscribe from promotional emails by using the unsubscribe link included in the
          message or by contacting us at <ContactEmail />.
        </p>
        <p>
          Unsubscribing from promotional communications will not prevent us from sending
          non-promotional communications that may be necessary to respond to your requests, confirm
          actions you initiated, or address legal or security matters.
        </p>
      </ProseSection>

      <ProseSection heading="4. How We Disclose Information">
        <p>We may disclose information in the following circumstances:</p>

        <h3 className="font-semibold text-ink">Service providers</h3>
        <p>
          We may provide information to vendors that help us operate the website, manage forms and
          email communications, provide hosting and analytics, maintain security, or perform other
          services on our behalf.
        </p>
        <p>
          These providers may use the information only as permitted by their agreements with us and
          applicable law.
        </p>

        <h3 className="font-semibold text-ink">Legal and safety purposes</h3>
        <p>We may disclose information when we reasonably believe disclosure is necessary to:</p>
        <ul>
          <li>
            Comply with applicable law, regulation, subpoena, court order, or other legal process;
          </li>
          <li>
            Protect the rights, safety, or property of Bitplaza, Bitcoin Culture Hub, our users, or
            others;
          </li>
          <li>Investigate suspected fraud, abuse, security threats, or unlawful conduct; or</li>
          <li>Enforce our agreements and policies.</li>
        </ul>

        <h3 className="font-semibold text-ink">Business transactions</h3>
        <p>
          Information may be disclosed or transferred in connection with a proposed or completed
          financing, merger, acquisition, restructuring, sale of assets, bankruptcy, or similar
          business transaction.
        </p>

        <h3 className="font-semibold text-ink">With your direction</h3>
        <p>
          We may disclose information when you direct us to do so or otherwise provide consent.
        </p>
      </ProseSection>

      <ProseSection heading="5. Sale and Sharing of Personal Information">
        <p>We do not sell personal information for money.</p>
        <p>
          We also do not knowingly disclose personal information for cross-context behavioral
          advertising as those concepts are defined under applicable state privacy laws.
        </p>
        <p>
          If our practices change, we will update this Privacy Policy and provide any choices
          required by applicable law before applying the new practice.
        </p>
      </ProseSection>

      <ProseSection heading="6. Data Retention">
        <p>We retain personal information for as long as reasonably necessary to:</p>
        <ul>
          <li>Maintain the waitlist and provide requested communications;</li>
          <li>Operate and improve the website;</li>
          <li>Maintain appropriate business and legal records;</li>
          <li>Comply with legal obligations;</li>
          <li>Resolve disputes; and</li>
          <li>Protect against fraud, abuse, and security threats.</li>
        </ul>
        <p>
          Retention periods may vary depending on the nature of the information, why it was
          collected, whether you remain subscribed, and applicable legal requirements.
        </p>
        <p>
          When information is no longer reasonably necessary, we may delete it, anonymize it, or
          securely retain it where deletion is impracticable, such as in protected backups.
        </p>
      </ProseSection>

      <ProseSection heading="7. Your Choices and Privacy Requests">
        <p>You may contact us to request that we:</p>
        <ul>
          <li>Provide information about personal information associated with you;</li>
          <li>Correct inaccurate information;</li>
          <li>Delete certain information;</li>
          <li>Stop sending promotional emails; or</li>
          <li>Address another privacy concern.</li>
        </ul>
        <p>
          Submit requests to <ContactEmail />.
        </p>
        <p>
          We may need to verify your identity before completing a request. We may also retain
          information where reasonably necessary or permitted by law, including for security, fraud
          prevention, legal compliance, recordkeeping, and the establishment or defense of legal
          claims.
        </p>
        <p>
          Depending on where you live, applicable law may provide additional privacy rights. We
          will not unlawfully discriminate against you for exercising an applicable privacy right.
        </p>
      </ProseSection>

      <ProseSection heading="8. Cookies and Browser Controls">
        <p>
          Most browsers allow you to block, delete, or limit cookies through their settings.
          Disabling certain technologies may affect website functionality.
        </p>
        <p>
          Bitplaza does not currently respond to browser “Do Not Track” signals because there is
          not a uniform industry standard for interpreting those signals.
        </p>
        <p>
          Where legally required and technically supported, we will process recognized
          browser-based opt-out preference signals in accordance with applicable law.
        </p>
      </ProseSection>

      <ProseSection heading="9. Data Security">
        <p>
          We use reasonable administrative, technical, and organizational measures designed to
          protect personal information.
        </p>
        <p>
          No website, transmission method, or storage system is completely secure. We therefore
          cannot guarantee that information will never be accessed, disclosed, altered, lost, or
          destroyed without authorization.
        </p>
      </ProseSection>

      <ProseSection heading="10. Children’s Privacy">
        <p>
          Bitplaza is not directed to children under 13, and we do not knowingly collect personal
          information from children under 13.
        </p>
        <p>
          If you believe a child under 13 has provided personal information through the website,
          contact us at <ContactEmail /> so we can investigate and take appropriate action.
        </p>
      </ProseSection>

      <ProseSection heading="11. International Visitors">
        <p>Bitplaza is operated from the United States.</p>
        <p>
          If you access the website from outside the United States, your information may be
          transferred to, stored in, or processed in the United States or other countries where our
          service providers operate. Those jurisdictions may have privacy laws that differ from
          those in your location.
        </p>
        <p>
          Bitplaza is currently intended primarily for a United States audience. We are not
          representing that the pre-launch website is designed to satisfy every jurisdiction’s
          localization or international-transfer requirements.
        </p>
      </ProseSection>

      <ProseSection heading="12. Third-Party Websites">
        <p>
          The website may contain links to third-party websites or services. We do not control and
          are not responsible for their privacy, security, content, or business practices.
        </p>
        <p>Review the applicable third party’s policies before providing information to it.</p>
      </ProseSection>

      <ProseSection heading="13. Changes to This Policy">
        <p>
          We may update this Privacy Policy as Bitplaza develops or as our legal, technical, and
          business practices change.
        </p>
        <p>
          When we make changes, we will update the “Last updated” date. If a change materially
          affects how we handle information already collected, we will provide additional notice
          where required by law.
        </p>
        <p>
          The launch of user accounts, transactions, public profiles, community features, or other
          material platform functionality will require an updated policy describing those
          practices.
        </p>
      </ProseSection>

      <ProseSection heading="14. Contact Us">
        <p>Questions and privacy requests may be sent to:</p>
        <p>
          <strong>Bitcoin Culture Hub</strong>
          <br />
          Operating Bitplaza
          <br />
          Email: <ContactEmail />
          <br />
          Mailing address: <strong>40 N 4th St., Brooklyn, NY 11222</strong>
          <br />
          United States
        </p>
      </ProseSection>
    </ProsePage>
  );
}
