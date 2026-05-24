import Image from "next/image";
import type { PrepContrastPair } from "@/lib/sat-plan-funnel/prep-path-images";
import { prepContrastPairImageSpec } from "@/lib/sat-plan-funnel/prep-path-images";

type Int8PrepContrastPairProps = {
  pair: PrepContrastPair;
  testTaker?: string;
};

export function Int8PrepContrastPair({ pair, testTaker }: Int8PrepContrastPairProps) {
  const spec = prepContrastPairImageSpec(pair, testTaker);
  if (!spec) return null;

  return (
    <div
      className={`int8-prep-contrast-pair quiz-step-trust-graphic int8-prep-contrast-pair--${pair}`}
      role="img"
      aria-label={spec.alt}
    >
      <div className="quiz-step-trust-card int8-prep-contrast-pair__card">
        <div className="int8-prep-contrast-pair__viewport">
          <Image
            src={spec.src}
            alt=""
            fill
            sizes="(max-width: 480px) 100vw, 360px"
            className="int8-prep-contrast-pair__img"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
