import { useState } from "react";
import type { Meal, MealType } from "../types";
import { AddMealInline } from "./AddMealInline";
import { MealCard } from "./MealCard";
import styles from "./MealSection.module.css";

const LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

interface Props {
  type: MealType;
  meals: Meal[];
  onAdd: (type: MealType, text: string) => void;
}

export function MealSection({ type, meals, onAdd }: Props) {
  const [adding, setAdding] = useState(false);

  return (
    <section className={styles.section} aria-labelledby={`section-${type}`}>
      <h3 id={`section-${type}`} className={styles.heading}>
        {LABELS[type]}
      </h3>

      <div className={styles.list}>
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {adding ? (
        <AddMealInline
          onAdd={(text) => {
            onAdd(type, text);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button type="button" className={styles.addButton} onClick={() => setAdding(true)}>
          + Add meal
        </button>
      )}
    </section>
  );
}
