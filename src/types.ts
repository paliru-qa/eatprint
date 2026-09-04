// Minimal types for this product-shape pass. Deliberately no nutrition
// fields, no context/mood fields, no ids beyond what's needed to render a
// list — those all belong to the next pass once real data/AI logic lands.

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export interface Meal {
  id: string;
  type: MealType;
  /** Free-text description as typed by the user. */
  text: string;
  /** ISO timestamp of when the meal was logged. */
  time: string;
}

/** All meals for a single day, keyed by ISO date ("YYYY-MM-DD"). */
export type MealsByDate = Record<string, Meal[]>;
