import { expect, test } from "@playwright/test";

import { COMMUNITIES_PAGE } from "@/content/communities-page";
import {
  cleanupE2eRows,
  disconnectDb,
  findUserByEmail,
  uniqueE2eEmail,
} from "./helpers/db";
import {
  dwellPastBotGate,
  focusedElement,
  isTextEntry,
  tabUntil,
} from "./helpers/keyboard";

/**
 * The leader application on /communities, keyboard only.
 *
 * The form is email-first by design (the email IS the signup; beside "First
 * name" it would read as a surname box), so the spec's first assertion is
 * about focus order: tabbing from the top of the page, the email field must
 * be the first text-entry control focus ever lands on. Then it completes the
 * whole application without a single click — the select included, via
 * keyboard type-ahead — dwells past the anti-bot timing gate, submits, and
 * proves the application row (not a decoy) landed in Postgres.
 */

test.describe("leader application funnel, keyboard only", () => {
  test.beforeAll(async () => {
    await cleanupE2eRows();
  });

  test.afterAll(async () => {
    await cleanupE2eRows();
    await disconnectDb();
  });

  test("email is the first text field; the whole application works by keyboard", async ({
    page,
  }) => {
    const email = uniqueE2eEmail("leader");
    const communityName = "E2E Test Community";
    const primaryProblem = "Newcomers cannot find our events or our docs.";

    await page.goto("/communities");
    const loadedAt = Date.now();

    // --- Focus order: email before any other text input ------------------
    const journey = await tabUntil(
      page,
      isTextEntry,
      "the first text-entry control on /communities",
    );
    const firstTextEntry = journey[journey.length - 1];
    expect(firstTextEntry.id).toBe("ca-email");
    expect(firstTextEntry.type).toBe("email");
    // Nothing focused before it accepted typing, and the honeypot
    // (tabIndex -1) never entered the tab order.
    expect(journey.slice(0, -1).some(isTextEntry)).toBe(false);
    expect(journey.some((stop) => stop.id === "ca-nickname")).toBe(false);

    await page.keyboard.type(email);

    // --- The rest of the form, in strict Tab order -----------------------
    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("ca-firstName");
    await page.keyboard.type("Playwright");

    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("ca-communityName");
    await page.keyboard.type(communityName);

    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("ca-communitySize");
    // Native select, chosen by type-ahead: "f" -> "Fewer than 100".
    await page.keyboard.press("f");
    await expect(page.locator("#ca-communitySize")).toHaveValue("Fewer than 100");

    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("ca-website"); // optional, left empty

    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("ca-currentTools");
    await page.keyboard.type("Discord, Notion");

    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("ca-primaryProblem");
    await page.keyboard.type(primaryProblem);

    await page.keyboard.press("Tab");
    expect((await focusedElement(page))?.id).toBe("ca-plazaVision"); // optional, left empty

    await page.keyboard.press("Tab");
    const submitStop = await focusedElement(page);
    expect(submitStop?.tag).toBe("button");
    expect(submitStop?.text).toBe(COMMUNITIES_PAGE.form.submit);

    // --- Submit, slower than the anti-bot timing gate --------------------
    await dwellPastBotGate(page, loadedAt);
    await page.keyboard.press("Enter");

    // --- Success state: visible AND focus moved to its heading -----------
    const successHeading = page.getByRole("heading", {
      name: COMMUNITIES_PAGE.success.heading,
    });
    await expect(successHeading).toBeVisible({ timeout: 15_000 });
    await expect(successHeading).toBeFocused();
    await expect(page.getByText(COMMUNITIES_PAGE.success.body)).toBeVisible();

    const positionParagraph = page.getByText(/you hold place [\d,]+ in line\./);
    await expect(positionParagraph).toBeVisible();
    const shownPosition = Number(
      (await positionParagraph.innerText()).replace(/[^0-9]/g, ""),
    );
    expect(shownPosition).toBeGreaterThan(0);

    // --- Prove it was no decoy: user + application rows landed -----------
    const user = await findUserByEmail(email);
    expect(user).not.toBeNull();
    expect(user?.emailRaw).toBe(email);
    expect(user?.userType).toBe("COMMUNITY_LEADER");
    expect(user?.position).toBe(shownPosition);

    const application = user?.communityApplication;
    expect(application).not.toBeNull();
    expect(application?.communityName).toBe(communityName);
    expect(application?.communitySize).toBe("Fewer than 100");
    expect(application?.currentTools).toEqual(["Discord", "Notion"]);
    expect(application?.primaryProblem).toBe(primaryProblem);
  });
});
