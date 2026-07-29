/**
 * The waitlist (#waitlist): the one conversion this site exists for.
 *
 * The initial ask is deliberately small: a goal and an email. Everything else
 * is requested after submission, per path, and stays optional. Buttons say
 * what happens; the success state celebrates briefly and says what is next;
 * exclamation marks live in success states and nowhere else.
 */
export const WAITLIST = {
  eyebrow: "Early access",
  heading: "Get early access.",
  lead: "Tell us what you want to do, leave your email, and you are in line.",

  form: {
    goal: {
      legend: "What do you want to do?",
    },
    email: {
      label: "Your email",
      autoComplete: "email",
      /** Shaped like an address so the field cannot be read as a name box. */
      placeholder: "you@example.com",
    },
    /** Visible consent note. Submitting is the consent; no checkbox to tick. */
    consentNote:
      "We will email your place in line and when doors open. Nothing else, no sharing, one-click unsubscribe.",
    submit: "Get early access",
    submitting: "Saving your place…",
    errorSummaryHeading: "The form needs attention",
  },

  success: {
    heading: "You're in!",
    positionLine: (position: number) =>
      `You're number ${position.toLocaleString("en-US")} in line.`,
    emailNote: "A confirmation with your place and your link is on its way to your inbox.",

    duplicateHeading: "You're already in.",
    duplicateLine: (position: number) =>
      `This address holds place ${position.toLocaleString("en-US")}. Here is your link again.`,

    /** Shown when the chosen goal was mapping a community. */
    leaderNext: {
      heading: "Tell us about your community",
      body: "A short application helps us launch the right maps first. A person reads every one.",
      cta: { label: "Open the application", href: "/communities#apply" },
    },

    share: {
      heading: "Bring your people.",
      support:
        "Every person who joins with your link moves you up the list, and means your people are already inside when you arrive.",
      copy: "Copy your link",
      copied: "Copied!",
      shareOnX: "Share on X",
      nativeShare: "Share…",
      /** The prewritten post. Concrete, first person, no marketing voice. */
      shareText: (referralUrl: string) =>
        `I joined the Bitplaza waitlist. One open map of the Bitcoin community: the people, knowledge, events, and opportunities, connected. Join with my link and we both move up: ${referralUrl}`,
    },

    research: {
      question: "What should Bitplaza help you do first?",
      label: "One question, if you have a minute",
      placeholder: "A sentence is plenty.",
      submit: "Send it",
      thanks: "Noted. This genuinely shapes what gets built first. Thank you.",
    },
  },
} as const;
