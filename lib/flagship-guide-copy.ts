import type { FlagshipSchoolId } from "@/lib/georgia-flagship-scores";

export type FlagshipGuideCopy = {
  title: string;
  subtitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  scoresHeading: string;
  worksheetHeading: string;
  worksheetIntro: string;
  compareHeading: string;
  compareBody: string;
  summerHeading: string;
};

export const flagshipGuideCopy: Record<FlagshipSchoolId, FlagshipGuideCopy> = {
  uga: {
    title: "UGA SAT score and GPA — what admitted students submitted",
    subtitle: "Free download · worksheet included",
    description:
      "Most families start with a search like “SAT for UGA with a 3.8 GPA” — not a cutoff chart. Cited middle-50% SAT data, how GPA and rigor change what the score has to do, a two-minute worksheet, and August priorities.",
    seoTitle: "UGA SAT Score and GPA | Admitted Student Ranges",
    seoDescription:
      "UGA SAT score and GPA context for Georgia families — middle-50% ranges for recent admits, rigor notes, and a worksheet to compare your numbers. Cited data, Illuminairy.",
    lead:
      "There is no published “minimum SAT for UGA with a 3.9 GPA.” Admissions looks at grades, course rigor, activities, and the essay — then uses test scores as one more signal. This guide gives you the SAT range recent UGA admits submitted, plus how to read GPA and rigor together so you are not guessing from a single Reddit thread.",
    scoresHeading: "SAT scores UGA reported for recent admits (middle 50%)",
    worksheetHeading: "SAT and GPA — write your numbers down",
    worksheetIntro:
      "If you already searched “SAT for UGA with a 3.8 GPA,” fill this in once and compare to the table above.",
    compareHeading: "How to read SAT and GPA together (not a cutoff chart)",
    compareBody:
      "A strong Georgia GPA with AP/IB rigor can help when the SAT is slightly below the middle of the range — but it does not replace a score far under the 25th percentile. A high SAT with weak grades or easy coursework rarely carries the file at UGA. In-state with roughly a 3.7–4.0 weighted GPA and rigor, many competitive files land near or above the 50th percentile SAT in the table — still not a promise of admission.",
    summerHeading: "If the August SAT is the redo — what to prioritize"
  },
  "georgia-tech": {
    title: "Georgia Tech SAT score and GPA — what admitted students submitted",
    subtitle: "Free download · Math + GPA notes",
    description:
      "Searches like “Georgia Tech SAT with 4.0 GPA” or “Tech Math SAT” are common. Cited ranges for recent admits, why Math matters, a worksheet for your numbers, and summer focus before August.",
    seoTitle: "Georgia Tech SAT Score and GPA | Admitted Student Ranges",
    seoDescription:
      "Georgia Tech SAT score and GPA — middle-50% totals, Math context, and a worksheet for Georgia families. Cited ranges, Illuminairy.",
    lead:
      "Families often search “SAT for Georgia Tech with a 4.0” or “what Math score for Tech.” Tech cares about preparation for engineering-level work — that usually shows up in Math SAT, transcript rigor (calc ready), and the total score. Below is the middle 50% for admitted students who submitted SATs, with notes on Math.",
    scoresHeading: "SAT scores Georgia Tech reported for recent admits (middle 50%)",
    worksheetHeading: "SAT (total and Math) and GPA — your numbers",
    worksheetIntro:
      "Write the real scores — not what you hope they are. Tech families usually care about Math as much as the total.",
    compareHeading: "GPA, rigor, and Math — how Tech reads the file",
    compareBody:
      "A 4.0 without calculus or strong Math on the SAT still raises questions for many Tech majors. A slightly softer GPA with a high Math SAT and heavy STEM coursework can still be competitive depending on major — admissions decides holistically. Use the ranges as context for how your SAT compares to other submitters, not as a line in the sand.",
    summerHeading: "Summer before August — Tech-focused priorities"
  },
  emory: {
    title: "Emory SAT score and GPA — if you submit scores",
    subtitle: "Free download · test-optional",
    description:
      "“Emory SAT with 3.9 GPA” and “Emory test optional SAT” are the usual searches. Cited ranges for students who submitted, how GPA fits, a send-or-skip worksheet, and when spending the summer raising the score is worth it.",
    seoTitle: "Emory SAT Score and GPA | Test-Optional Guide",
    seoDescription:
      "Emory SAT score and GPA for families deciding whether to submit — submitter ranges, GPA context, and a worksheet. Cited data, Illuminairy.",
    lead:
      "Many families search “Emory SAT with 3.9 GPA” or “do I need SAT for Emory test optional.” Emory does not require scores for every applicant — but students who submit often cluster at the high end. This guide is for deciding whether to send, and what the submitted-score pool looks like.",
    scoresHeading: "SAT scores Emory reported for students who submitted (middle 50%)",
    worksheetHeading: "Send scores or go test-optional? Start with your numbers",
    worksheetIntro:
      "Emory is test-optional. These ranges describe students who chose to submit — not everyone who enrolled.",
    compareHeading: "GPA, rigor, and whether to hit Submit on scores",
    compareBody:
      "Strong GPA and rigor with a score below the 25th percentile — many families apply test-optional and lean on the rest of the application. Score near or above the 50th with a competitive GPA — submitting often helps. Score in the 75th range — submitting is usually straightforward if the rest of the file is ready. None of this guarantees admission; it helps you decide whether the score helps or hurts.",
    summerHeading: "If you are raising the score before you apply"
  }
};
