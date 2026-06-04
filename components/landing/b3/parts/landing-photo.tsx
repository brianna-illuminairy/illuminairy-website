import Image from "next/image";

type Aspect = "wide" | "tall" | "square" | "section" | "step";

const aspectClass: Record<Aspect, string> = {
  wide: "wide",
  tall: "tall",
  square: "square",
  section: "",
  step: "square"
};

type LandingPhotoProps = {
  /** Filename hint for internal QA builds only */
  slotLabel: string;
  src: string | null | undefined;
  alt: string;
  aspect?: Aspect;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  /** Dev-only dashed placeholder; never on production LP */
  showPlaceholder?: boolean;
};

export function LandingPhoto({
  slotLabel,
  src,
  alt,
  aspect = "section",
  className = "",
  priority,
  sizes,
  fill,
  width,
  height,
  showPlaceholder = false
}: LandingPhotoProps) {
  if (!src) {
    if (!showPlaceholder) return null;
    const phClass = `img-ph ${aspectClass[aspect]}`.trim();
    return (
      <div
        className={`${phClass} ${className}`.trim()}
        role="img"
        aria-label={`Photo needed: ${slotLabel}`}
      >
        Photo needed
        <br />
        <span style={{ fontSize: 9, letterSpacing: "0.08em" }}>{slotLabel}</span>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`il-photo ${className}`.trim()} style={{ position: "relative" }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className="il-photo-img"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      sizes={sizes}
      priority={priority}
      className={className}
      loading={priority ? undefined : "lazy"}
    />
  );
}
