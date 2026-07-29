import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Bitplaza's privacy policy.",
  robots: { index: false, follow: true },
};

/**
 * An honest placeholder.
 *
 * A privacy policy is a binding legal document and inventing one would be worse
 * than not having one — it would state commitments nobody has reviewed and
 * create obligations nobody has agreed to. So this page says what is true today
 * and points at /data, which describes the actual behaviour and is enforced in
 * code. `noindex` until counsel has signed off on the real thing.
 */
export default function PrivacyPage() {
  return (
    <ProsePage eyebrow="Legal" title="Privacy" updated="2026-07-29">
      <p>
        <strong>
          This policy has not yet been reviewed by counsel, and we are not going to publish one that
          has not been.
        </strong>{" "}
        Writing a plausible-looking policy would create commitments nobody has agreed to, which is
        worse than saying where we actually are.
      </p>

      <ProseSection heading="What you can rely on today">
        <p>
          <Link href={ROUTES.data}>What we collect</Link> describes exactly what this site records,
          in plain language. It is accurate, and every claim in it corresponds to something you can
          find in the source: the list of events we send, the analytics configuration, and the
          opt-out.
        </p>
        <p>
          Until the reviewed policy is published, treat that page as the operative description of
          what happens to your data.
        </p>
      </ProseSection>

      <ProseSection heading="What is still outstanding">
        <ul>
          <li>Legal review and publication of the full policy.</li>
          <li>The named data controller, which depends on a corporate structure still being settled.</li>
          <li>Data-retention periods, stated per category.</li>
          <li>The list of processors we rely on, and where each stores data.</li>
          <li>The formal process for access, correction and deletion requests.</li>
        </ul>
      </ProseSection>

      <ProseSection heading="In the meantime">
        <p>
          Email us to see what we hold about you or to have it deleted, and we will do it. That
          applies now, not from whenever the policy is published.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
