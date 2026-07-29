import { defineConfig } from "@playwright/test";

/**
 * Playwright e2e configuration.
 *
 * Port 3210 on purpose: :3000 is polluted by a stale tab from another project
 * polling it, which would fool `reuseExistingServer` into treating that tab's
 * server as ours.
 *
 * `channel: "chrome"` is mandatory on this machine — the cached Playwright
 * browser build does not match the installed Playwright version, so tests must
 * run against the system Chrome.
 */

const PORT = 3210;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",

  // Both specs hit the same per-IP rate limit window (10 requests / 10 min /
  // route) and share one local database. Serial keeps the counts deterministic.
  fullyParallel: false,
  workers: 1,

  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  timeout: 60_000,

  use: {
    baseURL: BASE_URL,
    channel: "chrome",
    trace: "retain-on-failure",
  },

  webServer: {
    // A real production build: the funnel must pass against what ships.
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    // The production build dominates startup time.
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
