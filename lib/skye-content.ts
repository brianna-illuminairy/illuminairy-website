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
  }
} as const;

export type SkyeFileSlug = keyof typeof SKYE_FILE_MAP;

export function readSkyeFile(slug: SkyeFileSlug) {
  const entry = SKYE_FILE_MAP[slug];
  const filePath = resolve(CONTENT_DIR, entry.filename);
  const buffer = readFileSync(filePath);
  return { buffer, contentType: entry.contentType, filename: entry.filename };
}
