"use client";

import { useSyncExternalStore } from "react";

import { MAX_COMMUNITIES, type CommunityId } from "@/lib/communities";

/**
 * The selected-communities store, shared between the interest selector
 * (#plaza-builder) and the waitlist form (#waitlist) — two different sections
 * of a server-composed page, so React context would force a client wrapper
 * around the whole page. An external store read through useSyncExternalStore
 * is the same pattern src/lib/theme.ts already established.
 *
 * Selection order is preserved (it feeds the preview's deterministic seed);
 * display always re-sorts to canonical order via labelsFor().
 */

let selection: readonly CommunityId[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): readonly CommunityId[] {
  return selection;
}

/** Server snapshot: nothing selected. Matches first client render. */
function getServerSnapshot(): readonly CommunityId[] {
  return selection;
}

export function useSelectedCommunities(): readonly CommunityId[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Toggle one community. Returns the action taken so callers can report it to
 * analytics — "blocked" means the cap was hit and nothing changed.
 */
export function toggleCommunity(id: CommunityId): "add" | "remove" | "blocked" {
  if (selection.includes(id)) {
    selection = selection.filter((c) => c !== id);
    emit();
    return "remove";
  }
  if (selection.length >= MAX_COMMUNITIES) return "blocked";
  selection = [...selection, id];
  emit();
  return "add";
}

export function clearSelection(): void {
  if (selection.length === 0) return;
  selection = [];
  emit();
}
