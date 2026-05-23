import type { ReactNode } from "react";

function WorryIconScore() {
  return (
    <div className="ico-score">
      <div className="lbl">SAT</div>
      <div className="val">1180</div>
      <div className="bar" aria-hidden />
    </div>
  );
}

function WorryIconUpcoming() {
  return (
    <div className="ico-date">
      <div className="ring" aria-hidden />
      <div className="stack">
        <div className="mo">OCT</div>
        <div className="day">05</div>
      </div>
    </div>
  );
}

function WorryIconBelowRange() {
  return (
    <div className="ico-range">
      <div className="top">
        <span>YOURS</span>
        <span>TARGET</span>
      </div>
      <div className="band">
        <div className="dot" aria-hidden />
      </div>
      <div className="marks">
        <span>1000</span>
        <span>1600</span>
      </div>
    </div>
  );
}

function WorryIconDeadlines() {
  return (
    <div className="ico-dl">
      <div className="row urgent">
        <span className="sq" aria-hidden />
        <span>NOV&nbsp;01</span>
        <span className="days">14D</span>
      </div>
      <div className="row">
        <span className="sq" aria-hidden />
        <span>JAN&nbsp;05</span>
        <span className="days">79D</span>
      </div>
      <div className="row">
        <span className="sq" aria-hidden />
        <span>JAN&nbsp;15</span>
        <span className="days">89D</span>
      </div>
    </div>
  );
}

function WorryIconRetook() {
  return (
    <div className="ico-retook">
      <div className="chip">
        <span className="lbl">1ST</span>
        <span className="val">1180</span>
      </div>
      <div className="arrow" aria-hidden />
      <div className="chip after">
        <span className="lbl">2ND</span>
        <span className="val">1210</span>
      </div>
    </div>
  );
}

function WorryIconNotStarted() {
  return (
    <div className="ico-blank">
      <div className="lbl">SAT</div>
      <div className="val" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="bar" aria-hidden />
    </div>
  );
}

const WORRY_ICON_MAP: Record<string, () => ReactNode> = {
  recent_test: WorryIconScore,
  upcoming_not_ready: WorryIconUpcoming,
  target_schools_low: WorryIconBelowRange,
  early_deadlines: WorryIconDeadlines,
  stuck_score: WorryIconRetook,
  not_prepped: WorryIconNotStarted
};

export function WorryIcon({ id }: { id: string }) {
  const Comp = WORRY_ICON_MAP[id];
  if (!Comp) return null;
  return (
    <div className="quiz-tile-art">
      <div className="worry-ico">
        <div className="worry-ico-box">
          <Comp />
        </div>
      </div>
    </div>
  );
}

export function WorryTileCorner() {
  return (
    <span className="quiz-tile-corner" aria-hidden>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M1.5 5.2L4 7.6L8.6 2.4"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}
