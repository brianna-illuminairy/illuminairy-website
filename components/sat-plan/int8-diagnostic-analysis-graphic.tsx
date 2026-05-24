"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type {
  DiagnosticPhaseKey,
  Int8DiagnosticDrivenCopy
} from "@/lib/sat-plan-funnel/int8-diagnostic-driven-copy";
import {
  formatPointsGain,
  prioritySkillsFromCopy,
  tagLabel
} from "@/lib/sat-plan-funnel/int8-diagnostic-driven-copy";

type Int8DiagnosticAnalysisGraphicProps = {
  copy: Int8DiagnosticDrivenCopy;
};

const PHASE_MS: Record<Exclude<DiagnosticPhaseKey, "ready">, number> = {
  analyzing: 5600,
  filtering: 4800,
  building: 5200
};

const TAG_REVEAL_MS = 175;
const FILTER_SLOT_MS = 780;
const BUILD_STEP_MS = 880;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function Int8DiagnosticAnalysisGraphic({ copy }: Int8DiagnosticAnalysisGraphicProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<DiagnosticPhaseKey>("analyzing");
  const [revealedTags, setRevealedTags] = useState(0);
  const [filterStep, setFilterStep] = useState(0);
  const [buildStep, setBuildStep] = useState(0);

  const prioritySkills = useMemo(() => prioritySkillsFromCopy(copy), [copy]);
  const scrollSkills = useMemo(() => [...copy.skills, ...copy.skills], [copy.skills]);

  const displayPhase: DiagnosticPhaseKey = reducedMotion ? "ready" : phase;
  const displayRevealedTags = reducedMotion ? copy.skills.length : revealedTags;
  const displayFilterStep = reducedMotion ? prioritySkills.length : filterStep;
  const displayBuildStep = reducedMotion ? prioritySkills.length : buildStep;

  useEffect(() => {
    if (reducedMotion) return;

    const t1 = window.setTimeout(() => setPhase("filtering"), PHASE_MS.analyzing);
    const t2 = window.setTimeout(
      () => setPhase("building"),
      PHASE_MS.analyzing + PHASE_MS.filtering
    );
    const t3 = window.setTimeout(
      () => setPhase("ready"),
      PHASE_MS.analyzing + PHASE_MS.filtering + PHASE_MS.building
    );

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || phase !== "analyzing") return;

    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      setRevealedTags(count);
      if (count >= copy.skills.length) window.clearInterval(timer);
    }, TAG_REVEAL_MS);

    return () => window.clearInterval(timer);
  }, [copy.skills.length, phase, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || phase !== "filtering") return;

    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setFilterStep(step);
      if (step >= prioritySkills.length) window.clearInterval(timer);
    }, FILTER_SLOT_MS);

    return () => window.clearInterval(timer);
  }, [phase, prioritySkills.length, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || phase !== "building") return;

    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setBuildStep(step);
      if (step >= prioritySkills.length) window.clearInterval(timer);
    }, BUILD_STEP_MS);

    return () => window.clearInterval(timer);
  }, [phase, prioritySkills.length, reducedMotion]);

  const phaseCopy = copy.phases[displayPhase];
  const showScan = displayPhase === "analyzing" || displayPhase === "filtering";
  const showPriority =
    displayPhase === "filtering" || displayPhase === "building" || displayPhase === "ready";
  const showRoadmap = displayPhase === "building" || displayPhase === "ready";

  const scoreIndex =
    displayPhase === "ready"
      ? copy.scoreMilestones.length - 1
      : Math.min(Math.max(displayBuildStep - 1, 0), copy.scoreMilestones.length - 1);

  const progressPct =
    displayPhase === "ready"
      ? 100
      : displayPhase === "building"
        ? Math.round((displayBuildStep / Math.max(prioritySkills.length, 1)) * 100)
        : displayPhase === "filtering"
          ? 48
          : 12;

  return (
    <div
      className={[
        "int8-diagnostic-analysis quiz-step-trust-graphic int8-diagnostic-analysis--inset",
        `int8-diagnostic-analysis--${displayPhase}`
      ].join(" ")}
      role="img"
      aria-label={copy.graphicAriaLabel}
      aria-live="polite"
    >
      <div className="quiz-step-trust-card int8-diagnostic-analysis__card">
        <header className="int8-diagnostic-analysis__header">
          <h2 className="int8-diagnostic-analysis__title">{phaseCopy.title}</h2>
          {phaseCopy.subtext ? (
            <p className="int8-diagnostic-analysis__subtext">{phaseCopy.subtext}</p>
          ) : null}
        </header>

        <div className="int8-diagnostic-analysis__stage">
          {showScan ? (
            <div className="int8-diagnostic-analysis__scan-panel">
              <div className="int8-diagnostic-analysis__scan-window">
                <ul className="int8-diagnostic-analysis__skill-track" aria-hidden>
                  {scrollSkills.map((skill, index) => {
                    const baseIndex = index % copy.skills.length;
                    const isPriority = copy.prioritySkillIds.includes(skill.id);
                    const tagged = baseIndex < displayRevealedTags || displayPhase === "filtering";
                    const faded =
                      displayPhase === "filtering" &&
                      (skill.tag === "strong" || skill.tag === "low-impact");
                    const dimmed = displayPhase === "filtering" && skill.tag === "developing";

                    return (
                      <li
                        key={`${skill.id}-${index}`}
                        className={[
                          "int8-diagnostic-analysis__skill-row",
                          `int8-diagnostic-analysis__skill-row--${skill.tag}`,
                          tagged ? "is-tagged" : "",
                          faded ? "is-faded" : "",
                          dimmed ? "is-dimmed" : "",
                          displayPhase === "filtering" && isPriority ? "is-priority" : ""
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={{ "--skill-i": baseIndex } as CSSProperties}
                      >
                        <span className="int8-diagnostic-analysis__skill-name">{skill.label}</span>
                        {tagged ? (
                          <span className="int8-diagnostic-analysis__skill-tag">
                            {tagLabel(skill.tag)}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : null}

          {showPriority ? (
            <ol
              className={[
                "int8-diagnostic-analysis__priority-list",
                displayPhase === "filtering" ? "is-locking" : "",
                displayPhase === "building" || displayPhase === "ready" ? "is-visible" : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {prioritySkills.map((skill, index) => {
                const slottedDuringFilter =
                  displayPhase === "filtering" && index < displayFilterStep;
                const slottedLater =
                  displayPhase === "building" || displayPhase === "ready";
                if (!slottedDuringFilter && !slottedLater) return null;

                const pointsLabel =
                  skill.pointsGain != null ? formatPointsGain(skill.pointsGain) : null;

                return (
                  <li
                    key={skill.id}
                    className={[
                      "int8-diagnostic-analysis__priority-item",
                      slottedDuringFilter || slottedLater ? "is-slotted" : "",
                      displayPhase === "building" && index === displayBuildStep - 1
                        ? "is-active"
                        : "",
                      displayPhase === "building" && index < displayBuildStep ? "is-added" : "",
                      displayPhase === "ready" ? "is-added" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="int8-diagnostic-analysis__priority-rank">{index + 1}</span>
                    <span className="int8-diagnostic-analysis__priority-name">{skill.label}</span>
                    {pointsLabel ? (
                      <span className="int8-diagnostic-analysis__priority-pts">{pointsLabel}</span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          ) : null}

          {showRoadmap ? (
            <div className="int8-diagnostic-analysis__roadmap">
              <div className="int8-diagnostic-analysis__score-row" aria-hidden>
                {copy.scoreMilestones.map((score, index) => {
                  const visible = displayPhase === "ready" || index <= scoreIndex;
                  return (
                    <span
                      key={`${score}-${index}`}
                      className={[
                        "int8-diagnostic-analysis__score-chip",
                        visible ? "is-visible" : "",
                        index === copy.scoreMilestones.length - 1 ? "is-goal" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {index > 0 ? (
                        <span className="int8-diagnostic-analysis__score-arrow">→</span>
                      ) : null}
                      <span>{score}</span>
                    </span>
                  );
                })}
              </div>

              <div className="int8-diagnostic-analysis__progress-wrap">
                <div className="int8-diagnostic-analysis__week-map" aria-hidden>
                  {copy.focusWeekRanges.map((range, index) => {
                    const weekActive =
                      displayPhase === "ready" ||
                      (displayPhase === "building" && index < displayBuildStep);
                    return (
                      <div
                        key={`${range}-${index}`}
                        className={[
                          "int8-diagnostic-analysis__week-block",
                          weekActive ? "is-active" : ""
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span className="int8-diagnostic-analysis__week-label">Wk {range}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="int8-diagnostic-analysis__progress-track" aria-hidden>
                  <span
                    className="int8-diagnostic-analysis__progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="int8-diagnostic-analysis__timeline">
                  {copy.timelineWeeks}-week focus plan
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {displayPhase === "ready" && phaseCopy.summary ? (
          <p className="int8-diagnostic-analysis__summary">{phaseCopy.summary}</p>
        ) : null}
      </div>
    </div>
  );
}
