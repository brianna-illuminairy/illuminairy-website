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
      "Used Bluebook.",
      "Used Khan Academy.",
      "Did Practice Tests.",
      "Watched YouTube."
    ],
    paragraphs: [
      "But students who self-study struggle to identify what material to focus on to improve their score.",
      "And more practice problems for content you don't understand doesn't close that gap."
    ],
    graphicAriaLabel:
      "Messy self-study dashboard with practice tests, random videos, scattered SAT topics, and a long checklist. An overwhelmed student sits in the middle. Overlay: more studying does not equal targeted improvement. Bottom line: lots of effort, little score movement."
  };
}
