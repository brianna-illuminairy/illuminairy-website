import { readFileSync } from "fs";
import { resolve } from "path";

const CONTENT_DIR = resolve(process.cwd(), "content/soha");

export const SOHA_FILE_MAP = {
  full: {
    filename: "diagnostic-full.pdf",
    contentType: "application/pdf"
  },
  tabular: {
    filename: "diagnostic-tabular.pdf",
    contentType: "application/pdf"
  },
  "transitions-lesson": {
    filename: "transitions-lesson-slides.html",
    contentType: "text/html; charset=utf-8"
  }
} as const;

export type SohaFileSlug = keyof typeof SOHA_FILE_MAP;

export function readSohaFile(slug: SohaFileSlug) {
  const entry = SOHA_FILE_MAP[slug];
  const filePath = resolve(CONTENT_DIR, entry.filename);
  const buffer = readFileSync(filePath);
  return { buffer, contentType: entry.contentType, filename: entry.filename };
}

const SOHA_PLAN_SCHEDULE_MARKER = "<!-- SOHA_PLAN_SCHEDULE -->";

export function readSohaPlanHtml() {
  return readSohaHtmlDocument("plan.html");
}

export function readSohaPlanHtmlParts() {
  const { styles, bodyHtml } = readSohaPlanHtml();
  const markerIndex = bodyHtml.indexOf(SOHA_PLAN_SCHEDULE_MARKER);
  if (markerIndex === -1) {
    return { styles, overviewHtml: bodyHtml, tailHtml: "" };
  }
  return {
    styles,
    overviewHtml: bodyHtml.slice(0, markerIndex).trim(),
    tailHtml: bodyHtml.slice(markerIndex + SOHA_PLAN_SCHEDULE_MARKER.length).trim(),
  };
}

function readSohaHtmlDocument(filename: string) {
  const filePath = resolve(CONTENT_DIR, filename);
  const html = readFileSync(filePath, "utf8");

  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    styles: styleMatch?.[1]?.trim() ?? "",
    bodyHtml: bodyMatch?.[1]?.trim() ?? html
  };
}
