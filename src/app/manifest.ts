import type { MetadataRoute } from "next";

import { SITE } from "@/content/site";
import { THEMES } from "@/lib/design-tokens";

/**
 * Web app manifest (Next metadata file convention, served at /manifest.webmanifest).
 *
 * Colors come from the design tokens, not invented hex: apricot is the
 * signature accent and paper is the light-mode page ground (design.md v3.0 §6).
 * The PNG icons in /public are rendered from src/app/icon.svg — the arch mark,
 * ink on an apricot rounded square, base open.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: THEMES.light.paper,
    theme_color: THEMES.light.apricot,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
