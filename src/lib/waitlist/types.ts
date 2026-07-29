/**
 * The wire contract between the waitlist forms and their API routes.
 * Client-importable: types only, plus tiny pure helpers.
 */

export interface WaitlistSuccess {
  ok: true;
  /** True when the address was already on the list. */
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

export type WaitlistResponse = WaitlistSuccess | ApiFailure;

export interface ApplicationSuccess {
  ok: true;
  duplicate: boolean;
  position: number;
  referralCode: string;
  referralUrl: string;
}

export type ApplicationResponse = ApplicationSuccess | ApiFailure;
