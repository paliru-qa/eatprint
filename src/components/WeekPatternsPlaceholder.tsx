import { MEAL_TYPES } from "../types";
import type { MealsByDate } from "../types";
import styles from "./WeekPatternsPlaceholder.module.css";

const LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

/**
 * Meal-type coverage and snack count are genuinely cheap to compute from
 * what's already in memory, so they're real numbers, not placeholders.
 * Sweet-food/vegetable-day detection needs the nutrition reference database
 * (next pass) to know what category a food belongs to — those stay as
 * honest placeholders rather than fake numbers.
 */
export function WeekPatternsPlaceholder({ dates, mealsByDate }: { dates: string[]; mealsByDate: MealsByDate }) {
  const daysRecorded = dates.filter((d) => (mealsByDate[d] ?? []).length > 0).length;

  const coverage: Record<string, number> = { breakfast: 0, lunch: 0, dinner: 0 };
  let totalSnacks = 0;

  for (const date of dates) {
    const meals = mealsByDate[date] ?? [];
    const typesToday = new Set(meals.map((m) => m.type));
    for (const type of Object.keys(coverage)) {
      if (typesToday.has(type as never)) coverage[type] += 1;
    }
    totalSnacks += meals.filter((m) => m.type === "snack").length;
  }

  return (
    <div className={styles.card}>
      <span className={styles.sectionLabel}>This week</span>
      <div className={styles.grid}>
        {MEAL_TYPES.filter((t) => t !== "snack").map((type) => (
          <div key={type} className={styles.stat}>
            <span className={styles.statLabel}>{LABELS[type]}</span>
            <span className={styles.statValue}>
              {coverage[type]} / {daysRecorded || 0} days
            </span>
          </div>
        ))}
        <div className={styles.stat}>
          <span className={styles.statLabel}>Snacks</span>
          <span className={styles.statValue}>{totalSnacks} total</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Sweet foods</span>
          <span className={styles.statValuePlaceholder}>— (coming soon)</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Vegetables</span>
          <span className={styles.statValuePlaceholder}>— (coming soon)</span>
        </div>
      </div>
    </div>
  );
}
