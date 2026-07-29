/**
 * Cloudflare Turnstile server-side verification.
 *
 * Chosen over reCAPTCHA because it sets no cookies — which is what /data
 * claims. When the secret is not configured (local dev, previews) the check
 * passes open: the env template documents that features degrade quietly, and
 * the honeypot + timing trap + rate limit remain in force.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, { method: "POST", body });
    if (!res.ok) {
      // Cloudflare being down must not close the waitlist: the other three
      // defence layers still apply. Log so an outage is visible.
      console.error(`turnstile: siteverify responded ${res.status}`);
      return true;
    }
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("turnstile: verification failed to run", error);
    return true;
  }
}
