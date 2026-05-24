"use client";

import type { WrongCategory } from "@/lib/sat-plan-funnel/wrong-options";

type QuizOptionCategoryListProps = {
  categories: WrongCategory[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  groupLabel: string;
  hintId?: string;
};

export function QuizOptionCategoryList({
  categories,
  selectedIds,
  onToggle,
  groupLabel,
  hintId
}: QuizOptionCategoryListProps) {
  return (
    <div
      className="quiz-option-categories"
      role="group"
      aria-label={groupLabel}
      aria-describedby={hintId}
    >
      {categories.map((category) => (
        <section key={category.id} className="quiz-option-category">
          <h2 className="quiz-option-category__title">{category.label}</h2>
          <div className="quiz-options">
            {category.options.map((opt) => {
              const selected = selectedIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`quiz-option${selected ? " quiz-option--selected" : ""}`}
                  role="checkbox"
                  aria-checked={selected}
                  aria-label={opt.ariaLabel}
                  onClick={() => onToggle(opt.id)}
                >
                  <span className="quiz-option-check" aria-hidden="true">
                    {selected ? "✓" : ""}
                  </span>
                  <span className="quiz-option-label">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
