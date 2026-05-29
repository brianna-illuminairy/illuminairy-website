import { LandingPhoto } from "./landing-photo";

type StepProps = {
  stepNum: string;
  title: string;
  desc: string;
  time: string;
  imageSrc: string | null | undefined;
  imageAlt: string;
  slotLabel: string;
};

export function StepCard({
  stepNum,
  title,
  desc,
  time,
  imageSrc,
  imageAlt,
  slotLabel
}: StepProps) {
  return (
    <div className="step">
      <div>
        <div className="step-title">{title}</div>
        <div className="step-desc">{desc}</div>
        <div className="step-time">{time}</div>
      </div>
      {imageSrc ? (
        <div className="step-img-wrap">
          <LandingPhoto
            slotLabel={slotLabel}
            src={imageSrc}
            alt={imageAlt}
            aspect="step"
            width={90}
            height={70}
            className="step-img"
          />
        </div>
      ) : (
        <div className="step-num-badge" aria-hidden>
          {stepNum}
        </div>
      )}
    </div>
  );
}
