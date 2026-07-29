/**
 * The waitlist district (#waitlist) — the moment of commitment, and the one
 * conversion this site exists for. design.md §18 Form rules: no animation, no
 * characters, labels always visible. §19: buttons say what happens; success
 * states celebrate briefly and say what is next; exclamation marks live in
 * success states and nowhere else.
 */
export const WAITLIST = {
  eyebrow: "Early access",
  heading: "Take your place.",
  lead: "Doors open in waitlist order. Enter now, bring your people, walk in early.",

  form: {
    firstName: { label: "First name", autoComplete: "given-name" },
    email: {
      label: "Your email",
      autoComplete: "email",
      /** A placeholder shaped like an address, so the field cannot be read as
          a second name box (a tester typed their surname into it). */
      placeholder: "you@example.com",
    },
    userType: {
      label: "Which is closest to you?",
      placeholder: "Choose one…",
    },
    primaryGoal: {
      label: "What should Bitplaza help you do first?",
      optionalTag: "optional",
      placeholder: "A sentence is plenty.",
    },
    communitiesLegend: "Your interests",
    communitiesFromSelector: "Carried from your choices above — change them there.",
    consent: {
      label:
        "Email me my place in line and when doors open. Nothing else, no sharing, one-click unsubscribe.",
    },
    submit: "Request early access",
    submitting: "Saving your place…",
    /** aria-label for the honeypot wrapper — humans never see the field. */
    errorSummaryHeading: "The form needs attention",
  },

  success: {
    heading: "You're in!",
    positionLine: (position: number) =>
      `You're number ${position.toLocaleString("en-US")} in line.`,
    emailNote: "A confirmation with your place and your link is on its way to your inbox.",

    duplicateHeading: "You're already in.",
    duplicateLine: (position: number) =>
      `This address holds place ${position.toLocaleString("en-US")} — here's your link again.`,

    share: {
      heading: "Bring your people.",
      support:
        "Every person who joins with your link moves you up the list — and means your people are already inside when you arrive.",
      copy: "Copy your link",
      copied: "Copied!",
      shareOnX: "Share on X",
      nativeShare: "Share…",
      /** The prewritten post. Concrete, first person, no marketing voice. */
      shareText: (referralUrl: string) =>
        `I just took my place on the Bitplaza waitlist — one place for the communities I care about, starting with Bitcoin. Join with my link and we both move up: ${referralUrl}`,
    },

    research: {
      question: "What should Bitplaza help you do first?",
      label: "One question, if you have a minute",
      placeholder: "A sentence is plenty.",
      submit: "Send it",
      thanks: "Noted — this genuinely shapes what gets built first. Thank you.",
    },
  },
} as const;
