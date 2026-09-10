// Time-based eating journal entries. Deliberately no meal-type/category as
// a structural field this pass — an entry is just "when" + "what", plus a
// small optional set of lightweight context tags. Categories may return
// later as optional metadata if useful, but they are not the main shape.

/** A small, fixed, optional set of lightweight context tags per entry. */
export const ENTRY_TAGS = [
  "very hungry",
  "small portion",
  "overate",
  "wanted something sweet",
  "wanted something salty",
  "satisfied",
] as const;

export type EntryTag = (typeof ENTRY_TAGS)[number];

export interface Entry {
  id: string;
  /** Free-text description as typed by the user, in any language. */
  text: string;
  /** ISO timestamp — the actual moment this was eaten. First-class and editable. */
  time: string;
  /** Optional, lightweight — at most a few tags, never required. */
  tags?: EntryTag[];
}

/** All entries for a single day, keyed by ISO date ("YYYY-MM-DD"). */
export type EntriesByDate = Record<string, Entry[]>;
