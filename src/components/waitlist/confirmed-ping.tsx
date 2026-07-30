"use client";

import { useEffect } from "react";

import { capture } from "@/lib/analytics/client";

/**
 * Fires the one number double opt-in makes worth watching: the confirm rate
 * (waitlist_confirmed / waitlist_completed status:"pending"). Rendered only
 * on /confirmed's ok state; a repeat click on the same link arrives with
 * duplicate: true so revisits don't inflate the conversion.
 */
export function ConfirmedPing({ duplicate }: { duplicate: boolean }) {
  useEffect(() => {
    capture("waitlist_confirmed", { duplicate });
  }, [duplicate]);

  return null;
}
