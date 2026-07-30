import { createHash, randomBytes } from "node:crypto";

/**
 * The double opt-in confirm token. 32 random bytes, base64url on the wire
 * (43 chars, URL-safe), sha256 hex at rest — a database leak exposes nothing
 * that can confirm an address. The plaintext exists only in the email.
 *
 * CONFIRM_TTL_DAYS feeds both the row's expiry and the email copy, so the
 * promise in the inbox and the check in the database cannot drift.
 */

export const CONFIRM_TTL_DAYS = 3;

/**
 * Minimum age of the current token before a re-submit rotates it and sends
 * another email. Inside the window the submit is answered identically but
 * nothing is sent — this is the cap on mailbombing an address, on burning
 * Resend quota, and on griefing someone by killing the link in their inbox
 * faster than they can click it.
 */
export const RESEND_COOLDOWN_MS = 10 * 60 * 1000;

/** When the token carrying this expiry was issued. */
export function tokenIssuedAt(expiresAt: Date): Date {
  return new Date(expiresAt.getTime() - CONFIRM_TTL_DAYS * 86_400_000);
}

export function generateVerifyToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashVerifyToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyTokenExpiry(now: Date = new Date()): Date {
  return new Date(now.getTime() + CONFIRM_TTL_DAYS * 86_400_000);
}
