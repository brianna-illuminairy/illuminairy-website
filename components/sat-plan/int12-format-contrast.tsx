import Image from "next/image";
import {
  int12FormatPanelSpecs,
  int12FormatContrastImageSpec
} from "@/lib/sat-plan-funnel/int12-format-images";

const INT12_PANEL_SIZES = "(max-width: 480px) 48vw, 170px";

export function Int12FormatContrast() {
  const panels = int12FormatPanelSpecs();
  const combinedAlt = int12FormatContrastImageSpec()?.alt;

  if (!panels) return null;

  return (
    <div
      className="int12-format-contrast quiz-step-trust-graphic"
      role="img"
      aria-label={combinedAlt}
    >
      <div className="int12-format-contrast__grid">
        {panels.map((panel) => (
          <div key={panel.id} className="int12-format-contrast__panel">
            <div className="int12-format-contrast__viewport">
              <Image
                src={panel.src}
                alt=""
                fill
                sizes={INT12_PANEL_SIZES}
                className="int12-format-contrast__img"
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority
              />
              <span
                className={`int12-format-contrast__badge int12-format-contrast__badge--${panel.id}`}
              >
                {panel.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
