import Image from "next/image";
import { v4NavParentRating } from "@/components/landing/v4/v4-content";
import { parentSmsDisplayPhone, parentSmsHref } from "@/lib/site";

/** Server topbar for ad3 HD LP — logo, parent rating, optional SMS. */
export function Ad3HdTopbar() {
  const rating = v4NavParentRating.numeric;
  const fullStars = Math.floor(rating);
  const partialFill = `${Math.round(v4NavParentRating.partialStarFill * 100)}%`;
  const smsHref = parentSmsHref();
  const smsPhone = smsHref ? parentSmsDisplayPhone() : null;

  return (
    <div className="lp-container lp-topbar lp-topbar--split">
      <Image
        src="/brand/logo-horizontal.png"
        alt="Illuminairy"
        width={110}
        height={34}
        priority
        style={{ height: 34, width: "auto", maxWidth: "min(200px, 52vw)" }}
      />
      <div className="lp-topbar-end">
        <div
          className="lp-topbar-rating"
          aria-label={`${v4NavParentRating.value} ${v4NavParentRating.label}`}
        >
          <span className="lp-topbar-stars" aria-hidden="true">
            {Array.from({ length: fullStars }, (_, i) => (
              <span className="lp-topbar-star lp-topbar-star--full" key={`full-${i}`}>
                ★
              </span>
            ))}
            {rating < 5 ? (
              <span
                className="lp-topbar-star lp-topbar-star--partial"
                style={{ ["--star-fill" as string]: partialFill }}
              >
                <span className="lp-topbar-star-empty">★</span>
                <span className="lp-topbar-star-fill">★</span>
              </span>
            ) : null}
          </span>
          <span className="lp-topbar-rating-num">{v4NavParentRating.value}</span>
        </div>
        {smsHref && smsPhone ? (
          <a href={smsHref} className="lp-topbar-sms">
            Rising senior? <span className="lp-topbar-sms-em">Text us</span>
            <span className="lp-topbar-sms-num">{smsPhone}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
