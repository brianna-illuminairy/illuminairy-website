"use client";

type AssessmentOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

type AssessmentOptionListSingleProps = {
  mode?: "single";
  options: AssessmentOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  groupLabel: string;
};

type AssessmentOptionListMultiProps = {
  mode: "multi";
  options: AssessmentOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  groupLabel: string;
};

type AssessmentOptionListProps = AssessmentOptionListSingleProps | AssessmentOptionListMultiProps;

export function AssessmentOptionList(props: AssessmentOptionListProps) {
  if (props.mode === "multi") {
    const { options, selectedIds, onToggle, groupLabel } = props;
    return (
      <div className="quiz-options quiz-options--multi" role="group" aria-label={groupLabel}>
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
              <span className="quiz-option-check" aria-hidden>
                {selected ? "✓" : ""}
              </span>
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
