import type { AttributionSnapshot } from "@/lib/attribution";
import type { QualificationIntakePayload } from "@/lib/sat-qualification";

export type TouchEventInput = {
  visitor_id?: string;
  lead_id?: string;
  client_id?: string;
  enrollment_id?: string;
  event_type: string;
  path?: string;
  full_url?: string;
  referrer?: string;
  attribution?: AttributionSnapshot;
  payload?: Record<string, unknown>;
  source?: "client" | "server" | "webhook";
};

export type IntakeWithAttribution = QualificationIntakePayload & {
  visitorId?: string;
  attribution?: AttributionSnapshot;
  confirmBudgetGap?: boolean;
};

export type LeadRow = {
  id: string;
  parent_email: string;
  stage: string;
  lead_source: string;
  parent_first: string | null;
  parent_last: string | null;
  created_at: string;
};
