export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "bp-theme";

/**
 * The theme preference, modelled as an external store.
 *
 * It genuinely is one: the value lives in localStorage and on the `data-theme`
 * attribute, both outside React, and it can change in another tab. Reading it
 * with `useSyncExternalStore` rather than a `mounted` flag plus an effect gives
 * correct hydration for free, and avoids the cascading render that the
 * mounted-flag pattern causes on every single page load.
 */

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  // `storage` covers the other-tab case; `emit` covers this one.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getThemeMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    // Private mode, or storage blocked. "system" is a correct answer, not a
    // fallback — it is what the page is actually doing.
    return "system";
  }
}

/** On the server nobody has expressed a preference yet. */
export function getServerThemeMode(): ThemeMode {
  return "system";
}

export function setThemeMode(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);

  try {
    if (mode === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* the attribute is already set, so the choice applies for this page view */
  }

  emit();
}

/**
 * Runs before first paint. Does two things, both of which must happen before
 * anything is drawn:
 *
 *   1. Applies the stored theme. Any React-based approach runs after hydration,
 *      which means a light flash on every load for anyone who chose dark — the
 *      most noticeable bug a theme system can ship.
 *   2. Marks the document as script-capable with `js` on <html>. That class is
 *      what allows the reveal styles to hide content; without it everything
 *      stays visible. Setting it here rather than in React is what keeps the
 *      no-JS page readable and stops content flashing in and back out.
 */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t)}}catch(e){}})();`;
