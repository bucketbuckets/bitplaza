/**
 * /for-community-builders — the leader flow. design.md §17 "Start a plaza":
 * a workshop, warm and encouraging, form-led. The reader already runs
 * something and is tired; the form asks only what a human reviewer needs to
 * say yes.
 */
export const COMMUNITY_BUILDERS_PAGE = {
  meta: {
    title: "Bring your community",
    description:
      "Apply to build a plaza for your community on Bitplaza. A short application, read by a person — we're taking a small number of communities alongside Bitcoin.",
  },

  eyebrow: "For community leaders",
  heading: "Bring your community.",
  lead: "A plaza gives the community you already run one home for its people, events, projects and knowledge — built to be handed to the people in it. This is a short application, and a person reads every one.",

  honesty:
    "We're taking a small number of communities alongside Bitcoin, and we would rather do a few properly. If yours isn't a fit yet, you keep your place on the waitlist either way.",

  form: {
    heading: "The application",
    firstName: { label: "First name", autoComplete: "given-name" },
    email: { label: "Email", autoComplete: "email" },
    communityName: { label: "What is your community called?" },
    communitySize: { label: "How many people?", placeholder: "Choose one…" },
    currentTools: {
      label: "Where does it live today?",
      hint: "The tools you actually use, separated by commas — Discord, a newsletter, a spreadsheet…",
    },
    primaryProblem: {
      label: "What is the most tiring part of running it?",
    },
    plazaVision: {
      label: "If your plaza existed, what would it make possible?",
    },
    website: { label: "A link, if there is one", optionalTag: "optional" },
    consent: {
      label:
        "Email me about this application and my place on the waitlist. Nothing else, no sharing, one-click unsubscribe.",
    },
    submit: "Send the application",
    submitting: "Sending…",
    errorSummaryHeading: "The application needs attention",
  },

  success: {
    heading: "We got it!",
    body: "Your application is in, and a person will read it — allow a few days. A confirmation is on its way to your inbox, along with your place on the waitlist.",
    positionLine: (position: number) =>
      `While you wait, you hold place ${position.toLocaleString("en-US")} in line.`,
  },
} as const;
