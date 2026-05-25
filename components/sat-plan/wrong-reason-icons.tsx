import type { ReactNode } from "react";

function WrongIconTime() {
  return (
    <div className="ico-wrong ico-wrong-time">
      <div className="lbl">TIME LEFT</div>
      <div className="metric">
        <span className="val">0:14</span>
        <span className="unit">MIN</span>
      </div>
      <div className="bar" aria-hidden />
    </div>
  );
}

function WrongIconFocus() {
  return (
    <div className="ico-wrong ico-wrong-focus">
      <div className="lbl">BATTERY</div>
      <div className="battery-row">
        <div className="battery" aria-hidden>
          <span className="battery-fill" />
        </div>
        <span className="pct">12%</span>
      </div>
    </div>
  );
}

function WrongIconAnxiety() {
  return (
    <div className="ico-wrong ico-wrong-anxiety">
      <div className="lbl">HEART RATE</div>
      <svg
        className="pulse"
        viewBox="0 0 88 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M0 11h14l6-9 8 18 6-12 8 14h36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="metric">
        <span className="val">142</span>
        <span className="unit">BPM</span>
      </div>
    </div>
  );
}

function WrongIconMath() {
  return (
    <div className="ico-wrong ico-wrong-math">
      <div className="lbl">MATH</div>
      <div className="eq">
        2x<sup>2</sup> + 3x <span className="q">?</span>
      </div>
      <div className="underline" aria-hidden />
    </div>
  );
}

function WrongIconReading() {
  return (
    <div className="ico-wrong ico-wrong-reading">
      <div className="lbl">READING</div>
      <div className="lines" aria-hidden>
        <span />
        <span />
        <span className="accent" />
        <span />
      </div>
      <span className="who">who,</span>
    </div>
  );
}

function WrongIconPrep() {
  return (
    <div className="ico-wrong ico-wrong-prep">
      <div className="lbl">PRACTICE TESTS</div>
      <div className="taken">
        <span className="val">0</span>
        <span className="slash">/ 8 TAKEN</span>
      </div>
      <div className="slots" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

const WRONG_ICON_MAP: Record<string, () => ReactNode> = {
  wrong_cat_time: WrongIconTime,
  wrong_cat_focus: WrongIconFocus,
  wrong_cat_anxiety: WrongIconAnxiety,
  wrong_cat_math: WrongIconMath,
  wrong_cat_reading: WrongIconReading,
  wrong_cat_prep: WrongIconPrep
};

export function WrongReasonIcon({ id }: { id: string }) {
  const Comp = WRONG_ICON_MAP[id];
  if (!Comp) return null;
  return (
    <div className="quiz-tile-art">
      <div className="worry-ico wrong-reason-ico">
        <div className="worry-ico-box">
          <Comp />
        </div>
      </div>
    </div>
  );
}
