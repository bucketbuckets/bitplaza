/**
 * Practical AI use cases.
 *
 * Written deliberately flat. This audience has read a great deal of AI copy and
 * discounts all of it, so every item here is phrased as a specific job with a
 * specific output — the kind of claim that can be checked once the product
 * exists, rather than the kind that cannot be wrong.
 *
 * Each maps to something `bch/plan.md` already specifies: semantic neighbours
 * from pgvector, the next-hop rule, the ingest and enrichment pipeline, the
 * Opportunity Engine bridge, and the aggregate demand map. Nothing here
 * describes a capability the architecture does not account for.
 *
 * The words "agent", "copilot" and "magic" do not appear, and should not.
 */
export const USE_CASES_SECTION = {
  eyebrow: "What the AI actually does",
  heading: "Not a chatbot. A way through.",
  lead: "The hard part of a community is never that information is missing. It is that nobody can tell you which part of it is for you, today. That is the job.",
} as const;

export const USE_CASES = [
  {
    id: "orient",
    title: "Understand a community in an afternoon",
    body: "Ask what matters in a territory and get its people, ideas and organisations laid out by how deep they sit — not a ranked list of links.",
  },
  {
    id: "people",
    title: "Find the handful of people worth knowing",
    body: "Matched on what you have done and what you are trying to do next, from a community you have just entered.",
  },
  {
    id: "next",
    title: "Know what to read next, and why",
    body: "Every page ends with one deliberate suggestion, chosen from where you are and how far in you have gone. Not a related-posts widget.",
  },
  {
    id: "opportunity",
    title: "Surface the opportunity you would have missed",
    body: "Open roles, grants, projects looking for contributors and events worth the trip — attached to the part of the map they belong to.",
  },
  {
    id: "gaps",
    title: "Show the community its own gaps",
    body: "Where people arrive, where they stall, and which subjects have real demand and nothing good written about them yet.",
  },
  {
    id: "draft",
    title: "Draft the map, so people can correct it",
    body: "Machines assemble candidate entries at a scale no volunteer can. People decide what is true and what belongs. That order does not reverse.",
  },
] as const;
