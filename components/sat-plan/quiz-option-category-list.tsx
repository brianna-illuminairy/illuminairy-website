"use client";

import type { WrongCategory } from "@/lib/sat-plan-funnel/wrong-options";

type QuizOptionCategoryListProps = {
  categories: WrongCategory[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  groupLabel: string;
  hintId?: string;
  /** Dense 2-column layout for the wrong-reasons step (390×844, no scroll). */
  compact?: boolean;
};

export function QuizOptionCategoryList({
  categories,
  selectedIds,
  onToggle,
  groupLabel,
  hintId,
  compact = false
}: QuizOptionCategoryListProps) {
  return (
    <div
      className={[
        "quiz-option-categories",
        compact ? "quiz-option-categories--compact" : ""
      ]
        .filter(Boolean)
        .join(" ")}
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
                  {!compact ? (
                    <span className="quiz-option-check" aria-hidden="true">
                      {selected ? "✓" : ""}
                    </span>
                  ) : null}
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
