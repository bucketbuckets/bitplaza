import type { Page } from "@playwright/test";

/**
 * Keyboard-only navigation helpers. The funnel specs never click: everything
 * is Tab / Shift+Tab / Enter / Space / Arrows, because a funnel a keyboard
 * cannot finish is a funnel some people cannot finish.
 */

export interface FocusStop {
  tag: string;
  id: string;
  /** input type ("radio", "email", …); empty for non-inputs. */
  type: string;
  /** form control name; empty for non-controls. */
  name: string;
  text: string;
}

/** A snapshot of whatever currently holds focus, or null for <body>/none. */
export async function focusedElement(page: Page): Promise<FocusStop | null> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const input = el as HTMLInputElement;
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id ?? "",
      type: typeof input.type === "string" ? input.type : "",
      name: typeof input.name === "string" ? input.name : "",
      text: (el.textContent ?? "").trim().slice(0, 80),
    };
  });
}

const TEXT_INPUT_TYPES = new Set([
  "text",
  "email",
  "url",
  "search",
  "tel",
  "password",
  "number",
]);

/** True for anything a person types or picks values into. */
export function isTextEntry(stop: FocusStop): boolean {
  if (stop.tag === "textarea" || stop.tag === "select") return true;
  return stop.tag === "input" && TEXT_INPUT_TYPES.has(stop.type);
}

/**
 * Presses Tab until the focused element satisfies `predicate`. Returns every
 * stop visited, the match last — callers assert on the journey (what came
 * before) as well as the destination. Throws after `maxTabs`: an unreachable
 * control by keyboard is exactly the failure these specs exist to catch.
 */
export async function tabUntil(
  page: Page,
  predicate: (stop: FocusStop) => boolean,
  description: string,
  maxTabs = 150,
): Promise<FocusStop[]> {
  const visited: FocusStop[] = [];
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press("Tab");
    const stop = await focusedElement(page);
    if (!stop) continue;
    visited.push(stop);
    if (predicate(stop)) return visited;
  }
  throw new Error(
    `Pressed Tab ${maxTabs} times without reaching ${description}. ` +
      `Last stops: ${JSON.stringify(visited.slice(-5))}`,
  );
}

/**
 * Waits until at least `minElapsedMs` has passed since `loadedAt` (the moment
 * the page finished loading). The API returns a silent DECOY success — same
 * shape, no database row — for submissions faster than MIN_FORM_MS (2500 ms,
 * src/lib/security/anti-bot.ts). The margin over 2500 covers the gap between
 * page load and the client mounting its `startedAt` timestamp.
 */
export async function dwellPastBotGate(
  page: Page,
  loadedAt: number,
  minElapsedMs = 4000,
): Promise<void> {
  const remaining = minElapsedMs - (Date.now() - loadedAt);
  if (remaining > 0) await page.waitForTimeout(remaining);
}
