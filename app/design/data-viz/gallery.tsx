"use client";

import { ChartFrame } from "@/components/data-viz/chart-frame";
import { LedgerRank } from "@/components/data-viz/ledger-rank";
import { MilestoneRibbon } from "@/components/data-viz/milestone-ribbon";
import { VisxHorizonPath } from "@/components/data-viz/visx-horizon-path";
import { VisxScoreDumbbell } from "@/components/data-viz/visx-score-dumbbell";
import { VisxSpectrumBand } from "@/components/data-viz/visx-spectrum-band";
import { VisxTideReadout } from "@/components/data-viz/visx-tide-readout";
import { VisxSkillLollipop } from "@/components/data-viz/visx-skill-lollipop";
import { VisxGapBridge } from "@/components/data-viz/visx-gap-bridge";
import { VisxQuestionMap } from "@/components/data-viz/visx-question-map";
import {
  sohaRankedSkills,
  sohaGapBridgeSegments,
  sohaQuestionMap,
} from "@/lib/data-viz/adapters/soha-diagnostic";

const SOHA_HORIZON = [
  { id: "start", label: "START", score: 1400 },
  { id: "wk4", label: "WK 4 · PT", score: 1480 },
  { id: "wk8", label: "WK 8 · PT", score: 1510 },
  { id: "test", label: "AUG 22", score: 1525 },
];

const SOHA_CURRENT = 1400;
const SOHA_TARGET = 1525;
const SOHA_SKILLS = sohaRankedSkills();
const SOHA_BRIDGE = sohaGapBridgeSegments(SOHA_SKILLS, SOHA_CURRENT, SOHA_TARGET);

const SKILL_ROWS = [
  { rank: 1, name: "Transitions", note: "Reading and Writing · relationship-before-choices", points: 52 },
  { rank: 2, name: "Factoring & factor theorem", note: "Math · calculator vs by-hand setup", points: 48 },
  { rank: 3, name: "Boundaries", note: "Reading and Writing · complete-clause check", points: 33 },
  { rank: 4, name: "Command of Evidence", note: "Reading and Writing · true but off-claim", points: 22 },
  { rank: 5, name: "Subject-verb agreement", note: "Reading and Writing · interrupting phrases", points: 16 },
];

const RIBBON_WEEKS = [
  { week: 1, skill: "Transitions", points: 52 },
  { week: 2, skill: "Factoring", points: 48 },
  { week: 3, skill: "Boundaries", points: 33 },
  { week: 4, skill: "Command of Evidence", points: 22, highlight: true },
  { week: 5, skill: "Geometry", points: 16 },
  { week: 6, skill: "Advanced Math", points: 27 },
  { week: 7, skill: "Subject-Verb", points: 16 },
  { week: 8, skill: "Mixed review", points: null, highlight: true },
  { week: 9, skill: "Test week", points: null, highlight: true },
];

