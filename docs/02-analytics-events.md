# Analytics event taxonomy

The catalogue is closed and typed: `src/lib/analytics/events.ts` is the single
source of truth, `capture()` refuses names that are not in it at compile time,
and a development-mode guard throws if a payload carries a forbidden key
(email, name, referral code, free text, IP, phone). Properties are
low-cardinality enums, booleans and stable content ids only.

PostHog runs with autocapture, session recording, heatmaps, performance
capture and IP collection all off, `persistence: "memory"`, and is inert
without `NEXT_PUBLIC_POSTHOG_KEY`. The footer opt-out and DNT/GPC are hard
stops (`src/lib/analytics/consent.ts`).

## Events

| Event | Properties | Fires when |
|---|---|---|
| `page_view` | `path` | Each route render, including client navigations. |
| `hero_cta_clicked` | `cta: primary \| secondary` | A hero pathway is clicked (primary = Explore Bitcoin, secondary = Map your community). |
| `preview_engaged` | `choice: learn \| build \| meet \| work` | A goal is chosen in the hero's interactive map preview. |
| `path_selected` | `path_id`, `location: home \| bitcoin` | A path is opened or expanded. `path_id` is the stable id from `src/content/paths.ts`. |
| `territory_opened` | `territory_id`, `location: home \| bitcoin` | A territory is opened in the hub preview. Ids from `src/content/hub-preview.ts`. |
| `leader_cta_clicked` | `location: header \| hero \| section \| closing \| footer` | Any "Map your community" action. |
| `waitlist_started` | `source: header \| hero \| closing \| footer \| bitcoin \| direct` | The form receives first focus, or a CTA that scrolls to it is clicked. |
| `waitlist_completed` | `user_type`, `has_referrer`, `duplicate` | The API confirmed the signup. `duplicate` means the address was already on the list. |
| `waitlist_failed` | `reason: validation \| network \| server` | A submission did not succeed. Never carries field contents. |
| `architecture_link_clicked` | `location: section \| footer` | The /open page opened from a tracked link. |
| `repo_link_clicked` | `location: section \| open_page` | Reserved: fires only once a public repository link exists. |
| `faq_opened` | `question_id` | An FAQ item expanded. Ids are stable in `src/content/faq.ts`; rewording a question does not reset the metric. |
| `referral_link_copied` | `method: button \| keyboard` | The referral link copied from the success state. |
| `referral_signup_completed` | — | On the referred person's device when their signup lands. |
| `community_application_started` | — | First focus in the community application. |
| `community_application_completed` | `community_size` | The application was accepted by the API. |

## Rules for adding an event

1. Add it to `EventMap` first; the type error trail shows every call site.
2. No PII, no free text, no per-user identifiers. If it is unique to one
   person, it belongs in the database, not the event stream.
3. Use stable content ids (`path_id`, `territory_id`, `question_id`) so copy
   rewrites do not reset metrics.
4. Update this document in the same change.
