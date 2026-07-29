import { BitcoinHub } from "@/components/sections/bitcoin-hub";
import { CommunityBuilders } from "@/components/sections/community-builders";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { OpenInfrastructure } from "@/components/sections/open-infrastructure";
import { Pillars } from "@/components/sections/pillars";
import { Problem } from "@/components/sections/problem";
import { UseCases } from "@/components/sections/use-cases";
import { FaqSchema } from "@/components/seo/faq-schema";
import { OrganizationSchema } from "@/components/seo/organization-schema";

/**
 * The landing page.
 *
 * A server component composing sections in the brief's order. Bands alternate
 * ground and surface so the page reads as a sequence of places rather than one
 * long scroll — the spatial metaphor doing structural work.
 *
 * Still to land in Stage 4, in their marked positions: the "What would your
 * Bitplaza look like?" interest selector (#plaza-builder, between Pillars and
 * BitcoinHub) and the segmented waitlist (#waitlist, between CommunityBuilders
 * and Faq).
 */
export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <FaqSchema />

      <Hero />
      <Problem />
      <Pillars />
      {/* Stage 4 — <PlazaBuilder /> */}
      <BitcoinHub />
      <UseCases />
      <OpenInfrastructure />
      <CommunityBuilders />
      {/* Stage 4 — <Waitlist /> */}
      <Faq />
    </>
  );
}
