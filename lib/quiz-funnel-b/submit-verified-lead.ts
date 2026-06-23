import type { QuizAnswers } from "@/app/quiz-b/state";
import { getClientAttributionPayload } from "@/lib/quiz-funnel/client-attribution";
import { readPersistedLpVariant, readPersistedLpVariantId } from "@/lib/landing/variant-storage";
import { resolveMetaClickIds } from "@/lib/meta-click-ids";
import { captureQuizLeadSubmitted } from "@/lib/quiz-funnel-b/analytics";
import { parseFunnelApiError } from "@/lib/quiz-funnel/booking-feedback";

export async function submitVerifiedLabLead(
  answers: QuizAnswers,
  phoneVerifiedAt: string
): Promise<{ ok: true; eventId?: string; leadId?: string } | { ok: false; message?: string }> {
  const { visitorId, attribution } = getClientAttributionPayload();
  const resolved = resolveMetaClickIds(attribution.fbclid);

  const res = await fetch("/api/funnel-b/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...answers,
      phoneVerifiedAt,
      conversion: true,
      visitorId,
      attribution,
      fbp: resolved.fbp ?? attribution.fbp,
      fbc: resolved.fbc ?? attribution.fbc,
      fbcTs: resolved.fbcTs,
      sat_lp_variant: readPersistedLpVariant(),
      lp_variant: readPersistedLpVariantId(),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const parsed = parseFunnelApiError(data as Record<string, unknown>, res.status);
    return { ok: false, message: parsed.message };
  }

  const eventId = typeof data.eventId === "string" ? data.eventId : undefined;
  captureQuizLeadSubmitted(answers as Record<string, unknown>, eventId);

  return {
    ok: true,
    eventId,
    leadId: typeof data.leadId === "string" ? data.leadId : undefined,
  };
}
