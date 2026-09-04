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
This pass turns the app into a real Eatprint MVP shell: Today view with
meal-type sections and logged times, Week view with day navigation and a
patterns summary, and clearly marked placeholders for nutrition details and
AI observations (both intentionally postponed).

State is in-memory only for now (resets on refresh) — no persistence yet,
even local. This was a deliberate scope choice for this pass: prioritize
product shape and UI clarity before adding data durability, a nutrition
engine, or AI. See `src/components/` for the screen structure.

The broader MVP direction is:

- lightweight personal food diary
- simple onboarding
- likely no authentication in Phase 1
- focus on food logging first
- cloud persistence and diary identity under consideration
- AI features are optional and not part of the core MVP foundation

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
