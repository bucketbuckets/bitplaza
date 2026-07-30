/**
 * /communities — the conversion page for community leaders. The reader
 * already runs something and is tired; the page assumes competence, shows
 * what a map does operationally, and asks only what a human reviewer needs
 * to say yes.
 */
export const COMMUNITIES_PAGE = {
  meta: {
    title: "Map your community",
    description:
      "Give your community one open, navigable map of its people, knowledge, events, projects, and opportunities. We are starting with a small number of communities and helping each one launch properly.",
  },

  eyebrow: "For community leaders",
  heading: ["You built the community.", "We help you map it."],
  lead: "A map gives the community you already run one shared place for its people, events, projects, and knowledge, kept current by the members themselves. It works for ecosystems, schools, clubs, conferences, open-source projects, and professional networks.",

  note: "We are starting with a small number of communities and helping each one launch properly.",

  form: {
    heading: "The application",
    intro: "Short on purpose. A person reads every one, and we reply either way.",
    firstName: { label: "First name", autoComplete: "given-name" },
    email: { label: "Your email", autoComplete: "email", placeholder: "you@example.com" },
    communityName: { label: "What is your community called?" },
    communitySize: { label: "Roughly how many people?", placeholder: "Choose one…" },
    website: { label: "Community website or primary link", optionalTag: "optional" },
    currentTools: {
      label: "Where does it live today?",
      hint: "The tools you actually use, separated by commas: Discord, a newsletter, a spreadsheet…",
    },
    primaryProblem: {
      label: "What is your biggest onboarding or navigation problem?",
    },
    plazaVision: {
      label: "If the map existed, what would it make possible?",
      optionalTag: "optional",
    },
    consentNote:
      "We will email you about this application and your place on the waitlist. Nothing else, no sharing, one-click unsubscribe.",
    submit: "Send the application",
    submitting: "Sending…",
    errorSummaryHeading: "The application needs attention",
  },

  success: {
    heading: "We got it!",
    body: "Your application is in, and a person will read it. Allow a few days.",
    positionLine: (position: number) =>
      `While you wait, you hold place ${position.toLocaleString("en-US")} in line.`,
  },
} as const;
