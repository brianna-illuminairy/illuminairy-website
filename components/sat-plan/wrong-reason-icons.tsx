import { useId, type ReactNode, type SVGProps } from "react";

const VB = "0 0 120 72";

function WrongIconFrame({ children }: { children: ReactNode }) {
  return (
    <div className="quiz-tile-art">
      <div className="worry-ico wrong-reason-ico">
        <div className="worry-ico-box">{children}</div>
      </div>
    </div>
  );
}

function Illu({
  className,
  children,
  ...rest
}: SVGProps<SVGSVGElement> & { className: string }) {
  return (
    <WrongIconFrame>
      <svg
        className={`wrong-illu ${className}`}
        viewBox={VB}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        {...rest}
      >
        {children}
      </svg>
    </WrongIconFrame>
  );
}

/** Stopwatch — first quarter red + unanswered question list */
function WrongIconTime() {
  return (
    <Illu className="wrong-illu--time">
      <circle className="wrong-illu__ink" cx="36" cy="36" r="20" strokeWidth="1.75" />
      <path
        className="wrong-illu__accent-stroke"
        d="M36 16 A20 20 0 0 1 56 36"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path className="wrong-illu__ink" d="M36 36V24" strokeWidth="1.75" strokeLinecap="round" />
      <path className="wrong-illu__ink" d="M36 36h9" strokeWidth="1.75" strokeLinecap="round" />
      <circle className="wrong-illu__ink" cx="36" cy="36" r="1.75" fill="currentColor" stroke="none" />
      <path className="wrong-illu__ink" d="M72 24h32" strokeWidth="1.5" strokeLinecap="round" />
      <path className="wrong-illu__ink" d="M72 36h28" strokeWidth="1.5" strokeLinecap="round" />
      <path className="wrong-illu__ink" d="M72 48h24" strokeWidth="1.5" strokeLinecap="round" />
      <circle className="wrong-illu__ink" cx="68" cy="24" r="3.5" strokeWidth="1.5" />
      <circle className="wrong-illu__ink" cx="68" cy="36" r="3.5" strokeWidth="1.5" />
      <circle className="wrong-illu__ink" cx="68" cy="48" r="3.5" strokeWidth="1.5" />
    </Illu>
  );
}

/** Nearly empty battery + blurred passage lines */
function WrongIconFocus() {
  const blurId = useId();
  return (
    <Illu className="wrong-illu--focus">
      <defs>
        <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <rect className="wrong-illu__ink" x="14" y="22" width="72" height="22" rx="4" strokeWidth="1.75" />
      <rect className="wrong-illu__ink" x="84" y="28" width="4" height="10" rx="1" strokeWidth="1.75" />
      <rect
        className="wrong-illu__accent-fill"
        x="17"
        y="34"
        width="9"
        height="10"
        rx="1.5"
      />
      <g className="wrong-illu__blur" filter={`url(#${blurId})`} opacity="0.45">
        <path d="M10 54h88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 58h72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 62h56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 66h40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </Illu>
  );
}

/** Scribble cloud, sweat, test sheet with X */
function WrongIconAnxiety() {
  return (
    <Illu className="wrong-illu--anxiety">
      <rect className="wrong-illu__ink" x="32" y="26" width="56" height="40" strokeWidth="1.75" />
      <path
        className="wrong-illu__ink"
        d="M38 36h40M38 44h32M38 52h24"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className="wrong-illu__ink"
        d="M28 14c6-8 14-10 22-6 6-8 16-6 20 2 8-2 14 4 12 12-6 10-16 12-24 6-10 2-18-4-20-12-8-4-12-12-10-20z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        className="wrong-illu__ink"
        d="M22 30c0-2 1-3 2-2s1 3-2 2M94 22c0-2 1-3 2-2s1 3-2 2M18 48c0-2 1-3 2-2s1 3-2 2M100 44c0-2 1-3 2-2s1 3-2 2"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        className="wrong-illu__accent-stroke"
        d="M76 58l8 8M84 58l-8 8"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </Illu>
  );
}

/** Algebra steps — circled answer + question mark */
function WrongIconMath() {
  return (
    <Illu className="wrong-illu--math">
      <text
        className="wrong-illu__text"
        x="8"
        y="22"
        fontSize="7.5"
        fontWeight="600"
      >
        2x² + 3x − 5 = 0
      </text>
      <text className="wrong-illu__text" x="8" y="36" fontSize="7.5" fontWeight="600">
        2x² + 3x = 5
      </text>
      <text className="wrong-illu__text" x="8" y="50" fontSize="7.5" fontWeight="600">
        x(2x + 3) = 5
      </text>
      <ellipse
        className="wrong-illu__accent-stroke"
        cx="98"
        cy="48"
        rx="14"
        ry="9"
        strokeWidth="1.75"
      />
      <text
        className="wrong-illu__accent-text"
        x="108"
        y="58"
        fontSize="16"
        fontWeight="700"
        textAnchor="middle"
      >
        ?
      </text>
    </Illu>
  );
}

/** Grammar slip — whom → who */
function WrongIconReading() {
  return (
    <Illu className="wrong-illu--reading">
      <text className="wrong-illu__text" x="6" y="18" fontSize="5.6" fontWeight="500">
        The study found that students,
      </text>
      <text className="wrong-illu__text" x="6" y="28" fontSize="5.6" fontWeight="500">
        <tspan className="wrong-illu__accent-text wrong-illu__underline">whom</tspan>
        <tspan> studied consistently,</tspan>
      </text>
      <text className="wrong-illu__text" x="6" y="38" fontSize="5.6" fontWeight="500">
        performed better on the test.
      </text>
      <text
        className="wrong-illu__accent-text wrong-illu__script"
        x="52"
        y="46"
        fontSize="9"
        fontWeight="600"
      >
        , who
      </text>
    </Illu>
  );
}

/** Calendar skips + low practice test score */
function WrongIconPrep() {
  return (
    <Illu className="wrong-illu--prep">
      <rect className="wrong-illu__ink" x="8" y="10" width="52" height="44" strokeWidth="1.5" />
      <path className="wrong-illu__ink" d="M8 20h52" strokeWidth="1.5" />
      <path className="wrong-illu__ink" d="M22 10v10M46 10v10" strokeWidth="1.5" strokeLinecap="round" />
      <path
        className="wrong-illu__accent-stroke"
        d="M18 30l4 4M30 30l4 4M42 42l4 4"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect className="wrong-illu__ink" x="58" y="28" width="54" height="38" strokeWidth="1.75" />
      <text className="wrong-illu__text" x="62" y="40" fontSize="5" fontWeight="700" letterSpacing="0.06em">
        PRACTICE TEST
      </text>
      <text
        className="wrong-illu__accent-text"
        x="62"
        y="54"
        fontSize="11"
        fontWeight="800"
      >
        45%
      </text>
      <rect className="wrong-illu__ink" x="62" y="58" width="46" height="5" rx="1" strokeWidth="1.25" />
      <rect className="wrong-illu__accent-fill" x="64" y="60" width="10" height="2" rx="0.5" />
    </Illu>
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
  return <Comp />;
}
