import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WaitlistForm } from "@/components/waitlist/waitlist-form";

/** A live signup answers pending; the full success shape is reserved for
    already-confirmed duplicates (and the /confirmed page). */
const pending = { ok: true, status: "pending" };

const success = {
  ok: true,
  status: "confirmed",
  duplicate: true,
  position: 42,
  referralCode: "ABCD2345",
  referralUrl: "https://bitplaza.com/?ref=ABCD2345",
};

function mockFetch(response: unknown, status = 201) {
  const fn = vi.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: async () => response,
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: /explore bitcoin/i }));
  await user.type(screen.getByLabelText(/^your email$/i), "tom@example.com");
}

describe("WaitlistForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it("shows an error summary and field errors on an empty submit, without calling the API", async () => {
    const fetchMock = mockFetch(pending);
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={vi.fn()} onPending={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /get early access/i }));

    const summary = await screen.findByRole("alert");
    expect(summary).toHaveTextContent(/needs attention/i);
    expect(fetchMock).not.toHaveBeenCalled();

    // Field-level wiring: the email input points at its own error message.
    const email = screen.getByLabelText(/^your email$/i);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", "wl-email-error");
  });

  it("submits a valid form and hands the typed email to onPending (double opt-in)", async () => {
    const fetchMock = mockFetch(pending);
    const onPending = vi.fn();
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={onSuccess} onPending={onPending} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /get early access/i }));

    await waitFor(() => expect(onPending).toHaveBeenCalledWith("tom@example.com"));
    expect(onSuccess).not.toHaveBeenCalled();

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.email).toBe("tom@example.com");
    expect(body.userType).toBe("COMMUNITY_MEMBER");
    // Submitting under the visible note affirms consent — no checkbox.
    expect(body.consent).toBe(true);
    expect(body.nickname).toBe("");
    expect(typeof body.startedAt).toBe("number");
  });

  it("hands an already-confirmed duplicate to onSuccess, not onPending", async () => {
    mockFetch(success, 200);
    const onPending = vi.fn();
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={onSuccess} onPending={onPending} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /get early access/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(success, "COMMUNITY_MEMBER"));
    expect(onPending).not.toHaveBeenCalled();
  });

  it("maps the community-leader goal onto the existing enum", async () => {
    const fetchMock = mockFetch(pending);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={onSuccess} onPending={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: /map a community/i }));
    await user.type(screen.getByLabelText(/^your email$/i), "lead@example.com");
    await user.click(screen.getByRole("button", { name: /get early access/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.userType).toBe("COMMUNITY_LEADER");
  });

  it("surfaces a server rejection in the summary and keeps the input", async () => {
    mockFetch({ ok: false, error: "Too many attempts from this connection." }, 429);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={onSuccess} onPending={vi.fn()} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /get early access/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/too many attempts/i);
    expect(onSuccess).not.toHaveBeenCalled();
    // The typed address survives the failure.
    expect(screen.getByLabelText(/^your email$/i)).toHaveValue("tom@example.com");
  });
});
