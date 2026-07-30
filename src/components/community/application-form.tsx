"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { COMMUNITIES_PAGE } from "@/content/communities-page";
import { WAITLIST } from "@/content/waitlist";
import { capture } from "@/lib/analytics/client";
import { getAttribution } from "@/lib/attribution/capture";
import {
  COMMUNITY_SIZE_OPTIONS,
  communityApplicationSchema,
} from "@/lib/validation/waitlist";
import type { ApplicationResponse, ApplicationSuccess } from "@/lib/waitlist/types";

/**
 * The community-leader application. Same form rules and the same defence
 * payload as the waitlist form; the one extra shape is `currentTools`, which
 * people type as a comma-separated line and the form splits before Zod sees
 * it. Consent is affirmed by submitting under the visible note, exactly as on
 * the waitlist form.
 */

const formSchema = communityApplicationSchema
  .pick({
    firstName: true,
    email: true,
    communityName: true,
    communitySize: true,
    primaryProblem: true,
    plazaVision: true,
    website: true,
  })
  .extend({
    /** As typed; split into the array at submit time. */
    currentToolsRaw: z.string().trim().max(700).optional(),
  });

type FormValues = z.infer<typeof formSchema>;

export function splitTools(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((tool) => tool.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map((tool) => tool.slice(0, 60));
}

export function ApplicationForm() {
  const CONTENT = COMMUNITIES_PAGE.form;
  const [result, setResult] = useState<ApplicationSuccess | null>(null);
  const [pending, setPending] = useState<{ email: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<number>(0);
  const startedEventFired = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (result || pending) successRef.current?.focus();
  }, [result, pending]);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), mode: "onTouched" });

  const fieldErrors = Object.entries(errors)
    .map(([field, error]) => ({ field, message: error?.message }))
    .filter((e): e is { field: string; message: string } => Boolean(e.message));

  useEffect(() => {
    if (submitCount > 0 && (fieldErrors.length > 0 || serverError)) {
      summaryRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, serverError]);

  const onFirstInteraction = () => {
    if (startedEventFired.current) return;
    startedEventFired.current = true;
    capture("community_application_started", {});
  };

  // Not wrapped in handleSubmit here: calling handleSubmit during render trips
  // react-hooks/refs (the callback reads refs). It is applied in onSubmit.
  const onValid = async (values: FormValues) => {
    setServerError(null);
    const attribution = getAttribution();

    let response: ApplicationResponse;
    try {
      const res = await fetch("/api/community-application", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          email: values.email,
          communityName: values.communityName,
          communitySize: values.communitySize,
          currentTools: splitTools(values.currentToolsRaw),
          primaryProblem: values.primaryProblem,
          plazaVision: values.plazaVision || undefined,
          website: values.website || undefined,
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
      response = (await res.json()) as ApplicationResponse;
    } catch {
      setServerError("The request didn't go through. Check your connection and try again.");
      return;
    }

    if (!response.ok) {
      if (response.fieldErrors) {
        for (const [field, message] of Object.entries(response.fieldErrors)) {
          if (field in formSchema.shape && field !== "currentToolsRaw") {
            setError(field as keyof FormValues, { message });
          }
        }
      }
      setServerError(response.error);
      return;
    }

    capture("community_application_completed", { community_size: values.communitySize });
    if (response.status === "pending") {
      setPending({ email: values.email });
      return;
    }
    setResult(response);
  };

  // Application received, address not yet confirmed (double opt-in): the
  // application is in either way; the place in line waits on the email tap.
  if (pending) {
    return (
      <div className="rounded-card border border-edge bg-raised p-8 shadow-soft">
        <h2
          ref={successRef}
          tabIndex={-1}
          className="font-display text-display-2 text-ink outline-none"
        >
          {COMMUNITIES_PAGE.success.heading}
        </h2>
        <p className="mt-4 text-body-lg text-ink-muted">{COMMUNITIES_PAGE.success.body}</p>
        <p className="mt-3 text-ink">{WAITLIST.pending.body(pending.email)}</p>
        <p className="mt-2 text-sm text-ink-muted">{WAITLIST.pending.spamNote}</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-card border border-edge bg-raised p-8 shadow-soft">
        <h2
          ref={successRef}
          tabIndex={-1}
          className="font-display text-display-2 text-ink outline-none"
        >
          {COMMUNITIES_PAGE.success.heading}
        </h2>
        <p className="mt-4 text-body-lg text-ink-muted">{COMMUNITIES_PAGE.success.body}</p>
        <p className="mt-3 text-ink-muted">
          {COMMUNITIES_PAGE.success.positionLine(result.position)}
        </p>
      </div>
    );
  }

  const invalid = (field: keyof FormValues) => Boolean(errors[field]);

  return (
    <form
      onSubmit={(event) => void handleSubmit(onValid)(event)}
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
          <p className="font-semibold text-ink">{CONTENT.errorSummaryHeading}</p>
          <ul className="mt-2 list-inside list-disc text-sm text-ink-muted">
            {serverError ? <li>{serverError}</li> : null}
            {fieldErrors.map(({ field, message }) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Email leads, full width — beside "First name" it reads as a surname
          box, and the email IS the signup. */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="ca-email">{CONTENT.email.label}</Label>
        <Input
          id="ca-email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={CONTENT.email.placeholder}
          autoComplete={CONTENT.email.autoComplete}
          aria-invalid={invalid("email")}
          aria-describedby={invalid("email") ? "ca-email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="ca-email-error">{errors.email?.message}</FieldError>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ca-firstName">{CONTENT.firstName.label}</Label>
        <Input
          id="ca-firstName"
          autoComplete={CONTENT.firstName.autoComplete}
          aria-invalid={invalid("firstName")}
          aria-describedby={invalid("firstName") ? "ca-firstName-error" : undefined}
          {...register("firstName")}
        />
        <FieldError id="ca-firstName-error">{errors.firstName?.message}</FieldError>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ca-communityName">{CONTENT.communityName.label}</Label>
          <Input
            id="ca-communityName"
            aria-invalid={invalid("communityName")}
            aria-describedby={invalid("communityName") ? "ca-communityName-error" : undefined}
            {...register("communityName")}
          />
          <FieldError id="ca-communityName-error">{errors.communityName?.message}</FieldError>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ca-communitySize">{CONTENT.communitySize.label}</Label>
          <Select
            id="ca-communitySize"
            defaultValue=""
            aria-invalid={invalid("communitySize")}
            aria-describedby={invalid("communitySize") ? "ca-communitySize-error" : undefined}
            {...register("communitySize")}
          >
            <option value="" disabled>
              {CONTENT.communitySize.placeholder}
            </option>
            {COMMUNITY_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <FieldError id="ca-communitySize-error">{errors.communitySize?.message}</FieldError>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ca-website" optional={CONTENT.website.optionalTag}>
          {CONTENT.website.label}
        </Label>
        <Input
          id="ca-website"
          type="url"
          inputMode="url"
          placeholder="https://"
          aria-invalid={invalid("website")}
          aria-describedby={invalid("website") ? "ca-website-error" : undefined}
          {...register("website")}
        />
        <FieldError id="ca-website-error">{errors.website?.message}</FieldError>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ca-currentTools">{CONTENT.currentTools.label}</Label>
        <Input
          id="ca-currentTools"
          aria-describedby="ca-currentTools-hint"
          {...register("currentToolsRaw")}
        />
        <p id="ca-currentTools-hint" className="text-sm text-ink-faint">
          {CONTENT.currentTools.hint}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ca-primaryProblem">{CONTENT.primaryProblem.label}</Label>
        <Textarea
          id="ca-primaryProblem"
          rows={3}
          aria-invalid={invalid("primaryProblem")}
          aria-describedby={invalid("primaryProblem") ? "ca-primaryProblem-error" : undefined}
          {...register("primaryProblem")}
        />
        <FieldError id="ca-primaryProblem-error">{errors.primaryProblem?.message}</FieldError>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ca-plazaVision" optional={CONTENT.plazaVision.optionalTag}>
          {CONTENT.plazaVision.label}
        </Label>
        <Textarea
          id="ca-plazaVision"
          rows={3}
          aria-invalid={invalid("plazaVision")}
          aria-describedby={invalid("plazaVision") ? "ca-plazaVision-error" : undefined}
          {...register("plazaVision")}
        />
        <FieldError id="ca-plazaVision-error">{errors.plazaVision?.message}</FieldError>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="ca-nickname">Nickname</label>
        <input
          ref={nicknameRef}
          id="ca-nickname"
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

      <div className="flex flex-col gap-3">
        <Button type="submit" size="xl" disabled={isSubmitting} className="self-start">
          {isSubmitting ? CONTENT.submitting : CONTENT.submit}
        </Button>
        <p className="measure-wide text-sm text-ink-faint">{CONTENT.consentNote}</p>
      </div>
    </form>
  );
}