export function DataVizGallery() {
  return (
    <div className="dv-gallery">
      <header className="dv-gallery__hero">
        <p className="dv-gallery__eyebrow">Implementation scratchpad · not ideation</p>
        <h1 className="dv-gallery__title">Style prototypes (6 families)</h1>
        <p className="dv-gallery__lede">
          <strong>These mostly reskin SOHA / funnel charts with aurora styling.</strong>{" "}
          For true encoding exploration, open{" "}
          <code>design/mockups/10-sat-viz-ideation-matrix.html</code> locally (no dev server).
          Visx here is a drawing tool, not a chart library. This page is rough on mobile.
        </p>
        <span className="dv-gallery__badge">Library: @visx/shape · @visx/scale · @visx/responsive · @visx/gradient</span>
      </header>

      <div className="dv-gallery__grid">
        <ChartFrame
          label="Visx · Family 01"
          title="Projected path · Soha · Aug 22"
          subtitle="Monotone curve, area fill, stretch goal line — scales from @visx/scale"
          footnote="Illustrative projection · Results vary"
        >
          <VisxHorizonPath
            points={SOHA_HORIZON}
            stretchGoal={1550}
            ariaLabel="Score path from 1400 to about 1525 by August 22 with practice tests at weeks 4 and 8"
          />
        </ChartFrame>

        <div className="dv-gallery__row-2">
          <ChartFrame
            label="Visx · Family 07"
            title="Score gap · dumbbell"
            subtitle="Linear scale + gradient connector"
            footnote="Sample · 1400 today · ~1525 goal"
          >
            <VisxScoreDumbbell
              current={1400}
              target={1525}
              targetLabel="Goal · Aug 22"
              ariaLabel="Current score 1400, goal about 1525, gap 125 points"
            />
          </ChartFrame>

          <ChartFrame
            label="Visx · Family 04"
            title="Accuracy by difficulty"
            subtitle="Band scales · gradient underline bars"
            footnote="Diagnostic excerpt · percentage correct"
          >
            <VisxTideReadout
              sections={[
                {
                  title: "Reading & Writing",
                  bands: [
                    { label: "Easy", value: 96 },
                    { label: "Medium", value: 82 },
                    { label: "Hard", value: 71 },
                  ],
                },
                {
                  title: "Math",
                  bands: [
                    { label: "Easy", value: 100 },
                    { label: "Medium", value: 88 },
                    { label: "Hard", value: 75 },
                  ],
                },
              ]}
              ariaLabel="Accuracy by difficulty for Reading and Writing and Math"
              height={220}
            />
          </ChartFrame>
        </div>

        <ChartFrame
          label="Visx · Family 05"
          title="How hard is this goal?"
          subtitle="Spectrum band with marker on aurora gradient"
          footnote="Modeled tiers · not a guarantee · Results vary"
        >
          <div className="dv-stat-strip">
            <div>
              <div className="dv-stat-strip__val dv-stat-strip__val--em">+125</div>
              <div className="dv-stat-strip__lbl">Score gap</div>
            </div>
            <div>
              <div className="dv-stat-strip__val">66</div>
              <div className="dv-stat-strip__lbl">Days to test</div>
            </div>
            <div>
              <div className="dv-stat-strip__val dv-stat-strip__val--em">~14</div>
              <div className="dv-stat-strip__lbl">Pts / wk</div>
            </div>
            <div>
              <div className="dv-stat-strip__val">Aug 22</div>
              <div className="dv-stat-strip__lbl">Test date</div>
            </div>
          </div>
          <VisxSpectrumBand
            tiers={[
              { id: "c", label: "Conservative", ptsPerWeek: 10, score: 1490 },
              { id: "p", label: "This plan", ptsPerWeek: 14, score: 1525 },
              { id: "s", label: "Stretch", ptsPerWeek: 18, score: 1562 },
              { id: "m", label: "Max effort", ptsPerWeek: 20, score: 1580 },
            ]}
            activeTierId="p"
            markerPosition={0.52}
            ariaLabel="Goal effort spectrum with this plan at about 1525"
          />
        </ChartFrame>

        <div className="dv-gallery__row-2">
          <ChartFrame
            label="Visx · Family 02"
            title="Ranked recoverable points"
            subtitle="Lollipop · scaleBand × scaleLinear · forest plot without the dashboard"
            footnote="Modeled from diagnostic misses · Results vary"
          >
            <VisxSkillLollipop
              skills={SOHA_SKILLS}
              ariaLabel="Top skills by estimated recoverable SAT points, led by Transitions at about 52 points"
            />
          </ChartFrame>

          <ChartFrame
            label="Visx · Gap bridge"
            title="Does the gap add up?"
            subtitle="Stacked segments from current to goal · remainder = polish"
            footnote={`${SOHA_CURRENT} today · ~${SOHA_TARGET} goal · modeled recoverable`}
          >
            <VisxGapBridge
              current={SOHA_CURRENT}
              target={SOHA_TARGET}
              segments={SOHA_BRIDGE}
              ariaLabel={`Score gap bridge from ${SOHA_CURRENT} to about ${SOHA_TARGET}, broken into top skill segments`}
            />
          </ChartFrame>
        </div>

        <ChartFrame
          label="Visx · Question map"
          title="What the test showed · 98 questions"
          subtitle="Unit matrix · miss = soft celestial fill · E/M/H on miss only"
          footnote="85 of 98 correct · 13 missed · Soha diagnostic excerpt"
        >
          <VisxQuestionMap
            sections={sohaQuestionMap()}
            ariaLabel="Question performance map showing 13 missed questions across Reading and Writing and Math modules"
          />
        </ChartFrame>

        <ChartFrame
          label="Family 02 · HTML"
          title="Highest-impact skills · ledger (HTML alt)"
          subtitle="Editorial list when SVG is overkill"
          footnote="Same data as lollipop · pick one per surface"
        >
          <LedgerRank
            rows={SKILL_ROWS}
            footerLeft="Already strong · Circles, linear equations"
            footerTotal={214}
            ariaLabel="Top five skills by recoverable SAT points"
          />
        </ChartFrame>

        <ChartFrame
          label="Family 06 · HTML"
          title="Nine-week schedule"
          subtitle="Milestone ribbon — week cards + PT pins (exploring vs Gantt)"
          footnote="Sample Soha plan cadence"
        >
          <MilestoneRibbon
            weeks={RIBBON_WEEKS}
            pins={[
              { week: 4, label: "PT 1" },
              { week: 8, label: "PT 2" },
              { week: 9, label: "Aug 22", test: true },
            ]}
            ariaLabel="Nine week SAT schedule with practice tests and August 22 test day"
          />
        </ChartFrame>
      </div>
    </div>
  );
}
