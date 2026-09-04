import styles from "./Nav.module.css";

export type Tab = "today" | "week";

export function Nav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <button className={styles.tab} data-active={active === "today"} onClick={() => onChange("today")} aria-current={active === "today" ? "page" : undefined}>
        Today
      </button>
      <button className={styles.tab} data-active={active === "week"} onClick={() => onChange("week")} aria-current={active === "week" ? "page" : undefined}>
        Week
      </button>
    </nav>
  );
}
