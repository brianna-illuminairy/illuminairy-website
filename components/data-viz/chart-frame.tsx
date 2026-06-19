import type { ReactNode } from "react";

type ChartFrameProps = {
  label: string;
  title: string;
  subtitle?: string;
  footnote?: string;
  children: ReactNode;
  className?: string;
};

export function ChartFrame({
  label,
  title,
  subtitle,
  footnote,
  children,
  className = "",
}: ChartFrameProps) {
  return (
    <figure
      className={`dv-frame ${className}`.trim()}
      role="group"
    >
      <div className="dv-frame__top" aria-hidden="true" />
      <figcaption className="dv-frame__cap">
        <p className="dv-frame__label">{label}</p>
        <h3 className="dv-frame__title">{title}</h3>
        {subtitle ? <p className="dv-frame__subtitle">{subtitle}</p> : null}
      </figcaption>
      <div className="dv-frame__plot">{children}</div>
      {footnote ? <p className="dv-frame__footnote">{footnote}</p> : null}
    </figure>
  );
}
