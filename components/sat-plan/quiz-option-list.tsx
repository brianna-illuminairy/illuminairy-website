"use client";

type QuizOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

type QuizOptionListSingleProps = {
  mode?: "single";
  options: QuizOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  groupLabel: string;
};

type QuizOptionListMultiProps = {
  mode: "multi";
  options: QuizOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  groupLabel: string;
};

type QuizOptionListProps = QuizOptionListSingleProps | QuizOptionListMultiProps;

export function QuizOptionList(props: QuizOptionListProps) {
  if (props.mode === "multi") {
    const { options, selectedIds, onToggle, groupLabel } = props;
    return (
      <div className="quiz-options" role="group" aria-label={groupLabel}>
        {options.map((opt) => {
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
              <span className="quiz-option-label">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const { options, selectedId, onSelect, groupLabel } = props;
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
