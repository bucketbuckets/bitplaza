/**
 * Email normalization — the identity key for duplicate detection.
 *
 * Trim, lowercase, NFKC. Gmail-only dot and plus-tag stripping: at Gmail,
 * `t.o.m+news@gmail.com` and `tom@gmail.com` deliver to the same inbox, so
 * treating them as distinct hands out duplicate waitlist positions. At other
 * hosts the same transformation wrongly MERGES distinct people — `a.b@fastmail`
 * and `ab@fastmail` can be different accounts — so it is applied nowhere else.
 *
 * The raw address is stored alongside (`emailRaw`) because normalization must
 * never destroy the address actual mail is sent to.
 */

const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

export function normalizeEmail(input: string): string {
  const email = input.trim().normalize("NFKC").toLowerCase();

  const at = email.lastIndexOf("@");
  if (at === -1) return email;

  let local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (GMAIL_DOMAINS.has(domain)) {
    const plus = local.indexOf("+");
    if (plus !== -1) local = local.slice(0, plus);
    local = local.replaceAll(".", "");
  }

  return `${local}@${domain}`;
}
