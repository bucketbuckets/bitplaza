import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton. Next dev hot-reloads modules; without the global cache
 * every reload would open a fresh connection pool until Postgres refuses new
 * clients. In production the module is evaluated once and the cache is inert.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
