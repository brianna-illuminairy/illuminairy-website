"use client";

import type { ReactNode } from "react";
import { WorryTileCorner } from "@/components/sat-plan/worry-icons";
import type { WorryOption } from "@/lib/sat-plan-funnel/worry-options";

type QuizTileProps = {
  selected: boolean;
  onToggle: () => void;
  ariaLabel: string;
  label: string;
  icon: ReactNode;
};

function QuizTile({ selected, onToggle, ariaLabel, label, icon }: QuizTileProps) {
  return (
    <button
      type="button"
      className={`quiz-tile${selected ? " quiz-tile--selected" : ""}`}
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={onToggle}
    >
      {selected ? <WorryTileCorner /> : null}
      {icon}
      <span className="quiz-tile-label">{label}</span>
    </button>
  );
}

type QuizTileGridProps = {
  options: WorryOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  groupLabel: string;
  hintId?: string;
  renderIcon: (id: string) => ReactNode;
};

export function QuizTileGrid({
  options,
  selectedIds,
  onToggle,
  groupLabel,
  hintId,
  renderIcon
}: QuizTileGridProps) {
  return (
    <div
      className="quiz-tile-grid"
      role="group"
      aria-label={groupLabel}
      aria-describedby={hintId}
    >
      {options.map((opt) => {
        const selected = selectedIds.includes(opt.id);
        return (
          <QuizTile
            key={opt.id}
            selected={selected}
            ariaLabel={opt.ariaLabel}
            label={opt.label}
            onToggle={() => onToggle(opt.id)}
            icon={renderIcon(opt.id)}
          />
        );
      })}
    </div>
  );
}
