import { AiNavigation } from "@/components/sections/ai-navigation";
import { Capabilities } from "@/components/sections/capabilities";
import { Closing } from "@/components/sections/closing";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { HubPreview } from "@/components/sections/hub-preview";
import { Leaders } from "@/components/sections/leaders";
import { OpenArchitecture } from "@/components/sections/open-architecture";
import { Paths } from "@/components/sections/paths";
import { Platforms } from "@/components/sections/platforms";
import { FaqSchema } from "@/components/seo/faq-schema";
import { OrganizationSchema } from "@/components/seo/organization-schema";

/**
 * The landing page: one narrative in nine bands.
 *
 * The community exists (hero, with the product shown) → paths beat feeds →
 * what you can do → the platforms that do it → the first map → AI as
 * navigation → the leader offer → the map stays open → the two pathways and
 * the email capture, then the FAQ. Every band proves part of that narrative
 * or it is not here.
 */
export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <FaqSchema />

      <Hero />
      <Paths />
      <Capabilities />
      <Platforms />
      <HubPreview />
      <AiNavigation />
      <Leaders />
      <OpenArchitecture />
      <Closing />
      <Faq />
    </>
  );
}
