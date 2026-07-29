"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox, FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { WAITLIST } from "@/content/waitlist";
import { capture } from "@/lib/analytics/client";
import { getAttribution } from "@/lib/attribution/capture";
import { labelsFor } from "@/lib/communities";
import {
  USER_TYPE_OPTIONS,
  waitlistFormSchema,
  type WaitlistFormValues,
} from "@/lib/validation/waitlist";
import { useSelectedCommunities } from "@/lib/waitlist/selection-store";
import type { WaitlistResponse, WaitlistSuccess } from "@/lib/waitlist/types";

/**
 * The waitlist form. design.md §18 "Form": labels always visible, errors via
 * aria-describedby + aria-invalid, an error summary that takes focus on a
 * failed submit, no animation, no characters.
 *
 * What travels with the visible fields: the selector's communities, captured
 * `?ref`/`utm_*` attribution, the honeypot (empty for every human), the
 * mount timestamp for the timing trap, and a Turnstile token when the site
 * key is configured. The server re-validates all of it.
 */
export function WaitlistForm({ onSuccess }: { onSuccess: (result: WaitlistSuccess) => void }) {
  const selected = useSelectedCommunities();
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const summaryRef = useRef<HTMLDivElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<number>(0);

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
    defaultValues: { primaryGoal: "" },
    // Validate as fields are left, not only at submit — a surname typed into
    // the email box should be flagged while the person is still there.
    mode: "onTouched",
  });

  const fieldErrors = Object.entries(errors)
    .map(([field, error]) => ({ field, message: error?.message }))
    .filter((e): e is { field: string; message: string } => Boolean(e.message));

  // A failed submit moves focus to the summary — §18's "error summary on
  // submit that moves focus". Field-level messages remain wired per input.
  useEffect(() => {
    if (submitCount > 0 && (fieldErrors.length > 0 || serverError)) {
      summaryRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, serverError]);

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
          primaryGoal: values.primaryGoal || undefined,
          communities: selected,
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
      setServerError("The request didn't go through — check your connection and try again.");
      return;
    }

    if (!response.ok) {
      if (response.fieldErrors) {
        for (const [field, message] of Object.entries(response.fieldErrors)) {
          if (field === "email" || field === "firstName" || field === "userType" || field === "consent") {
            setError(field, { message });
          }
        }
      }
      setServerError(response.error);
      return;
    }

    capture("waitlist_completed", {
      user_type: values.userType,
      community_count: selected.length,
      has_referrer: Boolean(attribution.ref),
      duplicate: response.duplicate,
    });
    if (attribution.ref && !response.duplicate) {
      capture("referral_signup_completed", {});
    }

    onSuccess(response);
  };

  const describedBy = (field: string, hasError: boolean) =>
    hasError ? `${field}-error` : undefined;

  const selectedLabels = labelsFor(selected);

  return (
    <form
      onSubmit={(event) => void handleSubmit(onValid)(event)}
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

      {/* Email leads, alone on its row at full width. Paired beside "First
          name" it read as a surname field — the one mistake this form cannot
          afford, since the email IS the signup. */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="wl-email">{WAITLIST.form.email.label}</Label>
        <Input
          id="wl-email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={WAITLIST.form.email.placeholder}
          autoComplete={WAITLIST.form.email.autoComplete}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("wl-email", Boolean(errors.email))}
          {...register("email")}
        />
        <FieldError id="wl-email-error">{errors.email?.message}</FieldError>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="wl-firstName">{WAITLIST.form.firstName.label}</Label>
          <Input
            id="wl-firstName"
            autoComplete={WAITLIST.form.firstName.autoComplete}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy("wl-firstName", Boolean(errors.firstName))}
            {...register("firstName")}
          />
          <FieldError id="wl-firstName-error">{errors.firstName?.message}</FieldError>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="wl-userType">{WAITLIST.form.userType.label}</Label>
          <Select
            id="wl-userType"
            defaultValue=""
            aria-invalid={Boolean(errors.userType)}
            aria-describedby={describedBy("wl-userType", Boolean(errors.userType))}
            {...register("userType")}
          >
            <option value="" disabled>
              {WAITLIST.form.userType.placeholder}
            </option>
            {USER_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <FieldError id="wl-userType-error">{errors.userType?.message}</FieldError>
        </div>
      </div>

      {selectedLabels.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink">{WAITLIST.form.communitiesLegend}</p>
          <p className="text-sm text-ink-muted">
            {selectedLabels.join(" · ")}
            <span className="text-ink-faint"> — {WAITLIST.form.communitiesFromSelector}</span>
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="wl-primaryGoal" optional={WAITLIST.form.primaryGoal.optionalTag}>
          {WAITLIST.form.primaryGoal.label}
        </Label>
        <Textarea
          id="wl-primaryGoal"
          rows={2}
          placeholder={WAITLIST.form.primaryGoal.placeholder}
          {...register("primaryGoal")}
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="wl-consent"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={describedBy("wl-consent", Boolean(errors.consent))}
          {...register("consent")}
        />
        <div className="flex flex-col gap-1">
          <Label htmlFor="wl-consent" className="font-normal text-ink-muted">
            {WAITLIST.form.consent.label}
          </Label>
          <FieldError id="wl-consent-error">{errors.consent?.message}</FieldError>
        </div>
      </div>

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

      <div>
        <Button type="submit" size="xl" disabled={isSubmitting}>
          {isSubmitting ? WAITLIST.form.submitting : WAITLIST.form.submit}
        </Button>
      </div>
    </form>
  );
}
