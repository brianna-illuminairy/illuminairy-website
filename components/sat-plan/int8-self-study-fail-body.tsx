import type { Int8SelfStudyFailCopy } from "@/lib/sat-plan-funnel/int8-self-study-fail-copy";
import { Int8SelfStudyDashboardGraphic } from "@/components/sat-plan/int8-self-study-dashboard-graphic";

type Int8SelfStudyFailBodyProps = {
  copy: Int8SelfStudyFailCopy;
};

export function Int8SelfStudyFailBody({ copy }: Int8SelfStudyFailBodyProps) {
  return (
    <div className="quiz-step-trust-content int8-self-study-fail">
      <p className="quiz-step-copy">{copy.intro}</p>
      <ul className="int8-self-study-fail__effort-list">
        {copy.effortItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <Int8SelfStudyDashboardGraphic ariaLabel={copy.graphicAriaLabel} />
    </div>
  );
}
