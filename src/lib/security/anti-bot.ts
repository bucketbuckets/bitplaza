/**
 * The zero-vendor bot checks: a honeypot field and a timing trap.
 *
 * Both answer with a SILENT fake success, never an error — telling a bot it
 * was caught is telling its author what to fix. The fake payload is shaped
 * exactly like a real success so nothing downstream can distinguish them
 * without the database.
 */

/** Forms submit faster than this only when nothing read them. */
export const MIN_FORM_MS = 2500;

export function isBotSubmission(input: {
  nickname?: string;
  startedAt?: number;
  now?: number;
}): boolean {
  if (input.nickname && input.nickname.trim() !== "") return true;

  if (typeof input.startedAt === "number") {
    const elapsed = (input.now ?? Date.now()) - input.startedAt;
    if (elapsed >= 0 && elapsed < MIN_FORM_MS) return true;
  }

  return false;
}

/**
 * The decoy for silent-success responses. Since double opt-in, every real
 * live submit answers "check your inbox" with no variable data in the body,
 * so the decoy is simply that — indistinguishable by construction, and the
 * fake position/referral code the old decoy had to invent no longer exists
 * to scrape.
 */
export function decoySuccess() {
  return { ok: true as const, status: "pending" as const };
}
