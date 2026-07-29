import { randomBytes } from "node:crypto";

/**
 * Referral codes: 8 characters of Crockford base32.
 *
 * The alphabet omits I, L, O and U, so a code read aloud or typed from a
 * screenshot cannot be tripped up by 1/I/l or 0/O confusion. 32^8 ≈ 1.1e12
 * values; at the thousands-of-signups scale this site is built for, collisions
 * are vanishingly rare — but the insert still retries on the unique constraint
 * rather than assuming (see the API route).
 */
export const REFERRAL_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export const REFERRAL_CODE_LENGTH = 8;

export function generateReferralCode(): string {
  const bytes = randomBytes(REFERRAL_CODE_LENGTH);
  let code = "";
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    code += REFERRAL_ALPHABET[bytes[i] % REFERRAL_ALPHABET.length];
  }
  return code;
}

/**
 * Canonical form for an incoming code: what a person typed, pasted or clicked.
 * Maps the confusable characters onto the alphabet the generator uses, so a
 * hand-transcribed `o` still resolves. Returns null for anything that cannot
 * be a code — callers ignore invalid codes silently, never surface an error.
 */
export function canonicalizeReferralCode(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const mapped = input
    .trim()
    .toUpperCase()
    .replaceAll("O", "0")
    .replaceAll("I", "1")
    .replaceAll("L", "1");
  if (mapped.length !== REFERRAL_CODE_LENGTH) return null;
  for (const ch of mapped) {
    if (!REFERRAL_ALPHABET.includes(ch)) return null;
  }
  return mapped;
}

/** The absolute referral URL for outgoing email and the success state. */
export function referralUrl(siteUrl: string, code: string): string {
  return `${siteUrl}/?ref=${code}`;
}
