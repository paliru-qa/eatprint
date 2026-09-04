import { useState } from "react";
import type { MealsByDate } from "../types";
import { addDays, formatShortDate, formatWeekRange, startOfWeek, todayIso, weekDates } from "../utils/date";
import { EmptyState } from "./EmptyState";
import { WeekPatternsPlaceholder } from "./WeekPatternsPlaceholder";
import styles from "./WeekView.module.css";

export function WeekView({
  mealsByDate,
  onOpenDay,
}: {
  mealsByDate: MealsByDate;
  onOpenDay: (date: string) => void;
}) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(todayIso()));
  const dates = weekDates(weekStart);
  const anyRecorded = dates.some((d) => (mealsByDate[d] ?? []).length > 0);

  return (
    <div className={styles.page}>
      <nav className={styles.weekNav} aria-label="Week navigation">
        <button type="button" className={styles.arrow} onClick={() => setWeekStart((w) => addDays(w, -7))} aria-label="Previous week">
          ‹
        </button>
        <span className={styles.weekLabel}>{formatWeekRange(weekStart)}</span>
        <button type="button" className={styles.arrow} onClick={() => setWeekStart((w) => addDays(w, 7))} aria-label="Next week">
          ›
        </button>
      </nav>

      {!anyRecorded ? (
        <EmptyState
          title="No meals recorded this week yet"
          description="Once you log a few meals, you'll see this week's shape here."
        />
      ) : (
        <WeekPatternsPlaceholder dates={dates} mealsByDate={mealsByDate} />
      )}

      <div className={styles.breakdown}>
        <span className={styles.label}>Days</span>
        {dates.map((date) => {
          const count = (mealsByDate[date] ?? []).length;
          return (
            <button key={date} className={styles.dayRow} onClick={() => onOpenDay(date)}>
              <span className={styles.dayDate}>{formatShortDate(date)}</span>
              <span className={count > 0 ? styles.dayCount : styles.dayEmpty}>
                {count > 0 ? `${count} meal${count === 1 ? "" : "s"}` : "No meals"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
