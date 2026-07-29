import { Resend } from "resend";

import type { ReactElement } from "react";

/**
 * The one rule of this module: EMAIL NEVER FAILS A SIGNUP. By the time a send
 * is attempted the row is committed; an outage at the email provider must
 * surface in logs, not in the visitor's response. Every path here resolves —
 * nothing throws past this boundary.
 *
 * Without RESEND_API_KEY the module is inert (logged once per send attempt in
 * dev so "why did no mail arrive" has an answer in the terminal).
 */

let client: Resend | null | undefined;

function resend(): Resend | null {
  if (client !== undefined) return client;
  const key = process.env.RESEND_API_KEY;
  client = key ? new Resend(key) : null;
  return client;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  react: ReactElement;
  /** Plain-text alternative. Always provided — some inboxes render only this. */
  text: string;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const api = resend();
  if (!api) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`email: RESEND_API_KEY not set — skipped "${input.subject}"`);
    }
    return;
  }

  try {
    const { error } = await api.emails.send({
      from: process.env.EMAIL_FROM ?? "Bitplaza <hello@joinbitplaza.com>",
      replyTo: process.env.EMAIL_REPLY_TO || undefined,
      to: input.to,
      subject: input.subject,
      react: input.react,
      text: input.text,
    });
    if (error) {
      console.error(`email: send failed for "${input.subject}"`, error);
    }
  } catch (error) {
    console.error(`email: send threw for "${input.subject}"`, error);
  }
}
