import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { Nav } from "./components/Nav";
import type { Tab } from "./components/Nav";
import { TodayView } from "./components/TodayView";
import type { EntryFormValues } from "./components/EntryForm";
import { WeekView } from "./components/WeekView";
import type { EntriesByDate } from "./types";
import { combineDateAndTime, todayIso } from "./utils/date";
import styles from "./App.module.css";

function seedData(): EntriesByDate {
  const today = todayIso();
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
  return {
    [today]: [
      { id: "seed-1", text: "2 eggs, toast with cheese, tomato, coffee", time: hoursAgo(4) },
      { id: "seed-2", text: "A few squares of chocolate", time: hoursAgo(1), tags: ["wanted something sweet"] },
    ],
  };
}

export default function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [date, setDate] = useState(todayIso());
  // In-memory only for this pass — resets on refresh. Persistence, body
  // measurements, drink tracking, and real AI parsing are all deliberately
  // postponed to later passes; this pass is about the time-based diary shape.
  const [entriesByDate, setEntriesByDate] = useState<EntriesByDate>(seedData);

  function handleAddEntry(targetDate: string, values: EntryFormValues) {
    setEntriesByDate((prev) => {
      const existing = prev[targetDate] ?? [];
      const entry = {
        id: `${targetDate}-${Date.now()}`,
        text: values.text,
        time: combineDateAndTime(targetDate, values.time),
        tags: values.tags.length > 0 ? values.tags : undefined,
      };
      return { ...prev, [targetDate]: [...existing, entry] };
    });
  }

  function handleUpdateEntry(targetDate: string, id: string, values: EntryFormValues) {
    setEntriesByDate((prev) => {
      const existing = prev[targetDate] ?? [];
      const updated = existing.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              text: values.text,
              time: combineDateAndTime(targetDate, values.time),
              tags: values.tags.length > 0 ? values.tags : undefined,
            }
          : entry
      );
      return { ...prev, [targetDate]: updated };
    });
  }

  function handleDeleteEntry(targetDate: string, id: string) {
    setEntriesByDate((prev) => ({
      ...prev,
      [targetDate]: (prev[targetDate] ?? []).filter((entry) => entry.id !== id),
    }));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <AppHeader />
        <Nav active={tab} onChange={setTab} />
        <main className={styles.main}>
          {tab === "today" ? (
            <TodayView
              date={date}
              entriesByDate={entriesByDate}
              onChangeDate={setDate}
              onAddEntry={handleAddEntry}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          ) : (
            <WeekView
              entriesByDate={entriesByDate}
              onOpenDay={(d) => {
                setDate(d);
                setTab("today");
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
