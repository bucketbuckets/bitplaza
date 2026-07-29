"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError, Label, Textarea } from "@/components/ui/field";
import { WAITLIST } from "@/content/waitlist";
import { capture } from "@/lib/analytics/client";
import type { WaitlistSuccess } from "@/lib/waitlist/types";

/**
 * The success state — the one place exclamation marks are allowed (§19.3),
 * and the moment the site turns a signup into more signups. Celebrate
 * briefly, hand over the referral link, make sharing one tap, then ask the
 * one research question as a gift, not a gate.
 */
export function SuccessState({ result }: { result: WaitlistSuccess }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  // Safe to read during render: this component only ever mounts after a
  // submit, so it is never server-rendered and cannot mismatch on hydration.
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const shareText = WAITLIST.success.share.shareText(result.referralUrl);

  const copyLink = async (method: "button" | "keyboard") => {
    try {
      await navigator.clipboard.writeText(result.referralUrl);
      setCopied(true);
      capture("referral_link_copied", { method });
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be denied; the visible URL below stays selectable.
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ text: shareText });
    } catch {
      // Dismissed the sheet — not an error.
    }
  };

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-display-2 text-ink outline-none"
        >
          {result.duplicate ? WAITLIST.success.duplicateHeading : WAITLIST.success.heading}
        </h3>
        <p className="mt-3 text-body-lg text-ink">
          {result.duplicate
            ? WAITLIST.success.duplicateLine(result.position)
            : WAITLIST.success.positionLine(result.position)}
        </p>
        {!result.duplicate ? (
          <p className="mt-2 text-ink-muted">{WAITLIST.success.emailNote}</p>
        ) : null}
      </div>

      <div className="rounded-card border border-edge bg-raised p-6 shadow-soft sm:p-8">
        <p className="font-display text-heading-1 text-ink">{WAITLIST.success.share.heading}</p>
        <p className="mt-2 text-ink-muted">{WAITLIST.success.share.support}</p>

        <p className="mt-5 rounded-field border border-edge bg-surface px-4 py-3 font-mono text-sm break-all text-ink select-all">
          {result.referralUrl}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={() => copyLink("button")}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "c") {
                event.preventDefault();
                void copyLink("keyboard");
              }
            }}
          >
            {copied ? WAITLIST.success.share.copied : WAITLIST.success.share.copy}
          </Button>

          <Button asChild size="lg" variant="secondary">
            <a href={xShareUrl} target="_blank" rel="noopener noreferrer">
              {WAITLIST.success.share.shareOnX}
            </a>
          </Button>

          {canNativeShare ? (
            <Button type="button" size="lg" variant="secondary" onClick={nativeShare}>
              {WAITLIST.success.share.nativeShare}
            </Button>
          ) : null}
        </div>
      </div>

      <ResearchQuestion referralCode={result.referralCode} />
    </div>
  );
}

function ResearchQuestion({ referralCode }: { referralCode: string }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (status === "done") {
    return <p className="text-ink-muted">{WAITLIST.success.research.thanks}</p>;
  }

  const send = async () => {
    if (value.trim() === "") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/research-response", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          referralCode,
          question: WAITLIST.success.research.question,
          response: value.trim(),
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="wl-research" optional={WAITLIST.success.research.label}>
        {WAITLIST.success.research.question}
      </Label>
      <Textarea
        id="wl-research"
        rows={2}
        value={value}
        maxLength={2000}
        placeholder={WAITLIST.success.research.placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
      {status === "error" ? (
        <FieldError id="wl-research-error">
          That didn&apos;t send — try once more in a minute.
        </FieldError>
      ) : null}
      <div>
        <Button
          type="button"
          variant="secondary"
          onClick={send}
          disabled={status === "sending" || value.trim() === ""}
        >
          {WAITLIST.success.research.submit}
        </Button>
      </div>
    </div>
  );
}
