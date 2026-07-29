/**
 * The product distinction: a feed keeps you scrolling, a path gets you
 * somewhere. Three representative paths lead; the rest sit behind a
 * restrained disclosure. Every path names a real outcome, not a topic.
 */
export const PATHS_SECTION = {
  eyebrow: "Paths, not feeds",
  /** Manually broken display headline. */
  heading: ["A feed keeps you scrolling.", "A path gets you somewhere."],
  lead: "Choose what you are trying to do. Bitplaza helps you understand the community, find the right people and resources, and take a concrete next step.",
  moreLabel: "View all paths",
  lessLabel: "Show fewer paths",
} as const;

export interface Path {
  id: string;
  name: string;
  /** The checkable end-state. Every path ends somewhere you can point at. */
  outcome: string;
}

/** The three shown first. */
export const FEATURED_PATHS: readonly Path[] = [
  {
    id: "understand",
    name: "Understand Bitcoin",
    outcome: "Ends when you can explain the monetary argument clearly.",
  },
  {
    id: "first-bitcoin",
    name: "Secure your first bitcoin",
    outcome: "Ends when you hold a small amount yourself.",
  },
  {
    id: "contribute",
    name: "Make a contribution",
    outcome: "Ends when you submit your first contribution or application.",
  },
] as const;

/** Revealed by the "View all paths" control. */
export const MORE_PATHS: readonly Path[] = [
  {
    id: "node",
    name: "Run your own node",
    outcome: "Ends with a running, synced, verifying node.",
  },
  {
    id: "local",
    name: "Find a local community",
    outcome: "Ends when you have been to a meetup near you.",
  },
  {
    id: "build",
    name: "Build on Bitcoin",
    outcome: "Ends when you ship something others can use.",
  },
  {
    id: "work",
    name: "Find work",
    outcome: "Ends when you apply for a role that fits what you can do.",
  },
  {
    id: "custody",
    name: "Learn self-custody",
    outcome: "Ends when your keys are yours, with a recovery plan.",
  },
] as const;
