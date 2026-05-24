import type { Int3RetakeCopy } from "@/lib/sat-plan-funnel/int3-retake-copy";
import { Int3RetakeContrastGraphic } from "@/components/sat-plan/int3-retake-contrast-graphic";

type Int3RetakeBodyProps = {
  copy: Int3RetakeCopy;
};

export function Int3RetakeBody({ copy }: Int3RetakeBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      <Int3RetakeContrastGraphic />
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
