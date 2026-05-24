import type {
  Int8PrepBeat,
  Int8PrepComparisonCopy
} from "@/lib/sat-plan-funnel/int8-prep-comparison-copy";
import { Int8PrepComparisonGraphic } from "@/components/sat-plan/int8-prep-comparison-graphic";
import { Int8PrepPathTriptych } from "@/components/sat-plan/int8-prep-path-triptych";

type Int8PrepComparisonBodyProps = {
  copy: Int8PrepComparisonCopy;
  beat?: Int8PrepBeat;
  testTaker?: string;
};

export function Int8PrepComparisonBody({
  copy,
  beat = "full",
  testTaker
}: Int8PrepComparisonBodyProps) {
  const showPlateau = beat === "full" || beat === "plateau";
  const showChart = beat === "full" || beat === "proof";
  const showGuided = beat === "full" || beat === "guided";
  const showPlateauTriptych =
    copy.showPrepPathsVisual &&
    copy.triptychFocusPlateau &&
    (beat === "plateau" || beat === "full");
  const showGuidedTriptych =
    copy.showPrepPathsVisual &&
    copy.triptychFocusGuided &&
    beat === "full";

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
        showPlateauTriptych ? (
          <>
            {copy.prepLead ? (
              <p className="quiz-step-copy int8-prep-comparison__mirror">
                You picked <strong>{copy.prepLead}</strong>.
              </p>
            ) : null}
            <Int8PrepPathTriptych
              focus={copy.triptychFocusPlateau!}
              testTaker={testTaker}
            />
            {copy.plateauFollowUp ? (
              <p className="quiz-step-copy int8-prep-comparison__mirror">
                {copy.plateauFollowUp}
              </p>
            ) : null}
            {!copy.plateauFollowUp && copy.mirrorBody && (beat === "plateau" || beat === "full") ? (
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

      {showGuidedTriptych ? (
        <Int8PrepPathTriptych
          focus={copy.triptychFocusGuided!}
          testTaker={testTaker}
        />
      ) : null}

      {showGuided ? (
        <p className="quiz-step-copy int8-prep-comparison__after-chart">
          {copy.tutorProcessCopy}
        </p>
      ) : null}
    </div>
  );
}
