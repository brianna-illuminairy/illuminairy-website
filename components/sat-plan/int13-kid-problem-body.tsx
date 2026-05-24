import type { Int13KidProblemCopy } from "@/lib/sat-plan-funnel/int13-kid-problem-copy";

type Int13KidProblemBodyProps = {
  copy: Int13KidProblemCopy;
};

export function Int13KidProblemBody({ copy }: Int13KidProblemBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content int13-kid-problem">
      {copy.opening.map((paragraph, index) => (
        <p key={`open-${index}`} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <ul className="int13-kid-problem__list">
        {copy.structureBeats.map((beat, index) => (
          <li key={`beat-${index}`} className="quiz-step-copy">
            {beat}
          </li>
        ))}
      </ul>
      {copy.prepLine ? <p className="quiz-step-copy quiz-step-copy--accent">{copy.prepLine}</p> : null}
      <p className="quiz-step-copy quiz-step-copy--quote">{copy.spouseLine}</p>
      <p className="quiz-step-copy">{copy.bridge}</p>
      <p className="quiz-step-footnote">{copy.footnote}</p>
    </div>
  );
}
