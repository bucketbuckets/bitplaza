/**
 * The wire contract between the waitlist forms and their API routes.
 * Client-importable: types only, plus tiny pure helpers.
 *
 * Since double opt-in, a live submit answers one of two ways: "check your
 * inbox" or the confirmed-duplicate echo with position and link. The pending
 * answer is a CONSTANT — one shape, one status code — whether the signup was
 * fresh, a re-send, or a throttled re-send, so whether an address is already
 * waiting is never disclosed. The full success payload also backs the
 * /confirmed page, where a FRESH position is revealed for the first time.
 */

export interface WaitlistPending {
  ok: true;
  status: "pending";
}

export interface WaitlistSuccess {
  ok: true;
  status: "confirmed";
  /** True when the address was already confirmed on the list. */
  duplicate: boolean;
  position: number;
  referralCode: string;
  referralUrl: string;
}

export interface ApiFailure {
  ok: false;
  /** One human sentence: the problem and the fix. */
  error: string;
  /** Per-field messages when validation failed, keyed by field name. */
  fieldErrors?: Record<string, string>;
}

export type WaitlistResponse = WaitlistPending | WaitlistSuccess | ApiFailure;

export type ApplicationPending = WaitlistPending;
export type ApplicationSuccess = WaitlistSuccess;

export type ApplicationResponse = ApplicationPending | ApplicationSuccess | ApiFailure;
