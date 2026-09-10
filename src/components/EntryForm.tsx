import { useState } from "react";
import type { FormEvent } from "react";
import { ENTRY_TAGS } from "../types";
import type { EntryTag } from "../types";
import { currentTimeInputValue } from "../utils/date";
import styles from "./EntryForm.module.css";

export interface EntryFormValues {
  text: string;
  time: string; // "HH:mm"
  tags: EntryTag[];
}

interface Props {
  initial?: EntryFormValues;
  onSave: (values: EntryFormValues) => void;
  onCancel: () => void;
  /** Only present when editing an existing entry. */
  onDelete?: () => void;
}

export function EntryForm({ initial, onSave, onCancel, onDelete }: Props) {
  const [text, setText] = useState(initial?.text ?? "");
  const [time, setTime] = useState(initial?.time ?? currentTimeInputValue());
  const [tags, setTags] = useState<EntryTag[]>(initial?.tags ?? []);

  function toggleTag(tag: EntryTag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSave({ text: text.trim(), time, tags });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className="visually-hidden" htmlFor="entry-time">
          Time
        </label>
        <input
          id="entry-time"
          type="time"
          className={styles.timeInput}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <label className="visually-hidden" htmlFor="entry-text">
          What did you eat?
        </label>
        <textarea
          id="entry-text"
          className={styles.textarea}
          placeholder="What did you eat? (any language is fine)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          autoFocus
        />
      </div>

      <div className={styles.tags} role="group" aria-label="How this felt (optional)">
        {ENTRY_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={styles.tagChip}
            data-selected={tags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        {onDelete && (
          <button type="button" className={styles.deleteButton} onClick={onDelete}>
            Delete
          </button>
        )}
        <div className={styles.rightActions}>
          <button type="button" className={styles.ghostButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton} disabled={!text.trim()}>
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
