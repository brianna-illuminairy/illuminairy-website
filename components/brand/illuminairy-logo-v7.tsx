import Image from "next/image";

/** Cropped horizontal lockup — serif wordmark, stars, arc (on-dark surfaces). */
const LOCKUP_ASPECT = 581 / 221;

/**
 * Brand logo lockup for navy funnel/LP chrome.
 * Raster from owner asset — replaces SVG v7b for pixel-accurate serif wordmark.
 */
export function IlluminairyLogoV7({
  height = 36,
  className = ""
}: {
  /** @deprecated Tone is fixed to on-dark raster; kept for call-site compat. */
  tone?: "on-dark" | "on-light";
  height?: number;
  className?: string;
}) {
  const width = Math.round(height * LOCKUP_ASPECT);

  return (
    <Image
      src="/brand/logo-horizontal.png"
      alt="Illuminairy"
      width={width}
      height={height}
      className={className}
      priority
      style={{ height, width: "auto", maxWidth: "100%" }}
    />
  );
}
