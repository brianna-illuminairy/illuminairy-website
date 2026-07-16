import { readFileSync } from "fs";
import { resolve } from "path";

const CONTENT_DIR = resolve(process.cwd(), "content/skye");

export const SKYE_FILE_MAP = {
  full: {
    filename: "diagnostic-full.pdf",
    contentType: "application/pdf"
  },
  tabular: {
    filename: "diagnostic-tabular.pdf",
    contentType: "application/pdf"
  },
  "quadratics-lesson": {
    filename: "quadratics-lesson.html",
    contentType: "text/html; charset=utf-8"
  },
  "triangles-lesson-1": {
    filename: "triangles-lesson-1.html",
    contentType: "text/html; charset=utf-8"
  }
} as const;

export type SkyeFileSlug = keyof typeof SKYE_FILE_MAP;

export function readSkyeFile(slug: SkyeFileSlug) {
  const entry = SKYE_FILE_MAP[slug];
  const filePath = resolve(CONTENT_DIR, entry.filename);
  const buffer = readFileSync(filePath);
  return { buffer, contentType: entry.contentType, filename: entry.filename };
}

export const SKYE_WEEKLY_REPORT_MAP = {
  "week-1": "weekly-report-week-1.html"
} as const;

export type SkyeWeeklyReportWeek = keyof typeof SKYE_WEEKLY_REPORT_MAP;

function readSkyeHtmlDocument(filename: string) {
  const filePath = resolve(CONTENT_DIR, filename);
  const html = readFileSync(filePath, "utf8");

  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    styles: styleMatch?.[1]?.trim() ?? "",
    bodyHtml: bodyMatch?.[1]?.trim() ?? html
  };
}

export function readSkyeWeeklyReportHtml(week: SkyeWeeklyReportWeek) {
  const filename = SKYE_WEEKLY_REPORT_MAP[week];
  return readSkyeHtmlDocument(filename);
}
