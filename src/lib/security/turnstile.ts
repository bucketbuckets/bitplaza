/**
 * Cloudflare Turnstile server-side verification.
 *
 * Chosen over reCAPTCHA because it sets no cookies — which is what /data
 * claims.
 *
 * When the secret is NOT configured (local dev, previews, and production until
 * keys are added) the check passes so the funnel keeps working — the rate
 * limit and honeypot remain in force — but in production we log loudly so a
 * missing or mispropagated key is never silent.
 *
 * Once the secret IS configured, verification is ENFORCED and fails CLOSED on
 * any Cloudflare error, timeout, or exception: a configured challenge must not
 * be bypassable by inducing an upstream failure.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 5000;

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "turnstile: TURNSTILE_SECRET_KEY is not set in production — bot verification is DISABLED. Set the key to enforce it.",
      );
    }
    return true;
  }
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      // A hung Cloudflare must not stall the function; a timeout fails closed.
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!res.ok) {
      // Turnstile is configured, so a Cloudflare error must FAIL CLOSED —
      // otherwise a challenge is bypassable by inducing upstream 5xxs.
      console.error(`turnstile: siteverify responded ${res.status}; failing closed`);
      return false;
    }
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("turnstile: verification failed to run; failing closed", error);
    return false;
  }
}
