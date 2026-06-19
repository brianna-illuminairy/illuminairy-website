type ChartDetailRailProps = {
  label?: string;
  title?: string;
  body?: string;
  idle: string;
};

export function ChartDetailRail({ label, title, body, idle }: ChartDetailRailProps) {
  const hasDetail = Boolean(title || body);

  return (
    <div className="dv-detail-rail" aria-live="polite" aria-atomic="true">
      {hasDetail ? (
        <>
          {label ? <p className="dv-detail-rail__label">{label}</p> : null}
          {title ? <p className="dv-detail-rail__title">{title}</p> : null}
          {body ? <p className="dv-detail-rail__body">{body}</p> : null}
        </>
      ) : (
        <p className="dv-detail-rail__idle">{idle}</p>
      )}
    </div>
  );
}
