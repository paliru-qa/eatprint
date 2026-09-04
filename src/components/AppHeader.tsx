import styles from "./AppHeader.module.css";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.wordmark}>Eatprint</h1>
      <p className={styles.tagline}>Make your eating visible.</p>
    </header>
  );
}
