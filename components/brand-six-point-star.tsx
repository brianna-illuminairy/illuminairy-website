/**
 * Six-point star for brand-board list markers (flat fill, no stroke).
 */
export function BrandSixPointStar({
  size = 14,
  className = ""
}: {
  size?: number;
  className?: string;
}) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const outer = r * 0.92;
  const points: string[] = [];

  for (let i = 0; i < 6; i += 1) {
    const angle = (-Math.PI / 2) + (i * Math.PI) / 3;
    points.push(
      `${cx + outer * Math.cos(angle)},${cy + outer * Math.sin(angle)}`
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <polygon points={points.join(" ")} />
    </svg>
  );
}
