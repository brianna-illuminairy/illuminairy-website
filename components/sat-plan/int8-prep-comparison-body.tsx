import type {
  Int8PrepBeat,
  Int8PrepComparisonCopy
} from "@/lib/sat-plan-funnel/int8-prep-comparison-copy";
import { Int8PrepComparisonGraphic } from "@/components/sat-plan/int8-prep-comparison-graphic";
import { Int8PrepContrastPair } from "@/components/sat-plan/int8-prep-contrast-pair";
import { Int8PrepPathTriptych } from "@/components/sat-plan/int8-prep-path-triptych";
import { Int8ScoreImpactMap } from "@/components/sat-plan/int8-score-impact-map";

type Int8PrepComparisonBodyProps = {
  copy: Int8PrepComparisonCopy;
  beat?: Int8PrepBeat;
  testTaker?: string;
};

export function Int8PrepComparisonBody({
  copy,
  beat = "proof",
  testTaker
}: Int8PrepComparisonBodyProps) {
  const showPlateau = beat === "plateau";
  const showChart = beat === "proof";
  const showGuided = beat === "guided";
  const showPlateauContrastPair =
    copy.showPrepPathsVisual &&
    copy.contrastPairPlateau &&
    beat === "plateau";
  const showPlateauTriptych =
    copy.showPrepPathsVisual &&
    copy.triptychFocusPlateau &&
    !copy.contrastPairPlateau &&
    beat === "plateau";

  return (
    <div
      className={[
        "quiz-step-trust-content int8-prep-comparison",
        beat === "guided" ? "int8-prep-comparison--guided-only" : "",
        beat === "proof" ? "int8-prep-comparison--proof-only" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showPlateau && copy.eyebrow ? (
        <p className="quiz-step-eyebrow">{copy.eyebrow}</p>
      ) : null}

      {showPlateau ? (
        showPlateauContrastPair || showPlateauTriptych ? (
          <>
            {copy.prepLead ? (
              <p className="quiz-step-copy int8-prep-comparison__mirror">
                You picked <strong>{copy.prepLead}</strong>.
              </p>
            ) : null}
            {showPlateauContrastPair ? (
              <Int8PrepContrastPair
                pair={copy.contrastPairPlateau!}
                testTaker={testTaker}
              />
            ) : (
              <Int8PrepPathTriptych
                focus={copy.triptychFocusPlateau!}
                testTaker={testTaker}
              />
            )}
            {copy.plateauFollowUp ? (
              <p className="quiz-step-copy int8-prep-comparison__mirror">
                {copy.plateauFollowUp}
              </p>
            ) : null}
            {!copy.plateauFollowUp && copy.mirrorBody && beat === "plateau" ? (
              <p className="quiz-step-copy int8-prep-comparison__mirror">
                {copy.mirrorBody}
              </p>
            ) : null}
          </>
        ) : (
          <p className="quiz-step-copy int8-prep-comparison__mirror">
            {copy.prepLead ? (
              <>
                You picked <strong>{copy.prepLead}</strong>.{" "}
              </>
            ) : null}
            {copy.mirrorBody}
          </p>
        )
      ) : null}

      {showChart && copy.proofBloomCopy ? (
        <p className="quiz-step-copy int8-prep-comparison__proof-lead">
          {copy.proofBloomCopy}
        </p>
      ) : null}

      {showChart ? (
        <Int8PrepComparisonGraphic
          selfStudyPoints={copy.selfStudyPoints}
          groupClassPoints={copy.groupClassPoints}
          guidedPoints={copy.guidedPoints}
          chartTitle={copy.chartTitle}
        />
      ) : null}

      {showChart && beat === "proof" ? (
        <p className="quiz-step-copy int8-prep-comparison__after-chart">
          {copy.proofAfterChartCopy}
        </p>
      ) : null}

      {showGuided ? (
        <>
          {copy.guidedSubhead ? (
            <p className="quiz-step-copy int8-prep-comparison__guided-subhead">
              {copy.guidedSubhead}
            </p>
          ) : null}
          <p className="quiz-step-copy int8-prep-comparison__guided-intro">
            {copy.guidedIntro}
          </p>
          <Int8ScoreImpactMap map={copy.scoreImpactMap} />
        </>
      ) : null}
    </div>
  );
}
