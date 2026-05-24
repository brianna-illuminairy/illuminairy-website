export type MentorshipPair = {
  id: string;
  mentor: string;
  mentee: string;
  detail: string;
};

export const famousMentorshipPairs: MentorshipPair[] = [
  {
    id: "emerson-thoreau",
    mentor: "Ralph Waldo Emerson",
    mentee: "Henry David Thoreau",
    detail: "Emerson mentored Thoreau and pushed his early writing — Walden followed."
  },
  {
    id: "jobs-zuckerberg",
    mentor: "Steve Jobs",
    mentee: "Mark Zuckerberg",
    detail: "Jobs advised Zuckerberg early on vision, focus, and company culture."
  },
  {
    id: "mays-mlk",
    mentor: "Benjamin E. Mays",
    mentee: "Martin Luther King Jr.",
    detail: "Mays shaped MLK's philosophy as president of Morehouse College."
  }
];

export const mentorshipRevealCopy = {
  question: "What do they all have in common?",
  answer:
    "A one-on-one bond with someone a step ahead — there to help illuminate the path.",
  bridge: "That is the same advantage behind the biggest SAT score gains."
} as const;
