import { ROUTES } from "./site";

/**
 * The open-architecture section. Three plain-language promises, each one the
 * homepage version of a claim /open states precisely. Technical detail
 * (licenses, protocols, governance stages) lives on /open, not here.
 *
 * REPO RULE: a "View the code" action appears only when it links to a real
 * public repository. `repoUrl` is null until the repository is public; the
 * component must render nothing for it while it is null. Never a dead link.
 */
export const OPEN_SECTION = {
  eyebrow: "Open by design",
  heading: "The map belongs to the community.",

  promises: [
    {
      id: "identity",
      title: "Your identity is portable",
      body: "Take your profile, contributions, and reputation with you.",
    },
    {
      id: "knowledge",
      title: "Community knowledge is open",
      body: "Export, reuse, mirror, and improve the map beyond Bitplaza.",
    },
    {
      id: "code",
      title: "The code is public",
      body: "Inspect it, contribute to it, or run it independently.",
    },
  ],

  architectureCta: { label: "View the architecture", href: ROUTES.open },
  /** Set to the public repository URL when it exists. Null renders nothing. */
  repoUrl: null as string | null,
  repoCtaLabel: "View the code",
} as const;
