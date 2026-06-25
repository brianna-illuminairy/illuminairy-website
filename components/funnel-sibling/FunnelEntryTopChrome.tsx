import Image from "next/image";

type FunnelEntryTopChromeProps = {
  progressPct: number;
};

/** Shared SSR entry header: logo + progress bar (no back button). */
export function FunnelEntryTopChrome({ progressPct }: FunnelEntryTopChromeProps) {
  return (
    <div className="qf-top">
      <div className="qf-top-row">
        <button className="qf-back hidden" aria-label="Back" type="button" tabIndex={-1}>
          ←
        </button>
        <div className="qf-logo-wrap">
          <span className="qf-brand-lockup">
            <Image
              src="/brand/logo-horizontal.png"
              alt="Illuminairy"
              width={95}
              height={36}
              priority
              fetchPriority="high"
              style={{ height: 30, width: "auto", maxWidth: "100%" }}
            />
          </span>
        </div>
        <div className="qf-top-row-spacer" aria-hidden />
      </div>
      <div className="qf-progress">
        <div className="fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}
