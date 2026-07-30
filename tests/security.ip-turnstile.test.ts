import { afterEach, describe, expect, it, vi } from "vitest";

import { clientIp } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";

function req(headers: Record<string, string>): Request {
  return new Request("https://example.com", { headers });
}

describe("clientIp", () => {
  it("prefers the unspoofable x-real-ip over x-forwarded-for", () => {
    expect(
      clientIp(req({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "1.1.1.1" })),
    ).toBe("203.0.113.7");
  });

  it("ignores a client-prepended x-forwarded-for and takes the rightmost hop", () => {
    // An attacker prepends a fake IP to rotate the rate-limit key; the platform
    // appends the real client IP on the right, so the rightmost token wins.
    expect(clientIp(req({ "x-forwarded-for": "9.9.9.9, 203.0.113.7" }))).toBe(
      "203.0.113.7",
    );
  });

  it("handles a single-value x-forwarded-for", () => {
    expect(clientIp(req({ "x-forwarded-for": "203.0.113.7" }))).toBe("203.0.113.7");
  });

  it("falls back to a shared bucket when no IP header is present", () => {
    expect(clientIp(req({}))).toBe("unknown");
  });
});

describe("verifyTurnstile", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("passes when no secret is configured, so the funnel keeps working", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstile("any-token", "1.2.3.4")).resolves.toBe(true);
  });

  it("logs loudly when unconfigured in production but still passes", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NODE_ENV", "production");
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(verifyTurnstile("t", "1.2.3.4")).resolves.toBe(true);
    expect(err).toHaveBeenCalled();
  });

  it("rejects a missing token when configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    await expect(verifyTurnstile(undefined, "1.2.3.4")).resolves.toBe(false);
  });

  it("passes a token Cloudflare marks successful", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 })),
    );
    await expect(verifyTurnstile("good", "1.2.3.4")).resolves.toBe(true);
  });

  it("rejects a token Cloudflare marks unsuccessful", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: false }), { status: 200 })),
    );
    await expect(verifyTurnstile("bad", "1.2.3.4")).resolves.toBe(false);
  });

  it("fails CLOSED when Cloudflare returns a non-200 (configured)", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 503 })));
    await expect(verifyTurnstile("good", "1.2.3.4")).resolves.toBe(false);
  });

  it("fails CLOSED when the request throws, e.g. a timeout (configured)", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    await expect(verifyTurnstile("good", "1.2.3.4")).resolves.toBe(false);
  });
});
