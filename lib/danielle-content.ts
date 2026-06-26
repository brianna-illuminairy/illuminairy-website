import { readFileSync } from "fs";
import { resolve } from "path";

const CONTENT_DIR = resolve(process.cwd(), "content/danielle");

export const DANIELLE_FILE_MAP = {
  full: {
    filename: "diagnostic-full.pdf",
    contentType: "application/pdf"
  },
  tabular: {
    filename: "diagnostic-tabular.pdf",
    contentType: "application/pdf"
  },
  "nonlinear-slides": {
    filename: "nonlinear-equations-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "factoring-slides": {
    filename: "factoring-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "lesson-2-slides": {
    filename: "lesson-2-factoring-quadratics-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "radicals-slides": {
    filename: "radicals-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "transitions-lesson": {
    filename: "transitions-lesson-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "transitions-lesson-02": {
    filename: "transitions-lesson-02-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "weekly-report-week-1": {
    filename: "weekly-report-week-1.html",
    contentType: "text/html; charset=utf-8"
  },
  "weekly-report-week-2": {
    filename: "weekly-report-week-2.html",
    contentType: "text/html; charset=utf-8"
  },
  "equivalent-expressions-slides": {
    filename: "equivalent-expressions-slides.html",
    contentType: "text/html; charset=utf-8"
  }
} as const;

export type DanielleWeeklyReportWeek = "week-1" | "week-2";

const WEEKLY_REPORT_FILES: Record<DanielleWeeklyReportWeek, string> = {
  "week-1": "weekly-report-week-1.html",
  "week-2": "weekly-report-week-2.html"
};

export type DanielleFileSlug = keyof typeof DANIELLE_FILE_MAP;

export function readDanielleFile(slug: DanielleFileSlug) {
  const entry = DANIELLE_FILE_MAP[slug];
  const filePath = resolve(CONTENT_DIR, entry.filename);
  const buffer = readFileSync(filePath);
  return { buffer, contentType: entry.contentType, filename: entry.filename };
}

export function readDaniellePlanHtml() {
  return readDanielleHtmlDocument("plan.html");
}

export function readDanielleWeeklyReportHtml(week: DanielleWeeklyReportWeek) {
  const filename = WEEKLY_REPORT_FILES[week];
  return readDanielleHtmlDocument(filename);
}

function readDanielleHtmlDocument(filename: string) {
  const filePath = resolve(CONTENT_DIR, filename);
  const html = readFileSync(filePath, "utf8");

  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    styles: styleMatch?.[1]?.trim() ?? "",
    bodyHtml: bodyMatch?.[1]?.trim() ?? html
  };
}
