# Eatprint

Eatprint is a small personal food diary web app focused on observation, habits, and gentle nutrition-related insights rather than strict calorie tracking.

## Live Demo
https://eatprint.vercel.app/

## Product Idea
Eatprint is designed to help users observe their relationship with food over time.

Instead of behaving like a strict calorie tracker, the product is intended to support questions such as:

- What have I been eating lately?
- Am I eating proper meals or mostly snacking?
- What foods do I keep craving?
- Do I tend to want sweets at certain times?
- Are my eating habits changing from week to week?

Calories and macros may exist as supporting information, but they are not the main point of the experience.

## Current Status
This pass added optional, link-based cloud persistence — no accounts, no
passwords. See "Diary persistence" below for how it works and its limits.

This pass also reworked the diary around **time**, not fixed meal categories.
Each entry is "when + what" (plus optional lightweight feeling tags), shown
as a chronological list — not breakfast/lunch/dinner/snack sections. Time
is editable via a simple time picker on every entry. Entries can now be
edited and deleted. The week view shows a day-by-day timeline of what and
when was eaten, instead of meal-type counters, so timing rhythm across days
is visible directly.

State is now persisted via a link-based diary id (see "Diary persistence"
below). Body measurements, drink tracking, real AI parsing, and richer
context are still deliberately postponed to later passes. See
`src/components/` for the screen structure.

The broader MVP direction is:

- lightweight personal food diary
- simple onboarding
- link-based access, no accounts or passwords
- focus on food logging first
- AI features are optional and not part of the core MVP foundation

## Diary persistence — link-based, no login

Eatprint has no accounts, no passwords, and no sign-up. Instead, a random
diary id is generated on first visit and put in the URL (`?id=...`) —
**that link is the only way to get back into a diary.** A one-time banner
explains this clearly and offers a "Copy link" action; a small "Copy diary
link" button in the header stays available afterward for later reference.

**Be precise about what this is and isn't:** this is link-based access, not
secure authentication. Anyone who has the link can view and edit that
diary. There's no password, no recovery flow, and no account tied to an
email — if the link is lost, that diary's data is not recoverable through
the app.

**How it works:**
- `src/utils/diaryId.ts` generates the id using `crypto.randomUUID()` (with
  a `crypto.getRandomValues()` fallback) — real cryptographic randomness,
  since the id doubles as the access key, not `Math.random()`.
- The **URL's id is the single source of truth** whenever present.
  `localStorage` only remembers the last-used id as a convenience, so that
  visiting the bare domain with no `?id=` resumes your last diary instead
  of silently creating an empty new one — it never overrides an id that's
  actually in the URL.
- `api/diary.ts` (a Vercel Function) is a thin GET/POST proxy in front of
  Upstash Redis: the whole diary is one JSON blob per id, no schema, no
  migrations.
- `src/hooks/useDiaryStorage.ts` loads on mount and saves on every change
  (debounced ~600ms), mirroring to `localStorage` on this device as a
  fallback if the API is unreachable or `UPSTASH_REDIS_REST_*` isn't
  configured yet (the API responds `503`, honestly, rather than a fake
  `200` — the graceful fallback is a frontend UX choice, not something the
  API pretends succeeded).

**Save model (MVP, intentionally simple):** every save overwrites the
entire diary blob — there's no merge or diff logic. If two tabs or devices
save around the same time, the last write to reach the server silently
wins. That's an acceptable trade-off for a single-person MVP diary, but it
means this isn't yet safe for simultaneous multi-device editing.

**Enabling it:** see `.env.example` — get a free Upstash Redis database (no
credit card) via the Vercel Marketplace or upstash.com, then set
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel's
Environment Variables. Without them, the diary still works, just
local-to-this-device only.

## Goals for the MVP
- Make food logging easy and low-friction
- Keep the product lightweight and inexpensive to run
- Prioritize diary usability over advanced analytics
- Preserve room for future observation and insight features

## Tech Stack
- React
- TypeScript
- Vite
- Vercel

## Planned Documentation
This project is also being used as a QA-oriented portfolio piece.

Planned supporting documentation includes:

- product requirements
- MVP scope and acceptance criteria
- test plan
- test checklist
- risk and edge-case analysis

## Development

Install dependencies:

```bash
npm install
