import type { ModuleMap } from "@/lib/diagnostic/report-types";
import {
  QUESTION_MAP,
  RW_PRIORITY,
  MATH_PRIORITY,
  DIFFICULTY_READOUT,
  RW_MISS_TABLE,
  MATH_MISS_TABLE,
} from "@/lib/soha/diagnostic-report-data";
import type {
  SatSkillImpact,
  SatGapBridgeSegment,
  SatQuestionSection,
  SatAccuracySection,
} from "@/lib/data-viz/sat-types";

function parsePts(pts: string): number {
  const m = pts.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

export function sohaRankedSkills(limit = 7): SatSkillImpact[] {
  const merged = [
    ...RW_PRIORITY.map((r) => ({ name: r.topic, points: parsePts(r.pts) })),
    ...MATH_PRIORITY.map((r) => ({ name: r.topic, points: parsePts(r.pts) })),
  ]
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);

  return merged.map((s, i) => ({
    id: `skill-${i + 1}`,
    name: s.name,
    points: s.points,
  }));
}

export function sohaGapBridgeSegments(
  skills: SatSkillImpact[],
  current: number,
  target: number
): SatGapBridgeSegment[] {
  const gap = target - current;
  const top = skills.slice(0, 5);
  const rawSum = top.reduce((a, s) => a + s.points, 0);
  const scale = rawSum > gap ? gap / rawSum : 1;

  return top.map((s) => ({
    id: s.id,
    label: s.name,
    points: Math.round(s.points * scale),
  }));
}

export function sohaQuestionMap(): SatQuestionSection[] {
  const missByKey = new Map<
    string,
    { topic: string; diff: string; correct: string; marked: string }
  >();
  for (const row of [...RW_MISS_TABLE, ...MATH_MISS_TABLE]) {
    missByKey.set(`${row.mod}-${row.q}`, row);
  }

  return QUESTION_MAP.map((sec) => ({
    title: sec.title,
    modules: sec.modules.map((m: ModuleMap) => {
      const modNum = m.label.match(/Module\s+(\d+)/i)?.[1] ?? "";
      return {
        label: m.label,
        cells: m.cells.map((cell) => {
          if (!cell.miss) return cell;
          const hit = missByKey.get(`${modNum}-${cell.n}`);
          if (!hit) return cell;
          return {
            ...cell,
            topic: hit.topic,
            detail: `Marked ${hit.marked.toUpperCase()} · Correct ${hit.correct.toUpperCase()}`,
          };
        }),
      };
    }),
  }));
}

export function sohaAccuracyReadout(): SatAccuracySection[] {
  return DIFFICULTY_READOUT.map((row) => ({
    title: row.label,
    bands: [
      { label: "Easy", value: row.easy },
      { label: "Medium", value: row.medium },
      { label: "Hard", value: row.hard },
    ],
  }));
}
