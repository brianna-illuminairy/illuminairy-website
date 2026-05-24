import {
  painRankings,
  painVoiceQuotes,
  type PainRanking
} from "@/lib/pain-voice-quotes";

export type PainGainGain = {
  gainHeadline: string;
  gainText: string;
};

/** After-side copy — edit in Brianna's voice; paired to pain map by id */
export const painGainGains: Record<string, PainGainGain> = {
  outdated: {
    gainHeadline: "Playbooks that stay current",
    gainText:
      "Your path updates from live sessions and what's working now — not a course recorded six months ago."
  },
  "falling-behind": {
    gainHeadline: "You're not the only one — and you're not late",
    gainText:
      "Everybody's using it; Illuminairy shows you how, in your lane, with someone who's one step ahead."
  },
  "paying-nothing": {
    gainHeadline: "Pay for outcomes, not content",
    gainText:
      "No more $997 courses that teach theory. You work toward a result you can point to in your business or job."
  },
  "on-my-own": {
    gainHeadline: "A mentor who's already done it",
    gainText:
      "Matched with a near-peer who shipped your outcome in your context — live 1:1, not a forum post."
  },
  "where-to-start": {
    gainHeadline: "A plan for Monday morning",
    gainText:
      "Milestones built for your goal — what to do next, not another listicle of 20 tools."
  },
  "dont-trust": {
    gainHeadline: "Practitioners, not gurus",
    gainText:
      "Real people with real results in your vertical. No audience-building course disguised as AI help."
  },
  "too-generic": {
    gainHeadline: "Your vertical × your outcome × your model",
    gainText:
      "Restaurant, dental, sales, marketing — the playbook fits how you actually work, not a generic GPT chat."
  }
};

export type PainGainPair = PainRanking & {
  painQuote: string;
  painSource: string;
  painUrl: string;
  frequency: string;
  gainHeadline: string;
  gainText: string;
};

export function getPainGainPairs(): PainGainPair[] {
  return painRankings.map((ranking) => {
    const quote = painVoiceQuotes.find((q) => q.id === ranking.id);
    const gain = painGainGains[ranking.id];
    if (!quote || !gain) {
      throw new Error(`Missing pain/gain pair for id: ${ranking.id}`);
    }
    return {
      ...ranking,
      label: ranking.label,
      painQuote: quote.text,
      painSource: quote.source,
      painUrl: quote.url,
      frequency: quote.frequency,
      gainHeadline: gain.gainHeadline,
      gainText: gain.gainText
    };
  });
}
