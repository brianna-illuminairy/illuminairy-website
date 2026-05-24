import Image from "next/image";
import type { Int8PrepPathTriptychFocus } from "@/lib/sat-plan-funnel/int8-prep-comparison-copy";
import { prepPathImageSpec } from "@/lib/sat-plan-funnel/prep-path-images";

type Int8PrepPathTriptychProps = {
  focus: Int8PrepPathTriptychFocus;
  testTaker?: string;
};

const FOCUS_ALT: Record<Int8PrepPathTriptychFocus, string> = {
  full:
    "Three ways to prepare: frustrated alone at home, lost in a crowded classroom, and a one-on-one tutoring aha moment.",
  home: "Student frustrated trying to teach themselves at home.",
  crowd: "Student lost in a crowded classroom with no individual help.",
  mentorship: "Student and tutor having a one-on-one aha moment."
};

export function Int8PrepPathTriptych({
  focus,
  testTaker
}: Int8PrepPathTriptychProps) {
  const spec = prepPathImageSpec(focus, testTaker);
  const isFull = focus === "full";

  return (
    <div
      className={[
        "int8-prep-path-triptych quiz-step-trust-graphic",
        `int8-prep-path-triptych--${focus}`,
        spec.cropFromTriptych ? "int8-prep-path-triptych--crop" : ""
      ].join(" ")}
      role="img"
      aria-label={FOCUS_ALT[focus]}
    >
      <div className="quiz-step-trust-card int8-prep-path-triptych__card">
        <div
          className="int8-prep-path-triptych__viewport"
          data-aspect={isFull ? "triptych" : "panel"}
        >
          <Image
            src={spec.src}
            alt=""
            fill
            sizes="(max-width: 480px) 100vw, 360px"
            className="int8-prep-path-triptych__img"
            style={{
              objectFit: "cover",
              objectPosition: spec.objectPosition
            }}
            priority={focus === "crowd"}
          />
        </div>
      </div>
    </div>
  );
}
