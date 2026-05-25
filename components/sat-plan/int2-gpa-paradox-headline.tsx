import type { Int2GpaParadoxCopy } from "@/lib/sat-plan-funnel/int2-gpa-paradox-copy";

type Int2GpaParadoxHeadlineProps = {
  copy: Pick<Int2GpaParadoxCopy, "headlinePrefix" | "headlineAccent">;
};

export function Int2GpaParadoxHeadline({ copy }: Int2GpaParadoxHeadlineProps) {
  return (
    <span className="int2-gpa-paradox-headline">
      <span className="int2-gpa-paradox-headline__eyebrow">
        <span className="int2-gpa-paradox-headline__mark" aria-hidden="true" />
        A note from our head tutor
      </span>
      <span className="int2-gpa-paradox-headline__title">
        {copy.headlinePrefix}
        <span className="int2-gpa-paradox-headline__accent">{copy.headlineAccent}</span>
      </span>
    </span>
  );
}
