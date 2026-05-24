/**
 * Pain map + verbatim quotes — brand/02_customer_voice.md (6,567 items).
 * Keep in sync when the customer voice artifact updates.
 */
export type PainRanking = {
  rank: number;
  id: string;
  label: string;
  mentions: number;
};

/** Top 7 pains from the pain map, ranked by mention frequency */
export const painRankings: readonly PainRanking[] = [
  { rank: 1, id: "outdated", label: "It's already outdated", mentions: 1704 },
  { rank: 2, id: "falling-behind", label: "I feel like I'm falling behind", mentions: 617 },
  { rank: 3, id: "paying-nothing", label: "I keep paying and getting nothing", mentions: 554 },
  { rank: 4, id: "on-my-own", label: "I'm on my own", mentions: 541 },
  { rank: 5, id: "where-to-start", label: "I don't know where to start", mentions: 370 },
  { rank: 6, id: "dont-trust", label: "I don't trust the people selling this", mentions: 359 },
  { rank: 7, id: "too-generic", label: "It's too generic for my situation", mentions: 332 }
] as const;

const maxPainMentions = painRankings[0]?.mentions ?? 1;

export function painRankBarPercent(mentions: number): number {
  return Math.round((mentions / maxPainMentions) * 100);
}

export type PainVoiceQuote = {
  id: string;
  theme: string;
  frequency: string;
  text: string;
  source: string;
  url: string;
};

export const painVoiceQuotes: readonly PainVoiceQuote[] = [
  {
    id: "outdated",
    theme: "It's already outdated",
    frequency: "1,704 mentions",
    text: "I work for an organization that is absolutely convinced that 'rolling out AI' is going to be some great boost to productivity. So far, all I've seen is the production of useless documents at a faster rate.",
    source: "r/jobs",
    url: "https://www.reddit.com/r/jobs/comments/1o3zvst/why_is_everyone_insisting_on_knowing_how_to_use_ai/"
  },
  {
    id: "falling-behind",
    theme: "I feel like I'm falling behind",
    frequency: "617 mentions",
    text: "Everybody uses it, but nobody talks about it.",
    source: "r/PhdProductivity",
    url: "https://www.reddit.com/r/PhdProductivity/comments/1s7rasg/i_was_hired_by_my_university_to_figure_out_how/"
  },
  {
    id: "paying-nothing",
    theme: "I keep paying and getting nothing",
    frequency: "554 mentions",
    text: "Sourcing with AI is absolutely pointless. You'll waste more time reviewing people who don't match than you'd spend doing sourcing the regular way.",
    source: "r/recruiting",
    url: "https://www.reddit.com/r/recruiting/comments/1szf5xv/how_are_you_guys_actually_using_ai_to_help_do/"
  },
  {
    id: "on-my-own",
    theme: "I'm on my own",
    frequency: "541 mentions",
    text: "Your management should have some sort of workshop for this tbh. It's very hard when you are stuck with an archaic ATS system as well.",
    source: "r/recruiting",
    url: "https://www.reddit.com/r/recruiting/comments/1szf5xv/how_are_you_guys_actually_using_ai_to_help_do/"
  },
  {
    id: "where-to-start",
    theme: "I don't know where to start",
    frequency: "370 mentions",
    text: "Feels like every month there's a new top 20 AI tools for marketers list and googling top AI tools for marketers just gives you the same SEO fluff stuff!!!",
    source: "r/DigitalMarketing",
    url: "https://www.reddit.com/r/DigitalMarketing/comments/1sx3jxt/ai_for_marketers_what_do_u_use_daily/"
  },
  {
    id: "dont-trust",
    theme: "I don't trust the people selling this",
    frequency: "359 mentions",
    text: "Almost everyone selling 'how to launch a course' is selling to people without audiences. That's the actual scam.",
    source: "r/EntrepreneurRideAlong",
    url: "https://www.reddit.com/r/EntrepreneurRideAlong/comments/1t7wzgl/im_tired_of_watching_people_get_sold_997_courses/"
  },
  {
    id: "too-generic",
    theme: "It's too generic for my situation",
    frequency: "332 mentions",
    text: "AI tools without your business context are basically useless. Using a fancy SEO tool or content generator without feeding it your actual data is no different than having a generic GPT conversation.",
    source: "r/AskMarketing",
    url: "https://www.reddit.com/r/AskMarketing/comments/1ssguw4/what_ai_tools_are_you_guys_actually_using_for/"
  },
  {
    id: "ninety-percent",
    theme: "The 90% problem",
    frequency: "260↑ on Reddit",
    text: "I generate something. It's beautiful. It works exactly the way I wanted. And then I need to share it with someone. And I just... can't.",
    source: "r/ClaudeAI",
    url: "https://www.reddit.com/r/ClaudeAI/comments/1tdjwqe/am_i_the_only_one_who_feels_like_ai_got_us_90_of/"
  },
  {
    id: "superhuman-interns",
    theme: "The last 10%",
    frequency: "Top thread comment",
    text: "We have superhuman interns that still can't hand someone a clean Google Docs link.",
    source: "r/ClaudeAI",
    url: "https://www.reddit.com/r/ClaudeAI/comments/1tdjwqe/am_i_the_only_one_who_feels_like_ai_got_us_90_of/"
  },
  {
    id: "wrong-starting-point",
    theme: "Wrong starting point",
    frequency: "Hope map signal",
    text: "The tools question is actually the wrong starting point. The ones that actually stick are the ones that slot into something you're already doing, not the ones with the longest feature list.",
    source: "r/AskMarketing",
    url: "https://www.reddit.com/r/AskMarketing/comments/1ssguw4/what_ai_tools_are_you_guys_actually_using_for/"
  }
] as const;
