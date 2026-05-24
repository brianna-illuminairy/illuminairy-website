import type { ReactNode } from "react";

function KidIconTime() {
  return (
    <div className="ico-kid-time">
      <div className="face" aria-hidden>
        <span className="hand" />
      </div>
      <div className="ticks" aria-hidden />
    </div>
  );
}

function KidIconFocus() {
  return (
    <div className="ico-kid-focus">
      <div className="bars" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="bolt" aria-hidden />
    </div>
  );
}

function KidIconAnxiety() {
  return (
    <div className="ico-kid-anxiety">
      <div className="wave" aria-hidden />
      <div className="pulse" aria-hidden />
    </div>
  );
}

function KidIconMath() {
  return (
    <div className="ico-kid-math">
      <span className="eq">x² + 3x</span>
      <span className="line" aria-hidden />
    </div>
  );
}

function KidIconReading() {
  return (
    <div className="ico-kid-reading">
      <div className="page" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="mark" aria-hidden />
    </div>
  );
}

function KidIconPrep() {
  return (
    <div className="ico-kid-prep">
      <div className="list" aria-hidden>
        <span className="row done" />
        <span className="row" />
        <span className="row gap" />
      </div>
    </div>
  );
}

const KID_ICON_MAP: Record<string, () => ReactNode> = {
  kid_block_time: KidIconTime,
  kid_block_focus: KidIconFocus,
  kid_block_anxiety: KidIconAnxiety,
  kid_block_math: KidIconMath,
  kid_block_reading: KidIconReading,
  kid_block_prep: KidIconPrep
};

export function KidProblemIcon({ id }: { id: string }) {
  const Comp = KID_ICON_MAP[id];
  if (!Comp) return null;
  return (
    <div className="quiz-tile-art">
      <div className="worry-ico kid-problem-ico">
        <div className="worry-ico-box">
          <Comp />
        </div>
      </div>
    </div>
  );
}
