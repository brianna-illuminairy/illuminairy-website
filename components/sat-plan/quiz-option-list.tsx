"use client";

type QuizOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

type QuizOptionListProps = {
  options: QuizOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  groupLabel: string;
};

export function QuizOptionList({
  options,
  selectedId,
  onSelect,
  groupLabel
}: QuizOptionListProps) {
  return (
    <div className="quiz-options" role="radiogroup" aria-label={groupLabel}>
      {options.map((opt) => {
        const selected = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className={`quiz-option${selected ? " quiz-option--selected" : ""}`}
            role="radio"
            aria-checked={selected}
            aria-label={opt.ariaLabel}
            onClick={() => onSelect(opt.id)}
          >
            <span className="quiz-option-label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
