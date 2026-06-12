/**
 * Tiered identity matching for Meet participants vs the expected invitee on
 * a Strategy Call. Used by `meet-attendance` cron to decide whether the parent
 * actually showed up.
 *
 * Tiers (highest first):
 *   1. `exact_email`           — signed-in participant whose email matches
 *                                 the lead's parent_email. Confidence 1.0.
 *   2. `display_name`          — anonymous/external participant whose display
 *                                 name contains both the parent's first AND
 *                                 last name tokens (case-insensitive,
 *                                 diacritics-stripped). Confidence 0.9 (both)
 *                                 or 0.65 (first only).
 *   3. `ambiguous`             — at least one participant joined but no
 *                                 confident match. Confidence 0.5.
 *   4. `no_participants`       — participants list is empty and the scheduled
 *                                 end was at least 5 minutes ago. Treat as
 *                                 confident no-show. Confidence 0.95.
 *
 * The caller decides what to do with each tier:
 *   - exact_email or display_name (both)  -> mark attended (confidence >= 0.9)
 *   - no_participants                     -> mark no_show (confidence >= 0.9)
 *   - display_name (first only)           -> create confirm task, keep booked
 *   - ambiguous                           -> create confirm task, keep booked
 */

import {
  participantIdentity,
  type MeetParticipant
} from "@/lib/integrations/google/meet";

export type IdentityTier =
  | "exact_email"
  | "display_name"
  | "ambiguous"
  | "no_participants";

export type IdentityMatchResult = {
  tier: IdentityTier;
  confidence: number;
  attended: boolean;
  matchedParticipant?: { displayName: string; kind: "signedin" | "anonymous" | "phone" };
  notes: string;
};

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalize(s)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

export function matchInviteeToParticipants(args: {
  parentEmail: string;
  parentFirst?: string | null;
  parentLast?: string | null;
  ownerEmail: string;
  participants: MeetParticipant[];
  scheduledEndAt?: Date | null;
  now?: Date;
}): IdentityMatchResult {
  const now = args.now ?? new Date();
  const parentEmail = args.parentEmail.trim().toLowerCase();
  const ownerEmail = args.ownerEmail.trim().toLowerCase();

  // Filter out the owner — Brianna's signed-in attendance doesn't prove the
  // parent joined. (We DO use it as a "call happened" signal though.)
  const nonOwner = args.participants.filter((p) => {
    if (!p.signedinUser) return true;
    const dn = (p.signedinUser.displayName ?? "").toLowerCase();
    // Best-effort owner detection by display name + email local-part. The Meet
    // API does not return the email of signed-in non-domain participants.
    const ownerLocal = ownerEmail.split("@")[0];
    return !(dn && (dn.includes(ownerLocal) || dn.includes("brianna")));
  });

  if (nonOwner.length === 0) {
    if (args.scheduledEndAt && now.getTime() - args.scheduledEndAt.getTime() >= 5 * 60_000) {
      return {
        tier: "no_participants",
        confidence: 0.95,
        attended: false,
        notes: "No non-owner participants joined the Meet."
      };
    }
    return {
      tier: "ambiguous",
      confidence: 0.5,
      attended: false,
      notes: "No non-owner participants yet, but it's too early to call no-show."
    };
  }

  // Tier 1: exact email match (signed-in domain user). Rare for external
  // parents, but possible if they signed in with their gmail and the API
  // returned their email. We don't have email directly here, so we can only
  // do this when the parent_email matches the participant's user resource —
  // currently unavailable. Skip for now.

  // Tier 2: display-name token match.
  const firstTokens = tokens(args.parentFirst ?? "");
  const lastTokens = tokens(args.parentLast ?? "");
  const wantedSeen: Record<string, boolean> = {};
  const wanted: string[] = [];
  for (const t of [...firstTokens, ...lastTokens]) {
    if (!wantedSeen[t]) {
      wantedSeen[t] = true;
      wanted.push(t);
    }
  }

  let bestTokensMatched = 0;
  let bestParticipant: { displayName: string; kind: "signedin" | "anonymous" | "phone" } | null =
    null;

  for (const p of nonOwner) {
    const id = participantIdentity(p);
    if (!id.displayName) continue;
    const dnTokens = new Set(tokens(id.displayName));
    let matches = 0;
    for (const w of wanted) {
      if (dnTokens.has(w)) matches += 1;
    }
    if (matches > bestTokensMatched) {
      bestTokensMatched = matches;
      bestParticipant = { displayName: id.displayName, kind: id.kind };
    }
  }

  if (bestParticipant && bestTokensMatched >= 2) {
    return {
      tier: "display_name",
      confidence: 0.9,
      attended: true,
      matchedParticipant: bestParticipant,
      notes: `Matched display name "${bestParticipant.displayName}" to first+last tokens.`
    };
  }

  if (bestParticipant && bestTokensMatched === 1) {
    return {
      tier: "display_name",
      confidence: 0.65,
      attended: true,
      matchedParticipant: bestParticipant,
      notes: `Matched display name "${bestParticipant.displayName}" on a single token only — needs owner confirm.`
    };
  }

  return {
    tier: "ambiguous",
    confidence: 0.5,
    attended: true,
    notes: `${nonOwner.length} participant(s) joined, but none matched the parent's name confidently.`
  };
}

/**
 * Convenience: should the cron auto-apply the decision without owner review?
 * True when confidence is at least 0.9 in either direction.
 */
export function shouldAutoApply(result: IdentityMatchResult): boolean {
  return result.confidence >= 0.9;
}

export { normalize as normalizeIdentityString, tokens as identityTokens };
