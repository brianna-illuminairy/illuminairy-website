"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  buildListFitReport,
  competitiveFraming,
  positionLabel,
  targetBasisLabel,
  type StandoutHook
} from "@/lib/list-fit-check";
import type { FlagshipSchoolId } from "@/lib/georgia-flagship-scores";
import { trackFunnelEvent } from "@/funnel/lib/track";

const schoolOptions: { id: FlagshipSchoolId; label: string }[] = [
  { id: "uga", label: "University of Georgia" },
  { id: "georgia-tech", label: "Georgia Tech" },
  { id: "emory", label: "Emory" }
];

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-ivory px-4 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

export function ListFitTool() {
  const [unweightedGpa, setUnweightedGpa] = useState("3.85");
  const [weightedGpa, setWeightedGpa] = useState("4.2");
  const [satTotal, setSatTotal] = useState("1320");
  const [satRw, setSatRw] = useState("");
  const [satMath, setSatMath] = useState("");
  const [showSections, setShowSections] = useState(false);
  const [schools, setSchools] = useState<FlagshipSchoolId[]>([
    "uga",
    "georgia-tech",
    "emory"
  ]);
  const [standoutHook, setStandoutHook] = useState<StandoutHook>("not_sure");
  const [submitted, setSubmitted] = useState(false);

  const report = useMemo(() => {
    if (!submitted) return null;
    return buildListFitReport({
      unweightedGpa: parseGpa(unweightedGpa),
      weightedGpa: parseGpa(weightedGpa),
      satTotal: parseInt(satTotal, 10) || 0,
      satReadingWriting: showSections ? parseInt(satRw, 10) : undefined,
      satMath: showSections ? parseInt(satMath, 10) : undefined,
      schoolIds: schools,
      standoutHook
    });
  }, [
    submitted,
    unweightedGpa,
    weightedGpa,
    satTotal,
    satRw,
    satMath,
    showSections,
    schools,
    standoutHook
  ]);

  function toggleSchool(id: FlagshipSchoolId) {
    setSchools((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schools.length) return;
    trackFunnelEvent(AnalyticsEvents.listFitStarted);
    setSubmitted(true);
    trackFunnelEvent(AnalyticsEvents.listFitCompleted, {
      sat_score: parseInt(satTotal, 10) || 0,
      schools: schools.join(",")
    });
  }

  function onApply() {
    trackFunnelEvent(AnalyticsEvents.listFitCtaApply, {
      sat_score: parseInt(satTotal, 10) || 0
    });
  }

  const applyHref = `/get-started?from=list-fit&sat_score=${satTotal}`;

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-[13px] font-semibold text-ink">
            Unweighted GPA
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              max={4}
              required
              value={unweightedGpa}
              onChange={(e) => {
                setSubmitted(false);
                setUnweightedGpa(e.target.value);
              }}
              placeholder="e.g. 3.85"
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-[13px] font-semibold text-ink">
            Weighted GPA
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              max={6}
              value={weightedGpa}
              onChange={(e) => {
                setSubmitted(false);
                setWeightedGpa(e.target.value);
              }}
              placeholder="e.g. 4.20"
              className={inputClass}
            />
            <span className="text-[12px] font-normal text-ink-soft">
              Optional if your school reports it
            </span>
          </label>
        </div>

        <label className="grid gap-2 text-[13px] font-semibold text-ink">
          Latest SAT total score
          <input
            type="number"
            inputMode="numeric"
            min={400}
            max={1600}
            step={10}
            required
            value={satTotal}
            onChange={(e) => {
              setSubmitted(false);
              setSatTotal(e.target.value);
            }}
            placeholder="e.g. 1320"
            className={inputClass}
          />
          <span className="text-[12px] font-normal text-ink-soft">
            Official May score or best recent practice test (400–1600)
          </span>
        </label>

        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line px-4 text-[14px] text-ink">
          <input
            type="checkbox"
            checked={showSections}
            onChange={(e) => {
              setSubmitted(false);
              setShowSections(e.target.checked);
            }}
            className="h-5 w-5 accent-gold"
          />
          I have Reading &amp; Writing and Math section scores
        </label>

        {showSections && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-[13px] font-semibold text-ink">
              Reading &amp; Writing
              <input
                type="number"
                inputMode="numeric"
                min={200}
                max={800}
                step={10}
                value={satRw}
                onChange={(e) => {
                  setSubmitted(false);
                  setSatRw(e.target.value);
                }}
                placeholder="e.g. 620"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-[13px] font-semibold text-ink">
              Math
              <input
                type="number"
                inputMode="numeric"
                min={200}
                max={800}
                step={10}
                value={satMath}
                onChange={(e) => {
                  setSubmitted(false);
                  setSatMath(e.target.value);
                }}
                placeholder="e.g. 700"
                className={inputClass}
              />
            </label>
          </div>
        )}

        <fieldset className="grid gap-2">
          <legend className="text-[13px] font-semibold text-ink">
            Schools on their list
          </legend>
          {schoolOptions.map((s) => (
            <label
              key={s.id}
              className="flex min-h-12 cursor-pointer items-center rounded-xl border border-line px-4 has-[:checked]:border-gold"
            >
              <input
                type="checkbox"
                checked={schools.includes(s.id)}
                onChange={() => {
                  setSubmitted(false);
                  toggleSchool(s.id);
                }}
                className="mr-3 h-5 w-5 accent-gold"
              />
              {s.label}
            </label>
          ))}
        </fieldset>

        <label className="grid gap-2 text-[13px] font-semibold text-ink">
          <span>
            Besides grades and test scores, is there something major that sets
            them apart? (optional)
          </span>
          <span className="text-[12px] font-normal leading-relaxed text-ink-soft">
            Examples: a college coach is recruiting them for a sport, a
            national-level award, or similar — not just good GPA and clubs.
          </span>
          <select
            value={standoutHook}
            onChange={(e) => {
              setSubmitted(false);
              setStandoutHook(e.target.value as StandoutHook);
            }}
            className={inputClass}
          >
            <option value="not_sure">Not sure</option>
            <option value="no">
              No — strong student, but mostly like other applicants on paper
            </option>
            <option value="yes">
              Yes — something major (recruited athlete, national award, etc.)
            </option>
          </select>
        </label>

        <button
          type="submit"
          className="min-h-12 rounded-xl border border-ink bg-ink text-[15px] font-semibold text-ivory"
        >
          See score targets for their list
        </button>
      </form>

      {report && (
        <div className="mt-10 grid gap-8">
          <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5 text-[14px] leading-relaxed text-ink-soft">
            <p className="font-semibold text-ink">
              This is not a chance-of-admission calculator
            </p>
            <p className="mt-2">{report.gpaSummary}</p>
            <p className="mt-2">
              Targets below use published SAT ranges for students who{" "}
              <strong className="text-ink">submitted</strong> scores. They show
              what many families aim for to be{" "}
              <strong className="text-ink">competitive on test scores</strong> —
              not a promise you will get in.
            </p>
          </div>

          <article className="rounded-2xl border-2 border-gold/40 bg-ivory p-5">
            <h2 className="font-serif text-lg text-ink">
              SAT targets for the toughest school on your list
            </h2>
            <p className="mt-1 text-[13px] text-ink-soft">
              {report.primaryTargets.schoolName} ·{" "}
              {targetBasisLabel(report.primaryTargets.basis)}
            </p>
            <dl className="mt-5 grid gap-3">
              <ScoreRow
                label="Combined"
                current={report.current.total}
                target={report.primaryTargets.composite}
                gap={report.gaps.composite}
              />
              <ScoreRow
                label="Reading & Writing"
                current={report.current.readingWriting}
                target={report.primaryTargets.readingWriting}
                gap={report.gaps.readingWriting}
              />
              <ScoreRow
                label="Math"
                current={report.current.math}
                target={report.primaryTargets.math}
                gap={report.gaps.math}
              />
            </dl>
            {!showSections && (
              <p className="mt-3 text-[12px] text-ink-soft">
                Section targets are estimated from your total using typical
                splits for this school. Add section scores above for a tighter
                breakdown.
              </p>
            )}
          </article>

          <div className="rounded-2xl border border-line bg-ivory-50 p-5 text-[14px] text-ink-soft">
            <p className="font-semibold text-ink">
              Middle 50% does not mean accepted
            </p>
            <p className="mt-2">
              Being in the published middle band means the score looks like many
              other applicants. For most students without a recruited sport or
              similar edge, families often aim for the upper band (75th
              percentile among submitters).
            </p>
          </div>

          {report.perSchool.map((r) => (
            <article
              key={r.school.id}
              className="rounded-2xl border border-line bg-ivory-50 p-5"
            >
              <h2 className="font-serif text-lg text-ink">{r.school.name}</h2>
              <p className="mt-2 text-[14px] font-medium text-ink">
                {positionLabel(r.position)}
              </p>
              <p className="mt-2 text-[13px] text-ink-soft">
                {competitiveFraming(r.position, standoutHook)}
              </p>
              <p className="mt-3 text-[13px] text-ink-soft">
                Target for this school ({r.competitiveTarget === "75th" ? "75th" : "50th"} percentile
                among submitters):{" "}
                <strong className="text-ink">
                  {r.sectionTargets.total} total ({r.sectionTargets.readingWriting}{" "}
                  R&amp;W · {r.sectionTargets.math} Math)
                </strong>
                {r.pointsTo75th > 0 && r.competitiveTarget === "75th" && (
                  <>
                    {" "}
                    · About <strong>{r.pointsTo75th}</strong> points on the total
                    to reach that band from today
                  </>
                )}
              </p>
              <p className="mt-2 text-[12px] text-ink-soft">
                Published middle 50% for submitters: {r.school.composite25}–
                {r.school.composite75} combined
              </p>
            </article>
          ))}

          <Link
            href={applyHref}
            onClick={onApply}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-ink bg-ink px-6 text-[15px] font-semibold text-ivory"
          >
            Apply for the August program
          </Link>
        </div>
      )}
    </div>
  );
}

function ScoreRow({
  label,
  current,
  target,
  gap
}: {
  label: string;
  current: number;
  target: number;
  gap: number;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line/80 pb-3 last:border-0 last:pb-0">
      <dt className="text-[13px] font-semibold text-ink">{label}</dt>
      <dd className="text-right text-[14px] text-ink">
        <span className="text-ink-soft">Now {current}</span>
        {" → "}
        <span className="font-semibold">aim for {target}</span>
        {gap > 0 && (
          <span className="block text-[12px] text-gold-deep">
            ~{gap} points to go
          </span>
        )}
        {gap === 0 && (
          <span className="block text-[12px] text-ink-soft">
            At or above this target band
          </span>
        )}
      </dd>
    </div>
  );
}

function parseGpa(raw: string): number | undefined {
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return undefined;
  return n;
}

