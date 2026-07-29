import { ROUTES } from "./site";

/**
 * The final conversion section. Two clear pathways restated, then the email
 * capture, which asks for a goal before an address.
 */
export const CLOSING_SECTION = {
  eyebrow: "Get started",
  /** Manually broken display headline. */
  heading: ["Start with Bitcoin.", "Build for every community."],
  primaryCta: { label: "Explore Bitcoin", href: ROUTES.bitcoin },
  secondaryCta: { label: "Map your community", href: ROUTES.communities },
} as const;
