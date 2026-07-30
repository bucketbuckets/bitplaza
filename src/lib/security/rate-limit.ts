import { createHash } from "node:crypto";

import { db } from "@/lib/db";

/**
 * Fixed-window rate limiting in Postgres.
 *
 * Waitlist volume does not justify a Redis vendor; a single-row upsert is
 * plenty. The key is sha256(ip + route) — the raw IP is never persisted,
 * consistent with plan.md's ip_hash convention and with what /data promises.
 *
 * The counter update is one atomic statement so concurrent submissions cannot
 * race the read-modify-write: expired windows reset, live windows increment.
 */

export const RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  /** Per IP, per route, per window. Generous for humans, tight for scripts. */
  maxRequests: 10,
} as const;

export function rateLimitKey(ip: string, route: string): string {
  return createHash("sha256").update(`${ip}:${route}`).digest("hex");
}

/**
 * The caller's IP as the platform reports it. Falls back to a shared bucket.
 *
 * `x-real-ip` is set by the Vercel edge to the true client IP and cannot be
 * spoofed by the caller, so it is the trusted source and takes precedence. A
 * client CAN prepend arbitrary values to `x-forwarded-for`, so it is only a
 * fallback, and then we take the RIGHTMOST entry — the hop the platform
 * appends — never the leftmost (attacker-controlled) one. Reading the leftmost
 * token let a script rotate the header per request and land in a fresh
 * rate-limit bucket every time, defeating the throttle entirely.
 */
export function clientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return "unknown";
}

/** True when this request is allowed; false → the route answers 429. */
export async function checkRateLimit(ip: string, route: string): Promise<boolean> {
  const key = rateLimitKey(ip, route);
  const now = new Date();
  const cutoff = new Date(now.getTime() - RATE_LIMIT.windowMs);

  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO rate_limit_counters (key, window_start, count)
    VALUES (${key}, ${now}, 1)
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limit_counters.window_start < ${cutoff} THEN 1
        ELSE rate_limit_counters.count + 1
      END,
      window_start = CASE
        WHEN rate_limit_counters.window_start < ${cutoff} THEN ${now}
        ELSE rate_limit_counters.window_start
      END
    RETURNING count
  `;

  return (rows[0]?.count ?? 1) <= RATE_LIMIT.maxRequests;
}

/**
 * Housekeeping: rows whose window ended long ago are dead weight. Called
 * opportunistically (fire-and-forget) from the routes; correctness never
 * depends on it.
 */
export async function pruneExpiredCounters(): Promise<void> {
  const cutoff = new Date(Date.now() - RATE_LIMIT.windowMs * 2);
  await db.rateLimitCounter.deleteMany({ where: { windowStart: { lt: cutoff } } });
}
