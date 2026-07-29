/**
 * Bitcoin Culture Hub — the first plaza.
 *
 * Everything here is taken from `bch/verticals/bitcoin.md`: the tagline, the
 * twelve domains, the depth labels, and the six launch paths with their real
 * end-states. None of it is invented, which matters — this is the section a
 * Bitcoiner will read most sceptically, and specificity is the only thing that
 * survives that reading.
 *
 * Framing note: these are described as what the first plaza *contains*, in the
 * present tense, because the taxonomy is decided. The number of published
 * entries is not stated anywhere on this page. `plan.md` §9's coverage gate is
 * explicit that a thin domain ships as "coming soon" rather than looking
 * abandoned, and quoting a count before the seed sprint has run would be
 * exactly the kind of claim that gets checked.
 */
export const BITCOIN_HUB = {
  eyebrow: "The first plaza",
  heading: "Bitcoin Culture Hub",
  tagline: "The map of the rabbit hole.",
  lead: "Bitcoin is where Bitplaza starts — the deepest, most fragmented community we know, and the one whose culture the platform grew out of. It is the first plaza, not the only one.",

  /** From bitcoin.md §2. Twelve, with the boundary each one holds. */
  domains: [
    { id: "origins", name: "Origins & Philosophy", scope: "Where it came from, and why it matters" },
    { id: "protocol", name: "The Protocol", scope: "How the machine works" },
    { id: "building", name: "Building on Bitcoin", scope: "Tools and paths for people who write code" },
    { id: "mining", name: "Mining & Energy", scope: "Hashrate, hardware, power" },
    { id: "layers", name: "Layers & Payments", scope: "Moving value: L2s and merchant tooling" },
    { id: "custody", name: "Self-Custody & Privacy", scope: "Keeping your coins yours" },
    { id: "money", name: "Money & Markets", scope: "The financial layer" },
    { id: "art", name: "Art & Expression", scope: "Bitcoin as culture, not tech" },
    { id: "media", name: "Media & Education", scope: "How people learn" },
    { id: "place", name: "Community & Place", scope: "Bitcoin in the physical world" },
    { id: "freedom", name: "Freedom & Policy", scope: "The fight" },
    { id: "work", name: "Work & Builders", scope: "People, companies, careers" },
  ],

  /** From bitcoin.md §1 — the community's own vernacular, not generic levels. */
  depth: {
    heading: "Three depths, in the community's own words",
    body: "Every part of the map is marked for how far in it sits, so you can start where you actually are and go deeper on purpose.",
    levels: [
      { id: "l1", label: "Curious", meaning: "Assumes nothing. Explains itself." },
      { id: "l2", label: "Down the hole", meaning: "Assumes you know what a block and a private key are." },
      { id: "l3", label: "Deep water", meaning: "Technical, specialist, or years in." },
    ],
  },

  /** From bitcoin.md §4. Each one has a concrete, checkable end-state. */
  paths: {
    heading: "Six routes through it",
    body: "A path is a way across the map, not a course. Each one ends somewhere you can point at.",
    items: [
      { id: "day-one", name: "Day One", end: "You own a small amount, held yourself" },
      { id: "why", name: "Why Bitcoin?", end: "You can explain the monetary argument to someone else" },
      { id: "node", name: "Run Your Own Node", end: "A running, synced, verifying node" },
      { id: "builder", name: "The Builder's On-Ramp", end: "A first contribution or job application" },
      { id: "custody", name: "Sovereign Custody", end: "Multisig, with an inheritance plan" },
      { id: "people", name: "Find Your People", end: "You went to a local meetup" },
    ],
  },

  /** The honest framing of what "first" means, per the positioning decision. */
  closing:
    "The architecture underneath is not Bitcoin-specific. The same map works for any community deep enough to get lost in — which is why Bitcoin is the first plaza rather than the whole product.",

  /** design.md district 7's one action. Routes to the hub's own page. */
  cta: { label: "Explore the first plaza", href: "/bitcoin" },
} as const;
