import { useState } from "react";
import styles from "./AppHeader.module.css";

export function AppHeader() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.wordmark}>Eatprint</h1>
          <p className={styles.tagline}>Make your eating visible.</p>
        </div>
        <button type="button" className={styles.copyLinkButton} onClick={copyLink}>
          {copied ? "Copied!" : "Copy diary link"}
        </button>
      </div>
    </header>
  );
}
