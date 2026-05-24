type Int2GpaScoreSplitProps = {
  gpaLabel: string;
  scoreLabel: string;
};

/**
 * Diagnostic split — GPA band vs SAT band (prototype ScoreCards idea, intake bands).
 */
export function Int2GpaScoreSplit({ gpaLabel, scoreLabel }: Int2GpaScoreSplitProps) {
  return (
    <div
      className="int2-gpa-split quiz-step-trust-graphic"
      role="img"
      aria-label={`GPA ${gpaLabel} compared with SAT score ${scoreLabel}. Different tests measure different skills.`}
    >
      <div className="quiz-step-trust-card int2-gpa-split__card">
        <div className="int2-gpa-split__panels">
          <div className="int2-gpa-split__panel int2-gpa-split__panel--gpa">
            <span className="int2-gpa-split__metric-label">GPA</span>
            <span className="int2-gpa-split__metric-value">{gpaLabel}</span>
            <span className="int2-gpa-split__metric-note">School · depth · revision</span>
          </div>
          <div className="int2-gpa-split__divider" aria-hidden="true">
            ≠
          </div>
          <div className="int2-gpa-split__panel int2-gpa-split__panel--sat">
            <span className="int2-gpa-split__metric-label">SAT</span>
            <span className="int2-gpa-split__metric-value int2-gpa-split__metric-value--sat">
              {scoreLabel}
            </span>
            <span className="int2-gpa-split__metric-note">Timed · patterns · pressure</span>
          </div>
        </div>
        <p className="int2-gpa-split__caption">Same student · different tests</p>
      </div>
    </div>
  );
}
