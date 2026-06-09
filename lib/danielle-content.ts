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
  "radicals-slides": {
    filename: "radicals-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "quadratics-slides": {
    filename: "quadratics-slides.html",
    contentType: "text/html; charset=utf-8"
  },
  "quadratics-practice": {
    filename: "quadratics-practice-deck.html",
    contentType: "text/html; charset=utf-8"
  }
} as const;

export type DanielleFileSlug = keyof typeof DANIELLE_FILE_MAP;

export function readDanielleFile(slug: DanielleFileSlug) {
  const entry = DANIELLE_FILE_MAP[slug];
  const filePath = resolve(CONTENT_DIR, entry.filename);
  const buffer = readFileSync(filePath);
  return { buffer, contentType: entry.contentType, filename: entry.filename };
}

export function readDaniellePlanHtml() {
  const filePath = resolve(CONTENT_DIR, "plan.html");
  const html = readFileSync(filePath, "utf8");

  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    styles: styleMatch?.[1]?.trim() ?? "",
    bodyHtml: bodyMatch?.[1]?.trim() ?? html
  };
}
