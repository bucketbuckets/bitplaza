import { Hero } from "@/components/sections/hero";

/**
 * The landing page.
 *
 * A server component composing section components in the brief's order. Only
 * the hero exists at Stage 2; the remaining eleven bands land in Stage 3 and
 * slot in here without touching anything else.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}
