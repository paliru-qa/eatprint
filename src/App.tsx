import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { DiaryLinkBanner } from "./components/DiaryLinkBanner";
import { Nav } from "./components/Nav";
import type { Tab } from "./components/Nav";
import { TodayView } from "./components/TodayView";
import type { EntryFormValues } from "./components/EntryForm";
import { WeekView } from "./components/WeekView";
import { useDiaryStorage } from "./hooks/useDiaryStorage";
import { ensureDiaryId } from "./utils/diaryId";
import { combineDateAndTime, todayIso } from "./utils/date";
import styles from "./App.module.css";

export default function App() {
  const [{ id, isNew }] = useState(() => ensureDiaryId());
  const [tab, setTab] = useState<Tab>("today");
  const [date, setDate] = useState(todayIso());
  const [showLinkBanner, setShowLinkBanner] = useState(isNew);

  const { entriesByDate, setEntriesByDate, loading, syncError } = useDiaryStorage(id);

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
        {showLinkBanner && <DiaryLinkBanner onDismiss={() => setShowLinkBanner(false)} />}
        {syncError && <p className={styles.syncNote}>Couldn't sync just now — your entries are still saved on this device.</p>}
        <Nav active={tab} onChange={setTab} />
        <main className={styles.main}>
          {loading ? (
            <p className={styles.loading}>Loading your diary…</p>
          ) : tab === "today" ? (
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
