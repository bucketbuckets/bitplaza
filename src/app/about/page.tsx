import type { Metadata } from "next";
import Link from "next/link";

import { ProsePage, ProseSection } from "@/components/layout/prose-page";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Bitplaza exists, what stage it is at, and how to reach the team. The mission: every community deserves a map.",
};

/**
 * /about — mission, team, current stage. Short and honest: nothing here
 * asserts a founding story, headcount, or funding that has not been
 * confirmed. The owner extends this page with real facts as they become
 * public.
 */
export default function AboutPage() {
  return (
    <ProsePage eyebrow="About" title="Every community deserves a map." updated="2026-07-29">
      <ProseSection heading="The mission">
        <p>
          Every deep community has the same problem. Its knowledge, people, projects, events, and
          opportunities exist, but they are scattered across chats, feeds, documents, and event
          pages that know nothing about each other. Newcomers bounce off. Veterans cannot see the
          edges of their own scene. The people who could point at the entrance are already inside.
        </p>
        <p>
          Bitplaza builds the map: one open, navigable place where a community&apos;s parts are
          connected, marked for depth, and lead to a concrete next step. A feed keeps you
          scrolling. A path gets you somewhere.
        </p>
      </ProseSection>

      <ProseSection heading="Where it starts">
        <p>
          The first map covers Bitcoin: deep enough to get properly lost in, badly fragmented, and
          the community this work grew out of. It is the hardest case, which makes it the right
          first one. The system underneath is not Bitcoin-specific, and community leaders can{" "}
          <Link href={ROUTES.communities}>apply to map their own</Link>.
        </p>
      </ProseSection>

      <ProseSection heading="The team">
        <p>
          Bitplaza is built by a small independent team. We would rather show working software than
          introduce ourselves at length, so this section will grow as the product does. If you want
          to talk to us, write to{" "}
          <a href="mailto:team@houseofnaka.com">team@houseofnaka.com</a>.
        </p>
      </ProseSection>

      <ProseSection heading="Current stage">
        <p>
          Today, Bitplaza is this site, a waitlist, and the Bitcoin map being seeded. The numbers
          in the previews are illustrative and labeled as such. The map opens to the waitlist in
          stages, and we are working with a small number of communities to launch their maps
          properly. How the openness commitments are structured is on{" "}
          <Link href={ROUTES.open}>the open page</Link>.
        </p>
      </ProseSection>
    </ProsePage>
  );
}
