import styles from "./DiaryLinkBanner.module.css";

export function DiaryLinkBanner({ onDismiss }: { onDismiss: () => void }) {
  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
  }

  return (
    <div className={styles.banner} role="status">
      <p className={styles.text}>
        This page's link is your diary — there's no password. Save or bookmark it now;
        anyone with the link can see and edit these entries, and losing it means losing access.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primaryButton} onClick={copyLink}>
          Copy link
        </button>
        <button type="button" className={styles.ghostButton} onClick={onDismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
