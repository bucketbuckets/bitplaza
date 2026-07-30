"use client";

import { useEffect, useRef } from "react";

import { WAITLIST } from "@/content/waitlist";

/**
 * The "check your inbox" state (double opt-in): what the form becomes after
 * a live submit. Deliberately quieter than SuccessState — the celebration,
 * the position and the referral link all wait on the /confirmed page, so the
 * one job here is sending the person to their email.
 */
export function PendingState({
  email,
}: {
  /** As typed into the form — the address the link actually went to. */
  email: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-display-2 text-ink outline-none"
      >
        {WAITLIST.pending.heading}
      </h3>
      <p className="text-body-lg text-ink">{WAITLIST.pending.body(email)}</p>
      <p className="text-sm text-ink-muted">{WAITLIST.pending.spamNote}</p>
    </div>
  );
}
