import { addDays, formatDisplayDate, todayIso } from "../utils/date";
import styles from "./DateNav.module.css";

export function DateNav({ date, onChange }: { date: string; onChange: (date: string) => void }) {
  const isToday = date === todayIso();

  return (
    <nav className={styles.nav} aria-label="Date navigation">
      <button type="button" className={styles.arrow} onClick={() => onChange(addDays(date, -1))} aria-label="Previous day">
        ‹
      </button>
      <div className={styles.center}>
        <span className={styles.dateLabel}>{formatDisplayDate(date)}</span>
        {!isToday && (
          <button type="button" className={styles.todayLink} onClick={() => onChange(todayIso())}>
            Back to today
          </button>
        )}
      </div>
      <button type="button" className={styles.arrow} onClick={() => onChange(addDays(date, 1))} aria-label="Next day">
        ›
      </button>
    </nav>
  );
}
