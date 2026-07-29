import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { clearSelection, toggleCommunity } from "@/lib/waitlist/selection-store";

const success = {
  ok: true,
  duplicate: false,
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
  await user.type(screen.getByLabelText(/first name/i), "Tom");
  await user.type(screen.getByLabelText(/^email$/i), "tom@example.com");
  await user.selectOptions(screen.getByLabelText(/closest to you/i), "COMMUNITY_MEMBER");
  await user.click(screen.getByRole("checkbox"));
}

describe("WaitlistForm", () => {
  beforeEach(() => {
    clearSelection();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows an error summary and field errors on an empty submit, without calling the API", async () => {
    const fetchMock = mockFetch(success);
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /request early access/i }));

    const summary = await screen.findByRole("alert");
    expect(summary).toHaveTextContent(/needs attention/i);
    expect(fetchMock).not.toHaveBeenCalled();

    // Field-level wiring: the email input points at its own error message.
    const email = screen.getByLabelText(/^email$/i);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", "wl-email-error");
  });

  it("submits a valid form and hands the result to onSuccess", async () => {
    const fetchMock = mockFetch(success);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /request early access/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(success));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.email).toBe("tom@example.com");
    expect(body.nickname).toBe("");
    expect(typeof body.startedAt).toBe("number");
  });

  it("sends the selector's communities with the submission", async () => {
    const fetchMock = mockFetch(success);
    toggleCommunity("bitcoin");
    toggleCommunity("music");

    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={vi.fn()} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /request early access/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.communities).toEqual(["bitcoin", "music"]);
  });

  it("surfaces a server rejection in the summary", async () => {
    mockFetch({ ok: false, error: "Too many attempts from this connection." }, 429);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /request early access/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/too many attempts/i);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
