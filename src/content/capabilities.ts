/**
 * What users can do. Four capabilities, one sentence each. This section
 * answers exactly one question: "what can I do here?"
 */
export const CAPABILITIES_SECTION = {
  eyebrow: "What you can do",
  heading: "One map, four ways in.",
} as const;

export const CAPABILITIES = [
  {
    id: "understand",
    title: "Understand",
    body: "See the people, ideas, organizations, and language that shape the community.",
  },
  {
    id: "navigate",
    title: "Navigate",
    body: "Move through topics and paths based on your current level and goal.",
  },
  {
    id: "connect",
    title: "Connect",
    body: "Find people, projects, events, and opportunities relevant to you.",
  },
  {
    id: "contribute",
    title: "Contribute",
    body: "Improve the map and build portable proof of meaningful work.",
  },
] as const;
