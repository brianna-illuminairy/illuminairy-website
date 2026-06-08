'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil } from 'lucide-react';
import { QFOption } from './QFShell';
import { captureAchievabilityInputEdited } from '@/lib/quiz-funnel/analytics';
import {
  ACHIEVABILITY_FIELD_TO_ANSWER_KEY,
  buildAchievabilityInputChips,
  optionsForAchievabilityField,
  pickerFieldForChip,
  sheetTitleForField,
} from '@/lib/quiz-funnel/achievability-input-fields';

/**
 * @param {{
 *   answers: Record<string, unknown>,
 *   startingScoreLabel?: string | null,
 *   onEditAnswer: (answerKey: string, value: string) => void,
 *   enabled?: boolean,
 * }} props
 */
export function AchievabilityInputChips({
  answers,
  startingScoreLabel,
  onEditAnswer,
  enabled = true,
}) {
  const sheetTitleId = useId();
  const [openField, setOpenField] = useState(null);
  const chips = buildAchievabilityInputChips(answers, startingScoreLabel);

  const closeSheet = useCallback(() => setOpenField(null), []);

  useEffect(() => {
    if (!openField) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') closeSheet();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openField, closeSheet]);

  if (!enabled || !onEditAnswer) return null;

  const pickerField = openField ? pickerFieldForChip(openField, answers) : null;
  const answerKey = pickerField ? ACHIEVABILITY_FIELD_TO_ANSWER_KEY[pickerField] : null;
  const currentValue = answerKey ? (answers[answerKey] ?? '') : '';
  const options = pickerField ? optionsForAchievabilityField(pickerField) : [];

  function openChip(chip) {
    setOpenField(chip);
  }

  function handleSelect(optionId) {
    if (!openField || !pickerField || !answerKey) return;
    const previousValue =
      typeof answers[answerKey] === 'string' ? answers[answerKey] : undefined;
    if (optionId !== previousValue) {
      captureAchievabilityInputEdited({
        field: pickerField,
        answer_key: answerKey,
        new_value: optionId,
        previous_value: previousValue,
        screen: 'achievability',
      });
      onEditAnswer(answerKey, optionId);
    }
    closeSheet();
  }

  const sheet =
    openField && pickerField ? (
      <div className="qf-achv-sheet-root" role="presentation">
        <button
          type="button"
          className="qf-achv-sheet-backdrop"
          aria-label="Close"
          onClick={closeSheet}
        />
        <div
          className="qf-achv-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby={sheetTitleId}
        >
          <div className="qf-achv-sheet__head">
            <p id={sheetTitleId} className="qf-achv-sheet__title">
              {sheetTitleForField(pickerField)}
            </p>
            <button type="button" className="qf-achv-sheet__close" onClick={closeSheet}>
              Done
            </button>
          </div>
          <div className="qf-achv-sheet__options qf-options">
            {options.map((option) => (
              <QFOption
                key={option.id}
                selected={currentValue === option.id}
                onClick={() => handleSelect(option.id)}
              >
                {option.label}
              </QFOption>
            ))}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className="qf-achv-inputs">
      <div className="qf-achv-input-chips" role="group" aria-label="Edit plan inputs">
        {chips.map((chip) => (
          <button
            key={chip.field}
            type="button"
            className="qf-achv-input-chip"
            onClick={() => openChip(chip)}
            aria-haspopup="dialog"
            aria-expanded={openField?.field === chip.field}
          >
            <span className="qf-achv-input-chip__label">{chip.label}</span>
            <span className="qf-achv-input-chip__value">{chip.value}</span>
            <Pencil className="qf-achv-input-chip__icon" aria-hidden="true" size={13} strokeWidth={2} />
          </button>
        ))}
      </div>

      {typeof document !== 'undefined' && sheet
        ? createPortal(sheet, document.body)
        : null}
    </div>
  );
}
