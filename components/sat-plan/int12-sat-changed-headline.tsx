import type { Int12SatChangedCopy } from "@/lib/sat-plan-funnel/int12-sat-changed-copy";

export function Int12SatChangedHeadline({ copy }: { copy: Int12SatChangedCopy }) {
  return (
    <span className="int12-sat-changed-headline">
      <span className="int12-sat-changed-headline__lead">{copy.headlinePrefix}</span>
      <span className="int12-sat-changed-headline__accent">{copy.headlineAccent}</span>
      <span className="int12-sat-changed-headline__lead">{copy.headlineSuffix}</span>
    </span>
  );
}
