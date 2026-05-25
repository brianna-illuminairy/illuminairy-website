import type { Int12SatChangedCopy } from "@/lib/sat-plan-funnel/int12-sat-changed-copy";
import { Int12FormatContrast } from "@/components/sat-plan/int12-format-contrast";
import { Int12RichCopy } from "@/components/sat-plan/int12-rich-copy";
import { Int12StatRows } from "@/components/sat-plan/int12-stat-rows";
import { int12FormatPanelSpecs } from "@/lib/sat-plan-funnel/int12-format-images";

type Int12SatChangedBodyProps = {
  copy: Int12SatChangedCopy;
};

export function Int12SatChangedBody({ copy }: Int12SatChangedBodyProps) {
  const hasPanels = Boolean(int12FormatPanelSpecs());

  return (
    <div className="quiz-step-trust-content int12-sat-changed">
      <p className="int12-sat-changed__subhead">
        <Int12RichCopy parts={copy.subheadParts} />
      </p>

      {hasPanels ? (
        <Int12FormatContrast />
      ) : (
        <div className="int12-format-split quiz-step-trust-graphic" aria-hidden="true">
          <div className="int12-format-split__panel int12-format-split__panel--digital">
            <span className="int12-format-split__label">Digital SAT</span>
            <span className="int12-format-split__detail">Laptop · Desmos · formula sheet</span>
          </div>
          <div className="int12-format-split__panel int12-format-split__panel--paper">
            <span className="int12-format-split__label">Paper prep</span>
            <span className="int12-format-split__detail">Pencil · book · classroom drills</span>
          </div>
        </div>
      )}

      <Int12StatRows rows={copy.statRows} />

      {copy.prepLine ? <p className="quiz-step-copy quiz-step-copy--accent">{copy.prepLine}</p> : null}

      <p className="quiz-step-copy int12-sat-changed__closing">
        <Int12RichCopy parts={copy.closingParts} />
      </p>
    </div>
  );
}
