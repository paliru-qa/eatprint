import type { Meal } from "../types";
import { formatTime } from "../utils/date";
import styles from "./MealCard.module.css";

export function MealCard({ meal }: { meal: Meal }) {
  const time = formatTime(meal.time);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.text}>{meal.text}</span>
        {time && <span className={styles.time}>{time}</span>}
      </div>

      {/* Reserved for the next pass: nutrition breakdown from the local
          reference database. Shown now so the layout communicates where
          that information will live, without pretending to calculate it. */}
      <div className={styles.placeholderRow}>Nutrition details — coming soon</div>

      {/* Reserved for the next pass: an optional AI-generated observation
          about this meal or the day it belongs to. */}
      <div className={styles.placeholderRow}>AI observation — coming soon</div>
    </article>
  );
}
