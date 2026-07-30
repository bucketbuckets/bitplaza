import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { ConfirmedPing } from "@/components/waitlist/confirmed-ping";
import { SuccessState } from "@/components/waitlist/success-state";
import { SITE } from "@/content/site";
import { WAITLIST } from "@/content/waitlist";
import { referralUrl } from "@/lib/waitlist/referral-code";
import type { WaitlistSuccess } from "@/lib/waitlist/types";
import { CONFIRM_TTL_DAYS } from "@/lib/waitlist/verify-token";

/**
 * Where the confirm-email click lands (via the /api/waitlist/confirm
 * redirect). `s=ok` is the celebration — the first time a fresh signup sees
 * their position — rendered with the same SuccessState the form shows a
 * confirmed duplicate. Everything else is a calm explanation and a way back.
 *
 * Position and code arrive as query params. They are display-only: editing
 * them changes nothing in the database and shows nothing that the person's
 * own welcome email doesn't already contain.
 */

export const metadata: Metadata = {
  title: "Confirmed",
  robots: { index: false, follow: false },
};

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const one = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");

  const s = one("s");
  const position = Number.parseInt(one("p"), 10);
  const code = one("c");

  if (s === "ok" && Number.isFinite(position) && position > 0 && code) {
    const result: WaitlistSuccess = {
      ok: true,
      status: "confirmed",
      duplicate: one("dup") === "1",
      position,
      referralCode: code,
      referralUrl: referralUrl(SITE.url, code),
    };
    return (
      <article className="py-20 sm:py-28">
        <Container width="narrow">
          <ConfirmedPing duplicate={result.duplicate} />
          <SuccessState result={result} />
        </Container>
      </article>
    );
  }

  const copy =
    s === "expired"
      ? {
          heading: WAITLIST.confirm.expired.heading,
          body: WAITLIST.confirm.expired.body(CONFIRM_TTL_DAYS),
          cta: WAITLIST.confirm.expired.cta,
        }
      : s === "ratelimited"
        ? { heading: WAITLIST.confirm.ratelimited.heading, body: WAITLIST.confirm.ratelimited.body }
        : s === "error"
          ? { heading: WAITLIST.confirm.error.heading, body: WAITLIST.confirm.error.body }
          : {
              heading: WAITLIST.confirm.invalid.heading,
              body: WAITLIST.confirm.invalid.body,
              cta: WAITLIST.confirm.invalid.cta,
            };

  return (
    <article className="py-20 sm:py-28">
      <Container width="narrow">
        <div className="flex flex-col gap-4">
          <p className="eyebrow text-apricot-ink">Waitlist</p>
          <h1 className="font-display text-display-1 text-ink">{copy.heading}</h1>
          <p className="measure-wide text-body-lg text-ink-muted">{copy.body}</p>
          {"cta" in copy && copy.cta ? (
            <div className="mt-2">
              <Button asChild size="lg">
                <Link href="/#waitlist">{copy.cta}</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
