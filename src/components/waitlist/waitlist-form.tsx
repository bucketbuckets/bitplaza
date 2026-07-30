"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { WAITLIST } from "@/content/waitlist";
import { capture } from "@/lib/analytics/client";
import { getAttribution } from "@/lib/attribution/capture";
import {
  GOAL_OPTIONS,
  waitlistFormSchema,
  type WaitlistFormValues,
} from "@/lib/validation/waitlist";
import type { WaitlistResponse, WaitlistSuccess } from "@/lib/waitlist/types";

/**
 * The waitlist form: a goal and an email, nothing else. Everything beyond
 * those two is either attached invisibly (attribution, anti-bot fields,
 * consent affirmed by submitting under the visible note) or asked after
 * submission, per path, optionally.
 *
 * Form rules: labels always visible, errors via aria-describedby +
 * aria-invalid, an error summary that takes focus on a failed submit, no
 * animation. Field values survive every failure state.
 */
export function WaitlistForm({
  onSuccess,
  onPending,
}: {
  /** An already-confirmed address: straight to the celebration state. */
  onSuccess: (result: WaitlistSuccess, userType: string) => void;
  /** A live signup or re-send: the "check your inbox" state (double opt-in). */
  onPending: (email: string) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const summaryRef = useRef<HTMLDivElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<number>(0);
  const startedEventFired = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    // Validate as fields are left, not only at submit — a non-address typed
    // into the email box should be flagged while the person is still there.
    mode: "onTouched",
  });

  const fieldErrors = Object.entries(errors)
    .map(([field, error]) => ({ field, message: error?.message }))
    .filter((e): e is { field: string; message: string } => Boolean(e.message));

  // A failed submit moves focus to the summary; field-level messages remain
  // wired per input.
  useEffect(() => {
    if (submitCount > 0 && (fieldErrors.length > 0 || serverError)) {
      summaryRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, serverError]);

  const onFirstInteraction = () => {
    if (startedEventFired.current) return;
    startedEventFired.current = true;
    capture("waitlist_started", { source: "direct" });
  };

  // Not wrapped in handleSubmit here: calling handleSubmit during render trips
  // react-hooks/refs (the callback reads refs). It is applied in onSubmit.
  const onValid = async (values: WaitlistFormValues) => {
    setServerError(null);
    const attribution = getAttribution();

    let response: WaitlistResponse;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          // Submitting under the visible note IS the consent; the server
          // still refuses a payload that does not affirm it.
          consent: true,
          referralCode: attribution.ref,
          utmSource: attribution.utmSource,
          utmMedium: attribution.utmMedium,
          utmCampaign: attribution.utmCampaign,
          turnstileToken,
          nickname: nicknameRef.current?.value ?? "",
          startedAt: startedAtRef.current || undefined,
        }),
      });
      response = (await res.json()) as WaitlistResponse;
    } catch {
      capture("waitlist_failed", { reason: "network" });
      setServerError("The request didn't go through. Check your connection and try again.");
      return;
    }

    if (!response.ok) {
      capture("waitlist_failed", { reason: "server" });
      if (response.fieldErrors) {
        for (const [field, message] of Object.entries(response.fieldErrors)) {
          if (field === "email" || field === "userType") {
            setError(field, { message });
          }
        }
      }
      setServerError(response.error);
      return;
    }

    if (response.status === "pending") {
      capture("waitlist_completed", {
        user_type: values.userType,
        has_referrer: Boolean(attribution.ref),
        status: "pending",
      });
      // Attribution is recorded server-side; the referrer's credit itself
      // lands when the emailed link is clicked.
      if (attribution.ref) {
        capture("referral_signup_completed", {});
      }
      onPending(values.email);
      return;
    }

    capture("waitlist_completed", {
      user_type: values.userType,
      has_referrer: Boolean(attribution.ref),
      status: "confirmed",
      duplicate: response.duplicate,
    });

    onSuccess(response, values.userType);
  };

  const onInvalid = () => {
    capture("waitlist_failed", { reason: "validation" });
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(onValid, onInvalid)(event)}
      onFocus={onFirstInteraction}
      noValidate
      className="relative flex flex-col gap-6"
    >
      {(fieldErrors.length > 0 || serverError) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-card border border-danger/30 border-l-[3px] border-l-danger bg-raised p-4"
        >
          <p className="font-semibold text-ink">{WAITLIST.form.errorSummaryHeading}</p>
          <ul className="mt-2 list-inside list-disc text-sm text-ink-muted">
            {serverError ? <li>{serverError}</li> : null}
            {fieldErrors.map(({ field, message }) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* The goal first: the path decides what happens after the email. Native
          radios inside a fieldset, styled as cards; the input stays real for
          keyboard and screen-reader behavior. */}
      <fieldset
        aria-describedby={errors.userType ? "wl-userType-error" : undefined}
        className="flex flex-col gap-2"
      >
        <legend className="text-sm font-semibold text-ink">{WAITLIST.form.goal.legend}</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {GOAL_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="group flex cursor-pointer flex-col gap-1 rounded-card border-[1.5px] border-edge bg-raised p-4 transition-colors hover:border-edge-strong has-checked:border-ink"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  value={option.value}
                  className="size-4 accent-[color:var(--color-apricot)]"
                  {...register("userType")}
                />
                <span className="font-semibold text-ink">{option.label}</span>
              </span>
              <span className="pl-6.5 text-sm text-ink-muted">{option.hint}</span>
            </label>
          ))}
        </div>
        <FieldError id="wl-userType-error">{errors.userType?.message}</FieldError>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="wl-email">{WAITLIST.form.email.label}</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="wl-email"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={WAITLIST.form.email.placeholder}
            autoComplete={WAITLIST.form.email.autoComplete}
            className="sm:max-w-sm"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "wl-email-error" : undefined}
            {...register("email")}
          />
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? WAITLIST.form.submitting : WAITLIST.form.submit}
          </Button>
        </div>
        <FieldError id="wl-email-error">{errors.email?.message}</FieldError>
      </div>

      <p className="measure-wide text-sm text-ink-faint">{WAITLIST.form.consentNote}</p>

      {/* Honeypot. Hidden from people and assistive tech alike; a submission
          that fills it was made by nothing human. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="wl-nickname">Nickname</label>
        <input
          ref={nicknameRef}
          id="wl-nickname"
          name="nickname"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {turnstileSiteKey ? (
        <Turnstile
          siteKey={turnstileSiteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(undefined)}
          options={{ theme: "auto", size: "flexible" }}
        />
      ) : null}
    </form>
  );
}
