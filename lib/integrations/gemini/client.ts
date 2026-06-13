/**
 * Gemini Flash API wrapper for call-intelligence extraction.
 *
 * Uses the v1beta `generateContent` endpoint with `response_mime_type =
 * application/json` + a JSON schema for structured output. Owner-only;
 * authenticated by `GEMINI_API_KEY`.
 *
 * Model: defaults to `gemini-flash-latest` (Google's recommended rolling
 * alias that always points at the latest Flash GA model). The 1.5 line was
 * deprecated September 2025 and now returns 404. Override with `GEMINI_MODEL`
 * env var if a specific snapshot is needed (e.g. `gemini-2.5-flash`).
 *
 * NOTE: Google has been migrating Gemini auth from `AIzaSy...` to `AQ.` keys
 * in 2026; both work against this endpoint via the `key=` query param. The
 * AI Studio free tier is on `aistudio.google.com` keys; GCP project keys
 * require billing to access the 2.x line.
 */

const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest";
const BASE = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export type GeminiContentPart = { text: string };
export type GeminiContent = { role: "user" | "model"; parts: GeminiContentPart[] };

export type GeminiCallArgs = {
  prompt: string;
  systemInstruction?: string;
  schema?: Record<string, unknown>;
  temperature?: number;
  maxOutputTokens?: number;
};

export type GeminiCallResult<T> = {
  raw: string;
  json: T;
};

export async function callGeminiText(args: Omit<GeminiCallArgs, "schema">): Promise<string> {
  const result = await callGeminiRaw({ ...args });
  return result;
}

async function callGeminiRaw(args: GeminiCallArgs): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: args.prompt }]
      }
    ],
    generationConfig: {
      temperature: args.temperature ?? 0.2,
      maxOutputTokens: args.maxOutputTokens ?? 4096,
      ...(args.schema
        ? {
            responseMimeType: "application/json",
            responseSchema: args.schema
          }
        : {})
    }
  };
  if (args.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: args.systemInstruction }]
    };
  }

  const res = await fetch(`${BASE}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${detail.slice(0, 600)}`);
  }

  const payload = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}

export async function callGemini<T>(args: GeminiCallArgs): Promise<GeminiCallResult<T>> {
  const text = await callGeminiRaw(args);
  let json: T;
  try {
    json = JSON.parse(text) as T;
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`);
  }
  return { raw: text, json };
}
