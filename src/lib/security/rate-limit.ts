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

/** The caller's IP as the platform reports it. Falls back to a shared bucket. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
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
