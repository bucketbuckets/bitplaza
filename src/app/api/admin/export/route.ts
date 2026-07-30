import { timingSafeEqual } from "node:crypto";

import { db } from "@/lib/db";
import { toCsvRow } from "@/lib/waitlist/csv";

/**
 * GET /api/admin/export — the waitlist as CSV, for the humans running launch.
 *
 * The entire gate is one bearer token (ADMIN_EXPORT_TOKEN, see .env.template).
 * Comparison is constant-time; a missing server token disables the endpoint
 * outright rather than devolving to open. Streams in pages so the export
 * doesn't buffer the whole table at 100k signups.
 */

export const runtime = "nodejs";

const PAGE_SIZE = 500;

const HEADER = [
  "position",
  "email",
  "first_name",
  "user_type",
  "communities",
  "primary_goal",
  "referral_code",
  "referral_count",
  "referred_by_code",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "consent_at",
  "created_at",
  "confirmed",
  "confirmed_at",
] as const;

function authorized(request: Request): boolean {
  const expected = process.env.ADMIN_EXPORT_TOKEN;
  if (!expected) return false;

  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/.exec(header);
  if (!match) return false;

  const provided = Buffer.from(match[1]);
  const wanted = Buffer.from(expected);
  if (provided.length !== wanted.length) return false;
  return timingSafeEqual(provided, wanted);
}

export async function GET(request: Request): Promise<Response> {
  if (!authorized(request)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "www-authenticate": "Bearer" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(HEADER.join(",") + "\n"));

        let cursor: string | undefined;
        for (;;) {
          const page = await db.waitlistUser.findMany({
            take: PAGE_SIZE,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            // Pending rows have no position; they sort last, id as tiebreak
            // so cursor pagination stays stable across pages.
            orderBy: [{ position: { sort: "asc", nulls: "last" } }, { id: "asc" }],
            include: { referredBy: { select: { referralCode: true } } },
          });
          if (page.length === 0) break;

          for (const user of page) {
            controller.enqueue(
              encoder.encode(
                toCsvRow([
                  user.position,
                  user.emailRaw,
                  user.firstName,
                  user.userType,
                  user.communities.join("|"),
                  user.primaryGoal,
                  user.referralCode,
                  user.referralCount,
                  user.referredBy?.referralCode,
                  user.utmSource,
                  user.utmMedium,
                  user.utmCampaign,
                  user.consentTimestamp.toISOString(),
                  user.createdAt.toISOString(),
                  user.confirmedAt ? "true" : "false",
                  user.confirmedAt?.toISOString(),
                ]) + "\n",
              ),
            );
          }

          cursor = page[page.length - 1].id;
          if (page.length < PAGE_SIZE) break;
        }

        controller.close();
      } catch (error) {
        console.error("admin export: stream failed", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="bitplaza-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}
