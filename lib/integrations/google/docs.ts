/**
 * Google Docs API v1 wrapper. Reads a doc's body text by walking the
 * `documents.get` payload structuralElements.
 */

import { googleFetchJson } from "@/lib/integrations/google/client";

const BASE = "https://docs.googleapis.com/v1";

type DocsTextRun = {
  content?: string;
};

type DocsParagraphElement = {
  textRun?: DocsTextRun;
};

type DocsParagraph = {
  elements?: DocsParagraphElement[];
};

type DocsStructuralElement = {
  paragraph?: DocsParagraph;
  // tables / sectionBreaks etc — ignored for plain-text extraction
};

type DocsDocument = {
  body?: {
    content?: DocsStructuralElement[];
  };
};

export async function getDocPlainText(args: {
  ownerEmail: string;
  documentId: string;
}): Promise<string> {
  const doc = await googleFetchJson<DocsDocument>(
    `${BASE}/documents/${encodeURIComponent(args.documentId)}`,
    { ownerEmail: args.ownerEmail }
  );
  const out: string[] = [];
  for (const el of doc.body?.content ?? []) {
    if (!el.paragraph) continue;
    for (const pe of el.paragraph.elements ?? []) {
      if (pe.textRun?.content) out.push(pe.textRun.content);
    }
  }
  return out.join("").trim();
}
