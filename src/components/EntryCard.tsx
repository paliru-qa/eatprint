import { useState } from "react";
import type { Entry } from "../types";
import { formatTime, toTimeInputValue } from "../utils/date";
import { EntryForm } from "./EntryForm";
import type { EntryFormValues } from "./EntryForm";
import styles from "./EntryCard.module.css";

interface Props {
  entry: Entry;
  onUpdate: (values: EntryFormValues) => void;
  onDelete: () => void;
}

export function EntryCard({ entry, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EntryForm
        initial={{ text: entry.text, time: toTimeInputValue(entry.time), tags: entry.tags ?? [] }}
        onSave={(values) => {
          onUpdate(values);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
        onDelete={onDelete}
      />
    );
  }

  return (
    <button type="button" className={styles.card} onClick={() => setEditing(true)}>
      <div className={styles.main}>
        <span className={styles.time}>{formatTime(entry.time)}</span>
        <span className={styles.text}>{entry.text}</span>
        {entry.tags && entry.tags.length > 0 && (
          <div className={styles.tags}>
            {entry.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.side}>
        {/* Reserved for the next pass: nutrition breakdown from the local
            reference database and an optional AI observation. Placed here,
            to the right of the entry, so the layout already shows where
            this information will live. */}
        <div className={styles.placeholderRow}>Nutrition details — coming soon</div>
        <div className={styles.placeholderRow}>AI observation — coming soon</div>
      </div>
    </button>
  );
}
