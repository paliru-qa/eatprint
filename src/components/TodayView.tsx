import { useState } from "react";
import type { EntriesByDate } from "../types";
import { DateNav } from "./DateNav";
import { EmptyState } from "./EmptyState";
import { EntryCard } from "./EntryCard";
import { EntryForm } from "./EntryForm";
import type { EntryFormValues } from "./EntryForm";
import styles from "./TodayView.module.css";

interface Props {
  date: string;
  entriesByDate: EntriesByDate;
  onChangeDate: (date: string) => void;
  onAddEntry: (date: string, values: EntryFormValues) => void;
  onUpdateEntry: (date: string, id: string, values: EntryFormValues) => void;
  onDeleteEntry: (date: string, id: string) => void;
}

export function TodayView({ date, entriesByDate, onChangeDate, onAddEntry, onUpdateEntry, onDeleteEntry }: Props) {
  const [adding, setAdding] = useState(false);
  const entries = entriesByDate[date] ?? [];

  // Chronological, not grouped by type — the point is to see the shape of
  // the day (when things happened), not a breakfast/lunch/dinner checklist.
  const sorted = [...entries].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className={styles.page}>
      <DateNav date={date} onChange={onChangeDate} />

      {sorted.length === 0 && !adding && (
        <EmptyState title="Nothing here yet" description="Start by recording what you ate below." />
      )}

      <div className={styles.list}>
        {sorted.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onUpdate={(values) => onUpdateEntry(date, entry.id, values)}
            onDelete={() => onDeleteEntry(date, entry.id)}
          />
        ))}
      </div>

      {adding ? (
        <EntryForm
          onSave={(values) => {
            onAddEntry(date, values);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button type="button" className={styles.addButton} onClick={() => setAdding(true)}>
          + Add entry
        </button>
      )}
    </div>
  );
}
