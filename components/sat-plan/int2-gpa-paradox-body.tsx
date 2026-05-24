import type { Int2GpaParadoxCopy } from "@/lib/sat-plan-funnel/int2-gpa-paradox-copy";

type Int2GpaParadoxBodyProps = {
  copy: Int2GpaParadoxCopy;
};

export function Int2GpaParadoxBody({ copy }: Int2GpaParadoxBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
