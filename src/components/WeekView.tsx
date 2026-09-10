import { useState } from "react";
import type { EntriesByDate } from "../types";
import { addDays, formatShortDate, formatTime, formatWeekRange, startOfWeek, todayIso, weekDates } from "../utils/date";
import { EmptyState } from "./EmptyState";
import styles from "./WeekView.module.css";

export function WeekView({
  entriesByDate,
  onOpenDay,
}: {
  entriesByDate: EntriesByDate;
  onOpenDay: (date: string) => void;
}) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(todayIso()));
  const dates = weekDates(weekStart);
  const anyRecorded = dates.some((d) => (entriesByDate[d] ?? []).length > 0);

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
          title="No entries recorded this week yet"
          description="Once you log a few entries, you'll see what and when you ate across the week here."
        />
      ) : (
        <div className={styles.table}>
          {dates.map((date) => {
            const entries = [...(entriesByDate[date] ?? [])].sort((a, b) => a.time.localeCompare(b.time));
            return (
              <button key={date} type="button" className={styles.dayRow} onClick={() => onOpenDay(date)}>
                <span className={styles.dayDate}>{formatShortDate(date)}</span>
                {entries.length === 0 ? (
                  <span className={styles.dayEmpty}>No entries</span>
                ) : (
                  <ul className={styles.dayEntries}>
                    {entries.map((entry) => (
                      <li key={entry.id} className={styles.dayEntry}>
                        <span className={styles.entryTime}>{formatTime(entry.time)}</span>
                        <span className={styles.entryText}>{entry.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
