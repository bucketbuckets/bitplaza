"use client";

import { useState } from "react";

import { PendingState } from "@/components/waitlist/pending-state";
import { SuccessState } from "@/components/waitlist/success-state";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import type { WaitlistSuccess } from "@/lib/waitlist/types";

/**
 * The waitlist block (#waitlist): the form, then what replaces it. Composed
 * inside the closing section rather than owning a band of its own, so the
 * email ask comes after the visitor has picked a path.
 *
 * Since double opt-in a live signup lands on PendingState ("check your
 * inbox"); SuccessState here is reached only by an already-confirmed
 * address. The fresh celebration lives on /confirmed, where the emailed
 * link points.
 */

type BlockState =
  | { kind: "form" }
  | { kind: "pending"; email: string }
  | { kind: "success"; success: WaitlistSuccess; userType: string };

export function WaitlistBlock() {
  const [state, setState] = useState<BlockState>({ kind: "form" });

  if (state.kind === "pending") {
    return <PendingState email={state.email} />;
  }

  if (state.kind === "success") {
    return (
      <SuccessState
        result={state.success}
        leader={state.userType === "COMMUNITY_LEADER"}
      />
    );
  }

  return (
    <WaitlistForm
      onSuccess={(success, userType) => setState({ kind: "success", success, userType })}
      onPending={(email) => setState({ kind: "pending", email })}
    />
  );
}
