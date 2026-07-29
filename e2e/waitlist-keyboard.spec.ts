import { expect, test } from "@playwright/test";

import { WAITLIST } from "@/content/waitlist";
import {
  cleanupE2eRows,
  disconnectDb,
  findUserByEmail,
  uniqueE2eEmail,
} from "./helpers/db";
import { dwellPastBotGate, focusedElement, tabUntil } from "./helpers/keyboard";

/**
 * The core funnel, keyboard only: land on /, Tab to the waitlist form, pick a
 * goal with Space and Arrows, type an email, submit with Enter, and see the
 * real success state.
 *
 * "Real" is the load-bearing word. The API answers a decoy success — same
 * shape, no row — when the honeypot is filled or the submit beats the 2500 ms
 * timing gate. So this spec dwells past the gate, asserts the success markers
 * (referral link, position), and then proves the row landed by reading it back
 * from Postgres and matching the displayed referral code and position against
 * the stored ones. A decoy passes none of that.
 */

/** Referral codes are 8 chars of Crockford base32 (no I, L, O, U). */
const REFERRAL_CODE_RE = /\?ref=([0-9A-HJKMNP-TV-Z]{8})/;

test.describe("waitlist funnel, keyboard only", () => {
  test.beforeAll(async () => {
    // Stale rows from a crashed run must not shift positions or rate limits.
    await cleanupE2eRows();
  });

  test.afterAll(async () => {
    await cleanupE2eRows();
    await disconnectDb();
  });

  test("tab from the top of /, choose a goal, submit, land a real signup", async ({
    page,
  }) => {
    const email = uniqueE2eEmail("waitlist");

    await page.goto("/");
    const loadedAt = Date.now();

    // --- Reach the goal radio group by Tab alone -------------------------
    const journey = await tabUntil(
      page,
      (stop) => stop.name === "userType" && stop.type === "radio",
      'the "What do you want to do?" radio group',
    );

    // The honeypot (tabIndex -1) must never appear in the tab order.
    expect(journey.some((stop) => stop.id === "wl-nickname")).toBe(false);

    // --- Choose a goal: Space checks, Arrows move the check --------------
    await page.keyboard.press("Space");
    await expect(
      page.locator('input[name="userType"][value="COMMUNITY_MEMBER"]'),
    ).toBeChecked();

    await page.keyboard.press("ArrowRight");
    await expect(
      page.locator('input[name="userType"][value="COMMUNITY_LEADER"]'),
    ).toBeChecked();

    await page.keyboard.press("ArrowLeft");
    await expect(
      page.locator('input[name="userType"][value="COMMUNITY_MEMBER"]'),
    ).toBeChecked();

    // --- One Tab out of the checked group lands on the email field -------
    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("wl-email");
    await page.keyboard.type(email);

    // --- Tab reaches the submit button; Shift+Tab must not lose the value
    await page.keyboard.press("Tab");
    const submitStop = await focusedElement(page);
    expect(submitStop?.tag).toBe("button");
    expect(submitStop?.text).toBe(WAITLIST.form.submit);

    await page.keyboard.press("Shift+Tab");
    expect((await focusedElement(page))?.id).toBe("wl-email");
    await expect(page.locator("#wl-email")).toHaveValue(email);
    await page.keyboard.press("Tab");

    // --- Submit, slower than the anti-bot timing gate --------------------
    await dwellPastBotGate(page, loadedAt);
    await page.keyboard.press("Enter");

    // --- The real success state ------------------------------------------
    await expect(
      page.getByRole("heading", { name: WAITLIST.success.heading }),
    ).toBeVisible({ timeout: 15_000 });
    // A fresh signup, not the duplicate path.
    await expect(page.getByText(WAITLIST.success.duplicateHeading)).toHaveCount(0);

    const referralParagraph = page.getByText(REFERRAL_CODE_RE);
    await expect(referralParagraph).toBeVisible();
    const shownCode = REFERRAL_CODE_RE.exec(await referralParagraph.innerText())?.[1];
    expect(shownCode).toBeTruthy();

    const positionParagraph = page.getByText(/You're number [\d,]+ in line\./);
    await expect(positionParagraph).toBeVisible();
    const shownPosition = Number(
      (await positionParagraph.innerText()).replace(/[^0-9]/g, ""),
    );
    expect(Number.isInteger(shownPosition)).toBe(true);
    expect(shownPosition).toBeGreaterThan(0);

    await expect(
      page.getByRole("button", { name: WAITLIST.success.share.copy }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: WAITLIST.success.share.shareOnX }),
    ).toBeVisible();

    // --- Prove it was no decoy: the row exists and matches the screen ----
    const user = await findUserByEmail(email);
    expect(user).not.toBeNull();
    expect(user?.emailRaw).toBe(email);
    expect(user?.userType).toBe("COMMUNITY_MEMBER");
    expect(user?.referralCode).toBe(shownCode);
    expect(user?.position).toBe(shownPosition);
    // Byte-for-byte: the copy function and the rendered line agree.
    expect(await positionParagraph.innerText()).toBe(
      WAITLIST.success.positionLine(shownPosition),
    );
  });
});
