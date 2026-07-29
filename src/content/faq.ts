/**
 * FAQ.
 *
 * These are the questions this audience actually asks, in the order they ask
 * them, and the answers are written to survive someone who then goes and checks.
 * The monetisation, licensing and data answers are bound by the positioning
 * resolved in `docs/00-audit-and-architecture.md` §9.1 — they must not drift
 * from `/data`, from the open-infrastructure section, or from each other.
 *
 * Two things are deliberately not claimed anywhere below: a launch date, and a
 * foundation that has not been formed. `bch/plan.md` §12 leaves both open, and
 * inventing either is the kind of detail that gets found.
 *
 * `id` is stable and is what the `faq_opened` analytics event reports, so
 * renaming one breaks the continuity of that metric. Rewrite the question text
 * freely; leave the id alone.
 */
export const FAQ_SECTION = {
  eyebrow: "Questions",
  heading: "The things you are probably about to ask.",
} as const;

export const FAQ = [
  {
    id: "what-is-it",
    question: "What is Bitplaza, in one sentence?",
    answer:
      "A map of the communities you care about — the people, projects, events, organisations and ideas inside them — with a profile that travels between them and AI that helps you find your way through.",
  },
  {
    id: "social-network",
    question: "Is this a social network?",
    answer:
      "No. There is no timeline and nothing is ranked by engagement. The unit is a community and its structure, not a stream of posts. Conversation attaches to things on the map rather than replacing it.",
  },
  {
    id: "money",
    question: "How do you make money?",
    answer:
      "The map is open and belongs to everyone. The tools built on top of it — identity, reputation, matching, the things that help you act on what you find — are what sustains the work. What that rules out permanently: no advertising, no paid placement, no selling personal data. Anything we ever publish about usage will be aggregate patterns, never one person's behaviour.",
  },
  {
    id: "open-source",
    question: "Is it open source?",
    answer:
      "Yes. The code is AGPL-3.0 and the content is CC BY-SA. That means you can read exactly what gets logged and where it goes, contributors keep credit, and anyone can hold a copy of the map. We would rather be checked than believed.",
  },
  {
    id: "data",
    question: "What do you actually collect?",
    answer:
      "From the waitlist: what you typed in the form. From reading the site: anonymous usage, with no cookies and an identifier that dies with the tab. No session recording, no profile, no selling. There is a switch in the footer that turns measurement off and changes nothing else, and Do Not Track is honoured without you doing anything.",
  },
  {
    id: "why-bitcoin",
    question: "Why start with Bitcoin?",
    answer:
      "Because it is deep enough to get properly lost in, badly fragmented, and the community whose culture this grew out of. It is the hardest case, which makes it the right first one. The architecture underneath is not Bitcoin-specific.",
  },
  {
    id: "crypto",
    question: "Do I need to know anything about Bitcoin to use it?",
    answer:
      "No. Bitcoin is the first plaza, not a requirement. If your communities are design, music, collecting or your own neighbourhood, none of that touches you.",
  },
  {
    id: "my-community",
    question: "My community is not on your list. Can I still join?",
    answer:
      "Yes — tell us what it is when you sign up. The ten on this page are where we are starting, not the boundary. If you run a community rather than belong to one, there is a separate application, and we read those closely.",
  },
  {
    id: "when",
    question: "When does it open?",
    answer:
      "We are not announcing a date we might miss. Bitcoin Culture Hub opens first, in stages, and waitlist members go in ahead of everyone else. You will hear from us when there is something real to look at, and not much in between.",
  },
  {
    id: "who-owns",
    question: "What happens if you get bought, or give up?",
    answer:
      "It is a fair question and the honest answer is structural rather than reassuring. The content is openly licensed and mirrored as signed events on open protocols, so the map can outlive us and communities can take theirs elsewhere. Governance meant to make that binding is still being settled, and we will say what it is when it is real.",
  },
] as const;
