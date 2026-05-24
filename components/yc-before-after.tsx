import Link from "next/link";
import { getPainGainPairs } from "@/lib/pain-gain-pairs";
import { homePlatform } from "@/lib/site";

export function YcBeforeAfter() {
  const { painVoice } = homePlatform;
  const pairs = getPainGainPairs();

  return (
    <div className="before-after mx-auto mt-10 max-w-content" id="before-after">
      <div className="before-after-columns">
        <div className="before-after-col-head before-after-col-head--before">
          <p className="before-after-col-label">{painVoice.beforeLabel}</p>
          <p className="before-after-col-sub">{painVoice.beforeSub}</p>
        </div>
        <div className="before-after-divider-spacer" aria-hidden />
        <div className="before-after-col-head before-after-col-head--after">
          <p className="before-after-col-label">{painVoice.afterLabel}</p>
          <p className="before-after-col-sub">{painVoice.afterSub}</p>
        </div>
      </div>

      <ol className="before-after-list" aria-label="Customer pains and Illuminairy gains">
        {pairs.map((pair) => (
          <li key={pair.id} className="before-after-row">
            <article className="before-after-pane before-after-pane--before">
              <header className="before-after-pane-head">
                <span className="before-after-rank">#{pair.rank}</span>
                <p className="before-after-theme">{pair.label}</p>
                <span className="before-after-freq">{pair.frequency}</span>
              </header>
              <blockquote className="before-after-quote">
                &ldquo;{pair.painQuote}&rdquo;
              </blockquote>
              <Link
                href={pair.painUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="before-after-source"
              >
                {pair.painSource} ↗
              </Link>
            </article>

            <div className="before-after-divider" aria-hidden>
              <span className="before-after-divider-line" />
            </div>

            <article className="before-after-pane before-after-pane--after">
              <header className="before-after-pane-head">
                <span className="before-after-gain-tag">{painVoice.afterLabel}</span>
              </header>
              <h3 className="before-after-gain-headline">{pair.gainHeadline}</h3>
              <p className="before-after-gain-text">{pair.gainText}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
