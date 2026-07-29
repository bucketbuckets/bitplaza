/**
 * The problem section.
 *
 * Drawn from `bch/plan.md` §1, which states it better than a marketing rewrite
 * would: the knowledge, the people, the products and the culture all exist, but
 * they are scattered, there is no map, newcomers bounce off, and veterans cannot
 * find the edges of their own scene.
 *
 * The section is written to be recognised rather than agreed with. Nobody needs
 * persuading that their feed is noisy; they need someone to name what is
 * actually wrong with it.
 */
export const PROBLEM = {
  eyebrow: "The problem",
  heading: "Everything you care about exists. None of it is connected.",
  lead: "The people, the projects, the events, the ideas — they are all out there, spread across a hundred feeds, chats and platforms that know nothing about each other.",

  symptoms: [
    {
      id: "feed",
      title: "The feed decides",
      body: "You did not choose most of what fills it. An algorithm optimising for attention did, and attention is not the same thing as interest.",
    },
    {
      id: "scattered",
      title: "Nothing joins up",
      body: "The person worth meeting, the project worth joining and the event worth attending sit on four different platforms. None of them know the others exist.",
    },
    {
      id: "entrance",
      title: "Newcomers bounce off",
      body: "Every community has an entrance. Almost none of them are marked. The people who could point at it are already deep inside and can no longer see it.",
    },
    {
      id: "edges",
      title: "Veterans cannot see the edges",
      body: "Years in, and you still discover things that were there all along. Depth is not the same as coverage, and nobody has the whole map.",
    },
  ],

  /** The turn. This is the central idea from the positioning brief, verbatim. */
  turn: {
    statement: "Your interests should not just fill your feed. They should shape your digital world.",
    support:
      "A plaza is not a feed. It is a place with people in it, paths between them, and somewhere to go next.",
  },
} as const;
