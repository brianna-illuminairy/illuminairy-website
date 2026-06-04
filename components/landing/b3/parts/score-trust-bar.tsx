"use client";

import {
  sortTrustScoreStories,
  type TrustMetroId
} from "@/lib/landing/infer-visitor-metro";
import { allTrustMetroMarqueeSchools } from "@/lib/landing/trust-metro-schools";
import {
  landingScoreTrustBar,
  landingTrustBarDisclaimer,
  landingTrustScoreSectionLabels,
  landingTrustScoreStoriesReady,
  trustScoreGain,
  trustScoreTotalAfter,
  trustScoreTotalBefore,
  type LandingTrustScoreStory
} from "@/lib/landing/trust-scores";
import { tutoringHeritageTrust } from "@/lib/site";

const MARQUEE_SCHOOLS = (() => {
  const schools = allTrustMetroMarqueeSchools();
  return [...schools, ...schools];
})();

function marqueeItems<T>(items: T[]): T[] {
  if (items.length === 0) return [];
  if (items.length === 1) return [...items, ...items, ...items, ...items];
  return [...items, ...items];
}

function SectionLine({
  label,
  before,
  after
}: {
  label: string;
  before: number;
  after: number;
}) {
  return (
    <div className="il-trust-score-section-row">
      <span className="il-trust-score-section-label">{label}</span>
      <span className="il-trust-score-section-move">
        <span className="il-trust-score-before">{before}</span>
        <span className="il-trust-score-arrow" aria-hidden>
          →
        </span>
        <span className="il-trust-score-after">{after}</span>
      </span>
    </div>
  );
}

function TrustScoreTickerCard({ story }: { story: LandingTrustScoreStory }) {
  const totalBefore = trustScoreTotalBefore(story);
  const totalAfter = trustScoreTotalAfter(story);
  const gain = trustScoreGain(story);

  return (
    <div className="il-trust-score-card il-trust-score-card--ticker">
      <p className="il-trust-score-name">{story.name}</p>
      <p className="il-trust-score-hs">{story.highSchool}</p>
      <div className="il-trust-score-sections">
        <SectionLine
          label={landingTrustScoreSectionLabels.readingWriting}
          before={story.readingWritingBefore}
          after={story.readingWritingAfter}
        />
        <SectionLine
          label={landingTrustScoreSectionLabels.math}
          before={story.mathBefore}
          after={story.mathAfter}
        />
      </div>
      <p className="il-trust-score-total">
        <span className="il-trust-score-section-label">
          {landingTrustScoreSectionLabels.total}
        </span>
        <span className="il-trust-score-total-move">
          <span className="il-trust-score-before">{totalBefore}</span>
          <span className="il-trust-score-arrow" aria-hidden>
            →
          </span>
          <span className="il-trust-score-after">{totalAfter}</span>
          <span className="il-trust-score-gain">+{gain}</span>
          {story.verified ? (
            <span className="il-trust-score-badge">Verified</span>
          ) : null}
        </span>
      </p>
      <p className="il-trust-score-college">
        <span className="il-trust-score-college-label">College:</span> {story.college}
      </p>
    </div>
  );
}

function ScoreTicker({ stories }: { stories: LandingTrustScoreStory[] }) {
  const items = marqueeItems(stories);
  const uniqueCount = stories.length;
  if (items.length === 0) return null;

  return (
    <div className="il-trust-scores-block">
      <div className="il-trust-bar-viewport">
        <ul className="il-trust-bar-track il-trust-scores-track" aria-label="Student outcomes">
          {items.map((story, index) => {
            const duplicate = index >= uniqueCount;
            return (
              <li
                key={`${story.name}-${story.readingWritingBefore}-${index}`}
                className="il-trust-bar-item il-trust-bar-score"
                aria-hidden={duplicate ? true : undefined}
              >
                <TrustScoreTickerCard story={story} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SchoolTicker() {
  const uniqueCount = MARQUEE_SCHOOLS.length / 2;

  return (
    <div className="il-trust-bar-viewport il-trust-schools-marquee-wrap">
      <ul className="il-trust-bar-track il-trust-schools-track" aria-label="High schools">
        {MARQUEE_SCHOOLS.map((school, index) => (
          <li
            key={`${school}-${index}`}
            className="il-trust-bar-item il-trust-school-marquee-item"
            aria-hidden={index >= uniqueCount ? true : undefined}
          >
            {school}
          </li>
        ))}
      </ul>
    </div>
  );
}

type ScoreTrustBarProps = {
  preferredMetroId?: TrustMetroId | null;
};

/** Single above-the-fold trust strip — marquee scores + schools, no scroll grid. */
export function ScoreTrustBar({ preferredMetroId = null }: ScoreTrustBarProps) {
  const stories = sortTrustScoreStories(landingTrustScoreStoriesReady, preferredMetroId);

  return (
    <section
      className="il-trust-bar il-trust-bar--scores il-trust-bar--ticker il-trust-bar--national"
      aria-labelledby="il-trust-bar-heading"
    >
      <div className="il-premium-container il-trust-bar-inner">
        <p className="il-trust-bar-eyebrow">{tutoringHeritageTrust.eyebrow}</p>
        <p id="il-trust-bar-heading" className="il-trust-bar-title">
          {landingScoreTrustBar.heading}
        </p>
        <ScoreTicker stories={stories} />
        <SchoolTicker />
        <p className="il-trust-bar-disclaimer">{landingTrustBarDisclaimer}</p>
      </div>
    </section>
  );
}
