/**
 * Structured mock data for the hero's interactive map preview.
 *
 * Entirely frontend-driven, deliberately small, and honest: the visible
 * disclaimer marks everything here as illustrative. No entry names a real
 * person, and no number pretends to be live. When the real map has public
 * data, this file is replaced by it.
 *
 * Choosing a goal highlights one territory, one path, one person, one
 * resource, and one action, and updates the "Your next step" panel.
 */

export const MAP_PREVIEW = {
  label: "What are you here to do?",
  disclaimer: "Illustrative preview of the Bitcoin map",
  nextStepHeading: "Your next step",
} as const;

export interface PreviewGoal {
  id: string;
  label: string;
  /** Territory ids from hub-preview.ts, in display order. One is highlighted. */
  highlightedTerritory: string;
  /** The path (src/content/paths.ts id) this goal walks. For analytics. */
  pathId: string;
  person: { role: string; note: string };
  resource: { name: string; kind: string };
  action: { name: string; kind: string };
  nextStep: {
    title: string;
    meta: string;
    endsWhen: string;
  };
}

export const PREVIEW_GOALS: readonly PreviewGoal[] = [
  {
    id: "learn",
    label: "Learn",
    highlightedTerritory: "origins",
    pathId: "understand",
    person: { role: "An educator", note: "answers Start-level questions" },
    resource: { name: "How Bitcoin works", kind: "Path" },
    action: { name: "Annotated whitepaper reading", kind: "Resource" },
    nextStep: {
      title: "Start “How Bitcoin works”",
      meta: "20 minutes · Start level",
      endsWhen: "Ends when you can explain transactions, blocks, and custody in plain language.",
    },
  },
  {
    id: "build",
    label: "Build",
    highlightedTerritory: "protocol",
    pathId: "contribute",
    person: { role: "A protocol engineer", note: "reviews first contributions" },
    resource: { name: "The builder's on-ramp", kind: "Path" },
    action: { name: "A project seeking contributors", kind: "Project" },
    nextStep: {
      title: "Start “The builder's on-ramp”",
      meta: "3 sessions · Explore level",
      endsWhen: "Ends when you submit your first contribution to a real project.",
    },
  },
  {
    id: "meet",
    label: "Meet people",
    highlightedTerritory: "community",
    pathId: "local",
    person: { role: "A meetup organizer", note: "welcomes newcomers monthly" },
    resource: { name: "Find a local community", kind: "Path" },
    action: { name: "A meetup near you this month", kind: "Event" },
    nextStep: {
      title: "Start “Find a local community”",
      meta: "1 evening · Start level",
      endsWhen: "Ends when you have been to a meetup and know who to talk to next.",
    },
  },
  {
    id: "work",
    label: "Find work",
    highlightedTerritory: "work",
    pathId: "work",
    person: { role: "A hiring founder", note: "lists open roles on the map" },
    resource: { name: "Where your skills fit", kind: "Path" },
    action: { name: "An open role matching your goal", kind: "Opportunity" },
    nextStep: {
      title: "Start “Where your skills fit”",
      meta: "45 minutes · Explore level",
      endsWhen: "Ends when you apply for a role or bounty that fits what you can do.",
    },
  },
] as const;

export type PreviewGoalId = (typeof PREVIEW_GOALS)[number]["id"];
