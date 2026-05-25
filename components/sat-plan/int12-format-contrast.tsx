import Image from "next/image";
import { int12FormatContrastImageSpec } from "@/lib/sat-plan-funnel/int12-format-images";

export function Int12FormatContrast() {
  const spec = int12FormatContrastImageSpec();
  if (!spec) return null;

  return (
    <div
      className="int12-format-contrast quiz-step-trust-graphic"
      role="img"
      aria-label={spec.alt}
    >
      <div className="quiz-step-trust-card int12-format-contrast__card">
        <div className="int12-format-contrast__viewport">
          <Image
            src={spec.src}
            alt=""
            fill
            sizes="(max-width: 480px) 100vw, 360px"
            className="int12-format-contrast__img"
            style={{ objectFit: "cover", objectPosition: "top center" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
