import { readFileSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

/**
 * Direct access to the local Postgres the app under test writes to.
 *
 * The API answers a DECOY success (same shape, no row) to submissions the
 * anti-bot gates catch, so the UI alone cannot prove a signup landed. These
 * helpers let the specs assert the row itself — and delete it afterwards so
 * repeated runs stay deterministic.
 */

/** Every address the suite creates ends with this, so cleanup is one query. */
export const E2E_EMAIL_DOMAIN = "e2e-bitplaza.test";

/** Unique per run: no accidental duplicate-flow, no cross-run coupling. */
export function uniqueE2eEmail(prefix: string): string {
  const stamp = Date.now().toString(36);
  const noise = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${stamp}-${noise}@${E2E_EMAIL_DOMAIN}`;
}

/**
 * Next.js loads .env for the webServer on its own; the Playwright test
 * process has to do it by hand. Only DATABASE_URL is needed here.
 */
function databaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.resolve(__dirname, "..", "..", ".env");
  const match = readFileSync(envPath, "utf8").match(
    /^DATABASE_URL\s*=\s*"?([^"\r\n]+)"?\s*$/m,
  );
  if (!match) throw new Error(`DATABASE_URL not found in ${envPath}`);
  return match[1];
}

let client: PrismaClient | undefined;

export function db(): PrismaClient {
  client ??= new PrismaClient({ datasourceUrl: databaseUrl() });
  return client;
}

/** Looks a signup up by the address as typed (the app stores it lowercased). */
export function findUserByEmail(email: string) {
  return db().waitlistUser.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { communityApplication: true },
  });
}

/**
 * Removes every row the suite created (applications cascade with their user)
 * and resets the local rate-limit counters, so back-to-back runs never inherit
 * a half-spent 10-requests-per-window budget.
 */
export async function cleanupE2eRows(): Promise<void> {
  await db().waitlistUser.deleteMany({
    where: { email: { endsWith: `@${E2E_EMAIL_DOMAIN}` } },
  });
  await db().rateLimitCounter.deleteMany({});
}

export async function disconnectDb(): Promise<void> {
  await client?.$disconnect();
  client = undefined;
}
