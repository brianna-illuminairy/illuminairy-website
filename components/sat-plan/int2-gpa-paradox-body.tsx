import type { Int2GpaParadoxCopy } from "@/lib/sat-plan-funnel/int2-gpa-paradox-copy";
import { Int2GpaParadoxCompare } from "@/components/sat-plan/int2-gpa-paradox-compare";
import { Int2RichCopy } from "@/components/sat-plan/int2-rich-copy";

type Int2GpaParadoxBodyProps = {
  copy: Int2GpaParadoxCopy;
};

export function Int2GpaParadoxBody({ copy }: Int2GpaParadoxBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content int2-gpa-paradox">
      <blockquote className="int2-gpa-paradox__note">
        <p className="int2-gpa-paradox__note-body">
          <Int2RichCopy parts={copy.quoteParts} />
        </p>
      </blockquote>

      <Int2GpaParadoxCompare school={copy.schoolCard} sat={copy.satCard} />

      <section className="int2-gpa-paradox__insight" aria-label="How the SAT is scored">
        <p className="int2-gpa-paradox__insight-body">
          <Int2RichCopy parts={copy.insightParts} />
        </p>
      </section>

      <footer className="int2-gpa-paradox__tutor">
        <div className="int2-gpa-paradox__tutor-photo" aria-hidden="true">
          <span className="int2-gpa-paradox__tutor-photo-label">Photo</span>
        </div>
        <div className="int2-gpa-paradox__tutor-meta">
          <p className="int2-gpa-paradox__tutor-name">{copy.tutorName}</p>
          <p className="int2-gpa-paradox__tutor-title">{copy.tutorTitle}</p>
        </div>
      </footer>
    </div>
  );
}
