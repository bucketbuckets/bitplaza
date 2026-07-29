"use client";

import { useState } from "react";

import { SuccessState } from "@/components/waitlist/success-state";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import type { WaitlistSuccess } from "@/lib/waitlist/types";

/**
 * The waitlist block (#waitlist): the form, then the celebration-and-share
 * state in its place. Composed inside the closing section rather than owning
 * a band of its own, so the email ask comes after the visitor has picked a
 * path.
 */
export function WaitlistBlock() {
  const [result, setResult] = useState<{ success: WaitlistSuccess; userType: string } | null>(
    null,
  );

  return result ? (
    <SuccessState
      result={result.success}
      leader={result.userType === "COMMUNITY_LEADER"}
    />
  ) : (
    <WaitlistForm onSuccess={(success, userType) => setResult({ success, userType })} />
  );
}
