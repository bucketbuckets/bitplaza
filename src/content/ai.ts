/**
 * AI as navigation, not spectacle. Three functions, each a specific job with
 * a specific output. The operating principle carries the section: AI
 * proposes, people verify. Nothing here claims omniscience, magic matching,
 * or autonomous governance.
 */
export const AI_SECTION = {
  eyebrow: "AI on the map",
  heading: "Not a chatbot. A way through.",
  lead: "The difficult part is rarely finding more information. It is knowing what matters for you, now.",

  functions: [
    {
      id: "explain",
      title: "Explain the map",
      body: "Summarize a community, subject, or debate at your current level.",
    },
    {
      id: "next-step",
      title: "Find the next step",
      body: "Recommend one useful person, path, project, event, or resource based on your goal.",
    },
    {
      id: "improve",
      title: "Improve the map",
      body: "Draft missing entries and flag outdated information for community review.",
    },
  ],

  principle: "AI proposes. People verify.",
  control:
    "You decide what is personalized, stored, published, or shared. Nothing happens to your data without you asking for it.",
} as const;
