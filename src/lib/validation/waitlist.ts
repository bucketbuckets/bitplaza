import { z } from "zod";

import { COMMUNITY_IDS, MAX_COMMUNITIES } from "@/lib/communities";

/**
 * The waitlist contract, shared client ↔ server. The client uses it through
 * react-hook-form for inline errors; the server re-parses unconditionally —
 * the client copy is a courtesy, the server copy is the boundary.
 *
 * This module must stay importable from the browser: schemas only, no Node
 * built-ins, no Prisma.
 */

export const USER_TYPES = [
  "COMMUNITY_MEMBER",
  "BUILDER",
  "COMMUNITY_LEADER",
  "ORGANIZATION",
  "INVESTOR_PARTNER",
] as const;

export type UserTypeValue = (typeof USER_TYPES)[number];

/** Labels live here so the form and the CSV export agree on wording. */
export const USER_TYPE_OPTIONS: readonly { value: UserTypeValue; label: string }[] = [
  { value: "COMMUNITY_MEMBER", label: "Community member" },
  { value: "BUILDER", label: "Builder or developer" },
  { value: "COMMUNITY_LEADER", label: "Community leader or organizer" },
  { value: "ORGANIZATION", label: "Organization or brand" },
  { value: "INVESTOR_PARTNER", label: "Investor or partner" },
];

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "That email address is too long.")
  .email("That doesn't look like an email address — check for typos.");

const firstName = z
  .string()
  .trim()
  .min(1, "Tell us what to call you.")
  .max(80, "Keep it under 80 characters.");

const communities = z
  .array(z.enum(COMMUNITY_IDS))
  .max(MAX_COMMUNITIES, `Choose up to ${MAX_COMMUNITIES} communities.`)
  .default([]);

/** Free text is bounded everywhere — an unbounded field is a storage attack. */
const shortText = (max: number) => z.string().trim().max(max).optional();

/**
 * Everything the browser sends to POST /api/waitlist. The anti-bot fields
 * (`nickname` honeypot, `startedAt` timing) are part of the contract on
 * purpose: the server decides what they mean, the schema only shapes them.
 */
export const waitlistSubmissionSchema = z.object({
  email,
  firstName,
  userType: z.enum(USER_TYPES, {
    errorMap: () => ({ message: "Choose the option closest to you." }),
  }),
  communities,
  primaryGoal: shortText(500),
  consent: z.literal(true, {
    errorMap: () => ({ message: "We need your permission to email you." }),
  }),

  referralCode: shortText(32),
  utmSource: shortText(100),
  utmMedium: shortText(100),
  utmCampaign: shortText(100),

  turnstileToken: shortText(4096),
  /** Honeypot. Humans never see it; the server treats non-empty as a bot. */
  nickname: z.string().max(200).optional(),
  /** Epoch ms when the form was first interacted with — the timing trap. */
  startedAt: z.number().int().nonnegative().optional(),
});

export type WaitlistSubmission = z.infer<typeof waitlistSubmissionSchema>;

/** The fields react-hook-form owns; the rest is attached at submit time. */
export const waitlistFormSchema = waitlistSubmissionSchema.pick({
  email: true,
  firstName: true,
  userType: true,
  primaryGoal: true,
  consent: true,
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

export const COMMUNITY_SIZE_OPTIONS = [
  "Fewer than 100",
  "100 – 1,000",
  "1,000 – 10,000",
  "More than 10,000",
] as const;

export const communityApplicationSchema = z.object({
  email,
  firstName,
  communityName: z
    .string()
    .trim()
    .min(1, "What is your community called?")
    .max(120, "Keep the name under 120 characters."),
  communitySize: z.enum(COMMUNITY_SIZE_OPTIONS, {
    errorMap: () => ({ message: "Pick the closest size." }),
  }),
  currentTools: z
    .array(z.string().trim().min(1).max(60))
    .max(10, "List up to ten tools.")
    .default([]),
  primaryProblem: z
    .string()
    .trim()
    .min(1, "Tell us the problem you most want solved.")
    .max(1000, "Keep it under 1,000 characters."),
  plazaVision: z
    .string()
    .trim()
    .min(1, "Tell us what your plaza would make possible.")
    .max(1000, "Keep it under 1,000 characters."),
  website: z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), {
      message: "Enter a full link, starting with http:// or https://.",
    })
    .optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "We need your permission to email you." }),
  }),

  referralCode: shortText(32),
  utmSource: shortText(100),
  utmMedium: shortText(100),
  utmCampaign: shortText(100),

  turnstileToken: shortText(4096),
  nickname: z.string().max(200).optional(),
  startedAt: z.number().int().nonnegative().optional(),
});

export type CommunityApplication = z.infer<typeof communityApplicationSchema>;

export const researchResponseSchema = z.object({
  /** The signup's referral code identifies the respondent — never a raw id. */
  referralCode: z.string().trim().min(1).max(32),
  question: z.string().trim().min(1).max(200),
  response: z
    .string()
    .trim()
    .min(1, "Write a sentence or two.")
    .max(2000, "Keep it under 2,000 characters."),
});

export type ResearchResponseInput = z.infer<typeof researchResponseSchema>;
