export type Int8SelfStudyFailCopy = {
  headline: string;
  intro: string;
  effortItems: string[];
  paragraphs: string[];
  graphicAriaLabel: string;
};

export function buildInt8SelfStudyFailCopy(): Int8SelfStudyFailCopy {
  return {
    headline: "Why self-study often stops working after a certain point",
    intro: "Most students we work with already studied hard.",
    effortItems: [
      "They watched YouTube videos.",
      "Used Bluebook.",
      "Did practice tests.",
      "Used Khan Academy."
    ],
    paragraphs: [
      "But self-study rarely identifies the exact mistakes keeping scores stuck.",
      "Students often spend hours reviewing topics they already understand while avoiding the weaknesses actually costing the most points."
    ],
    graphicAriaLabel:
      "Messy self-study dashboard with practice tests, random videos, scattered SAT topics, and a long checklist. An overwhelmed student sits in the middle. Overlay: more studying does not equal targeted improvement. Bottom line: lots of effort, little score movement."
  };
}
