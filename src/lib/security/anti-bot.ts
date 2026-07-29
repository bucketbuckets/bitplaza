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
 * A plausible, deterministic decoy for silent-success responses. Derived from
 * the input so repeated probes see consistent answers rather than a fresh
 * random value per attempt (which is itself a signal).
 */
export function decoySuccess(seedText: string, siteUrl: string) {
  let hash = 5381;
  for (let i = 0; i < seedText.length; i++) {
    hash = ((hash << 5) + hash + seedText.charCodeAt(i)) >>> 0;
  }
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[(hash = (hash * 33 + 7) >>> 0) % alphabet.length];
  }
  const position = 1200 + (hash % 900);
  return {
    ok: true as const,
    duplicate: false,
    position,
    referralCode: code,
    referralUrl: `${siteUrl}/?ref=${code}`,
  };
}
