import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./AddMealInline.module.css";

export function AddMealInline({ onAdd, onCancel }: { onAdd: (text: string) => void; onCancel: () => void }) {
  const [text, setText] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="add-meal-text">
        What did you eat?
      </label>
      <input
        id="add-meal-text"
        className={styles.input}
        placeholder="What did you eat?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <div className={styles.actions}>
        <button type="button" className={styles.ghostButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryButton} disabled={!text.trim()}>
          Save
        </button>
      </div>
    </form>
  );
}
