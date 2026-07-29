import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { InterestSelector } from "@/components/interest/interest-selector";
import { COMMUNITIES, MAX_COMMUNITIES } from "@/lib/communities";
import { clearSelection } from "@/lib/waitlist/selection-store";

describe("InterestSelector", () => {
  beforeEach(() => {
    // The store is module-level on purpose (shared across sections); tests
    // must not leak selections into each other.
    clearSelection();
  });

  it("renders all ten communities as toggle buttons", () => {
    render(<InterestSelector />);
    const group = screen.getByRole("group");
    const buttons = group.querySelectorAll("button");
    expect(buttons).toHaveLength(COMMUNITIES.length);
    for (const button of buttons) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("toggles selection with aria-pressed and announces the count", async () => {
    const user = userEvent.setup();
    render(<InterestSelector />);

    const bitcoin = screen.getByRole("button", { name: /bitcoin/i });
    await user.click(bitcoin);
    expect(bitcoin).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(`1 of ${MAX_COMMUNITIES} interests selected.`)).toBeInTheDocument();

    await user.click(bitcoin);
    expect(bitcoin).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Nothing selected yet.")).toBeInTheDocument();
  });

  it("blocks a fourth selection and explains instead of failing silently", async () => {
    const user = userEvent.setup();
    render(<InterestSelector />);

    await user.click(screen.getByRole("button", { name: /bitcoin/i }));
    await user.click(screen.getByRole("button", { name: /music/i }));
    await user.click(screen.getByRole("button", { name: /^design/i }));
    await user.click(screen.getByRole("button", { name: /gaming/i }));

    expect(screen.getByRole("button", { name: /gaming/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText(/remove one to choose another/i)).toBeInTheDocument();
  });

  it("implements roving tabindex: one tab stop, arrows move focus", async () => {
    const user = userEvent.setup();
    render(<InterestSelector />);

    const group = screen.getByRole("group");
    const buttons = [...group.querySelectorAll("button")];

    // Exactly one chip is in the tab order.
    expect(buttons.filter((b) => b.tabIndex === 0)).toHaveLength(1);

    buttons[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(buttons[1]);

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(buttons[0]);

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
  });

  it("selects with the keyboard", async () => {
    const user = userEvent.setup();
    render(<InterestSelector />);

    const group = screen.getByRole("group");
    const first = group.querySelector("button")!;
    first.focus();
    await user.keyboard("{Enter}");
    expect(first).toHaveAttribute("aria-pressed", "true");
  });
});
