/**
 * /bitcoin — the Bitcoin Culture Hub's own page. The space that drives
 * traffic from Bitplaza into the first plaza.
 *
 * OWNER NOTE: the specific launch material (real entries, dates, links to the
 * live hub once it has a URL) is coming later — swap it in HERE, in this
 * file, not in the components. Everything below is structural and honest as
 * written: taxonomy and paths are decided (bch/verticals/bitcoin.md), entry
 * counts are deliberately never quoted before the seed sprint has run.
 *
 * This is the one page where Bitcoin's colour leads (design.md §16 district 7
 * / §8): as accents and marks, never as a ground behind text.
 */
export const BITCOIN_HUB_PAGE = {
  meta: {
    title: "Bitcoin Culture Hub — the first plaza",
    description:
      "One map of Bitcoin's people, projects, events, learning and work — every entry placed, marked for depth, and connected to what you should do next. The first plaza on Bitplaza.",
  },

  hero: {
    eyebrow: "The first plaza",
    status: "Live first — the plaza Bitplaza opens with",
    heading: "Bitcoin Culture Hub",
    /** The community's own line, from bch/verticals/bitcoin.md. */
    tagline: "The map of the rabbit hole.",
    supporting:
      "Bitcoin's culture is the deepest on the internet — and the most scattered. The Culture Hub puts its people, projects, events, learning and work on one connected map, so wherever you are in the rabbit hole, you can see where to go next.",
    primaryCta: { label: "Get early access", href: "/#waitlist" },
    secondaryCta: { label: "How Bitplaza works", href: "/#pillars" },
  },

  /** design.md district 7's seven kinds of entry. Structure, not inventory —
      no counts until the map has the entries to count. */
  inside: {
    heading: "What the map holds",
    body: "Seven kinds of entry, all connected. Nothing lives in a silo — a person links to their projects, a project to its events, an event to what to read first.",
    categories: [
      { id: "people", name: "People", scope: "Builders, artists, educators, organizers — found by what they do" },
      { id: "communities", name: "Communities", scope: "Meetups, collectives and circles with open doors" },
      { id: "events", name: "Events", scope: "From conferences to the meetup near you, with real dates" },
      { id: "learning", name: "Learning", scope: "The canon and the on-ramps, marked for depth" },
      { id: "work", name: "Work", scope: "Jobs, bounties and open roles across the ecosystem" },
      { id: "collectibles", name: "Collectibles", scope: "Art, artifacts and the market around them" },
      { id: "projects", name: "Projects", scope: "What's being built, and where to jump in" },
    ],
  },

  closing: {
    heading: "Be there when the doors open.",
    body: "The hub opens to the waitlist in order. Enter now, and arrive with your people already inside.",
    cta: { label: "Request early access", href: "/#waitlist" },
  },
} as const;
