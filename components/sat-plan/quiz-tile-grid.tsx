"use client";

import type { ReactNode } from "react";
import { WorryTileCorner } from "@/components/sat-plan/worry-icons";

export type QuizTileOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

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
  options: QuizTileOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  groupLabel: string;
  hintId?: string;
  /** Dense wrong-reasons step — avoids layout className on step files (layout guard). */
  variant?: "wrong-reasons";
  renderIcon: (id: string) => ReactNode;
};

export function QuizTileGrid({
  options,
  selectedIds,
  onToggle,
  groupLabel,
  hintId,
  variant,
  renderIcon
}: QuizTileGridProps) {
  const gridClass = [
    "quiz-tile-grid",
    variant === "wrong-reasons" ? "quiz-tile-grid--wrong-reasons" : ""
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      className={gridClass}
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
