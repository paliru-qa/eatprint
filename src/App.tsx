import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { Nav } from "./components/Nav";
import type { Tab } from "./components/Nav";
import { TodayView } from "./components/TodayView";
import { WeekView } from "./components/WeekView";
import type { MealsByDate, MealType } from "./types";
import { todayIso } from "./utils/date";
import styles from "./App.module.css";

function seedData(): MealsByDate {
  const today = todayIso();
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
  return {
    [today]: [
      { id: "seed-1", type: "breakfast", text: "2 eggs, toast with cheese, tomato, coffee", time: hoursAgo(4) },
      { id: "seed-2", type: "snack", text: "A few squares of chocolate", time: hoursAgo(1) },
    ],
  };
}

export default function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [date, setDate] = useState(todayIso());
  // In-memory only for this pass — resets on refresh. Real persistence
  // (even local) is deliberately deferred to the next pass; this is about
  // product shape, not data durability.
  const [mealsByDate, setMealsByDate] = useState<MealsByDate>(seedData);

  function handleAddMeal(targetDate: string, type: MealType, text: string) {
    setMealsByDate((prev) => {
      const existing = prev[targetDate] ?? [];
      const meal = { id: `${targetDate}-${Date.now()}`, type, text, time: new Date().toISOString() };
      return { ...prev, [targetDate]: [...existing, meal] };
    });
  }

  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <AppHeader />
        <Nav active={tab} onChange={setTab} />
        <main className={styles.main}>
          {tab === "today" ? (
            <TodayView date={date} mealsByDate={mealsByDate} onChangeDate={setDate} onAddMeal={handleAddMeal} />
          ) : (
            <WeekView
              mealsByDate={mealsByDate}
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
