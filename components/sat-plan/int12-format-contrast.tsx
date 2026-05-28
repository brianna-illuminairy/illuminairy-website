import {
  int12FormatPanelSpecs,
  int12FormatContrastImageSpec
} from "@/lib/sat-plan-funnel/int12-format-images";

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.src}
                alt=""
                width={panel.width}
                height={panel.height}
                className="int12-format-contrast__img"
                loading="eager"
                decoding="async"
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
