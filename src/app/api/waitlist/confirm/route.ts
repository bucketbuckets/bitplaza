import { NextResponse } from "next/server";

import { WaitlistConfirmation, waitlistConfirmationText } from "@emails/waitlist-confirmation";
import { labelsFor } from "@/lib/communities";
import { sendEmail } from "@/lib/email/send";
import { checkRateLimit, clientIp } from "@/lib/security/rate-limit";
import { SITE } from "@/content/site";
import { confirmWaitlistUser } from "@/lib/waitlist/confirm";
import { referralUrl } from "@/lib/waitlist/referral-code";

/**
 * GET /api/waitlist/confirm?token=… — the click inside the confirm email.
 *
 * Always answers with a redirect to /confirmed; that page renders the
 * outcome. Position and code travel as query params — display-only values
 * the person could already see, so tampering buys nothing.
 *
 * The token is 256 random bits, so guessing is theoretical; the rate limit
 * keeps the endpoint boring anyway. On a fresh confirm the welcome email
 * (position + referral link) goes out after the commit — its failure is
 * swallowed inside sendEmail, same rule as signup.
 */

export const runtime = "nodejs";

export async function GET(request: Request): Promise<NextResponse> {
  // Redirect relative to the deployment that served the click, so preview
  // deployments stay on themselves instead of bouncing to production.
  const redirect = (params: Record<string, string>) => {
    const url = new URL("/confirmed", request.url);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    return NextResponse.redirect(url, 303);
  };

  if (!(await checkRateLimit(clientIp(request), "waitlist-confirm"))) {
    return redirect({ s: "ratelimited" });
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";

  try {
    const result = await confirmWaitlistUser(token);

    switch (result.outcome) {
      case "invalid":
        return redirect({ s: "invalid" });
      case "expired":
        return redirect({ s: "expired" });
      case "already":
        return redirect({
          s: "ok",
          dup: "1",
          p: String(result.user.position ?? ""),
          c: result.user.referralCode,
        });
      case "confirmed": {
        const { user } = result;
        const link = referralUrl(SITE.url, user.referralCode);
        const emailProps = {
          firstName: user.firstName,
          position: user.position ?? 0,
          referralUrl: link,
          communityLabels: labelsFor(user.communities),
          siteUrl: SITE.url,
        };
        await sendEmail({
          to: user.emailRaw,
          subject: `You're #${user.position} on the Bitplaza waitlist`,
          react: WaitlistConfirmation(emailProps),
          text: waitlistConfirmationText(emailProps),
        });
        return redirect({
          s: "ok",
          p: String(user.position ?? ""),
          c: user.referralCode,
        });
      }
    }
  } catch (error) {
    console.error("waitlist: confirm failed", error);
    // The row is untouched or already committed; either way the safe answer
    // for the person is "try the link again in a minute".
    return redirect({ s: "error" });
  }
}
