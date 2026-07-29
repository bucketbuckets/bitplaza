/**
 * Portable identity and open infrastructure.
 *
 * This is where Nostr, licensing and the data commitment are allowed to appear.
 * The brief is explicit that they must not lead — nobody arrives wanting to hear
 * about a protocol — but this audience will go looking, and a page that has
 * nothing to say when they do has failed a different test.
 *
 * Every claim here is committed to somewhere in `bch/plan.md` §1.4: AGPL-3.0
 * for the code, CC BY-SA for the dataset, signed Nostr events for portability,
 * aggregate-only externally, no ads and no paid placement.
 *
 * The governance sentence is deliberately in the future tense. `plan.md` §12
 * action 2 has the corporate structure open, and describing a foundation that
 * has not been formed is precisely the detail this audience checks.
 */
export const OPEN_INFRA_SECTION = {
  eyebrow: "How it is built",
  heading: "The map belongs to everyone.",
  lead: "A public directory that can be taken away is not a public directory. So the parts that would hurt to lose are the parts we do not hold on to.",
} as const;

export const OPEN_INFRA = [
  {
    id: "portable",
    title: "Your identity is yours",
    body: "Your profile, your contributions and the reputation attached to them are portable. You can take them somewhere else, and you do not need our permission or our servers to prove they are yours.",
  },
  {
    id: "open-data",
    title: "The content is openly licensed",
    body: "Entries are published under CC BY-SA. Contributors keep credit, the dataset stays open, and anyone can hold a copy — which is what makes calling it a public repository a fact rather than a slogan.",
  },
  {
    id: "open-code",
    title: "The code is open",
    body: "AGPL-3.0. You can read exactly what is logged, when, and where it goes — including the parts about you. We would rather be checked than believed.",
  },
  {
    id: "published",
    title: "Entries are published as signed events",
    body: "Mirrored to open protocols so the map survives us. Not a growth channel — a guarantee that handing a plaza over to its community is structural rather than a promise.",
  },
] as const;

/** The commercial position, stated plainly. Resolved in docs §9.1. */
export const OPEN_INFRA_MODEL = {
  heading: "So how does this work as a business?",
  body: [
    "The map is open and belongs to everyone. The tools built on top of it — identity, reputation, matching, the things that help you actually do something with what you find — are how the company sustains the work of building them.",
    "What that rules out, permanently: no advertising, no paid placement, and no selling of personal data. Anything we ever publish about how people use Bitplaza will be aggregate — patterns across many people, never one person's behaviour.",
    "The governance structure meant to hold that commitment is still being settled. We would rather say so than describe an arrangement that does not exist yet.",
  ],
} as const;
