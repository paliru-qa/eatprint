import { MEAL_TYPES } from "../types";
import type { MealsByDate, MealType } from "../types";
import { DateNav } from "./DateNav";
import { EmptyState } from "./EmptyState";
import { MealSection } from "./MealSection";
import styles from "./TodayView.module.css";

interface Props {
  date: string;
  mealsByDate: MealsByDate;
  onChangeDate: (date: string) => void;
  onAddMeal: (date: string, type: MealType, text: string) => void;
}

export function TodayView({ date, mealsByDate, onChangeDate, onAddMeal }: Props) {
  const meals = mealsByDate[date] ?? [];

  return (
    <div className={styles.page}>
      <DateNav date={date} onChange={onChangeDate} />

      {meals.length === 0 && (
        <EmptyState title="Nothing here yet" description="Start by recording your first meal below." />
      )}

      <div className={styles.sections}>
        {MEAL_TYPES.map((type) => (
          <MealSection
            key={type}
            type={type}
            meals={meals.filter((m) => m.type === type)}
            onAdd={(t, text) => onAddMeal(date, t, text)}
          />
        ))}
      </div>
    </div>
  );
}
