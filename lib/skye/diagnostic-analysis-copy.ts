/** Full mentor narrative from Skye Diagnostic.md — visuals wrap this, not replace it. */

export type MissBullet = { q: string; text: string };

export type RwSkillBlock = {
  rank: number;
  title: string;
  lead: string;
  misses: MissBullet[];
  body: string[];
};

export type MathWalkthroughRow = {
  question: string;
  how: string;
  desmos: string;
  formula: string;
  marked: string;
};

export const SKYE_DIAG_LEDE =
  "Full-length diagnostic, June 18, 2026. All four modules complete. This report works through every question she missed, what it shows, and what she needs to focus on.";

export const SKYE_ADAPTIVE_INTRO = [
  "The Digital SAT is adaptive, which means the second module either becomes easier or harder based on your performance in the first module for each section. The goal is to ensure you get enough correct during the first module that you get the harder version of the second module. If you do not meet the cutoff, and end up with the easy module, you have effectively capped the max score you can achieve on the SAT, since easy questions are worth less points than hard questions. The cutoff is about 18 correct out of 27 questions in Reading and Writing Module 1, and for math it is 13 or 14 out of 22. There is some nuance here, in that it also matters if the questions you got incorrect were easy, medium or hard.",
];

export const SKYE_ADAPTIVE_RW =
  "Skye answered 14 out of 27 (51.2%) questions accurately on the Reading and Writing Module 1, missing the cutoff by about 4 questions. So her Reading and Writing Module 2 was composed of more easy and medium questions and less hard questions. That means even if she did perfect on module two her max score would be capped at roughly 600–650 for the Reading and Writing section. Our first goal would be to figure out the easiest 4 mistakes she made in module 1 of Reading and Writing and correct them.";

export const SKYE_ADAPTIVE_MATH =
  "Skye answered 11 out of 22 (50.0%) questions accurately on the Math Module 1, missing the cutoff to receive the hard module 2 by 2 to 3 questions. Because of this she only received 1 hard question for Math Module 2.";

export const SKYE_RW_INTRO_LEAD =
  "Across both modules, most of her Reading and Writing misses come from one habit: she does not pin down what the question is asking before she picks, so she goes with the choice that sounds related to the passage. It shows up three ways:";

export const SKYE_RW_INTRO_BULLETS = [
  "She does not identify the logical relationship between two pieces of written content before trying the answer. On transitions she picks a connector that does not match the relationship between both statements. On the passage questions she picks the choice that echoes the passage's words or one detail instead of the one that matches the exact logic, structure, or main idea.",
  "On vocabulary she does not predict the word from the sentence. She picks one that fits the topic or sounds right, and does not check that it fits the sentence's direction (i.e. if the sentence is overwhelmingly positive, the adjective should be too) or its grammar (if the sentence was past tense the word for that blank needs to be too).",
  "Separately she had several grammar based misses. These are very specific rules: when two complete sentences need a comma plus a conjunction versus when they require a semicolon, when an interrupting phrase needs a comma on both ends vs. just one side, and how an opening phrase has to attach to the right noun.",
];

export const SKYE_RW_SKILLS: RwSkillBlock[] = [
  {
    rank: 1,
    title: "Transitions. 4 missed, 3 in Module 1, all easy.",
    lead: "She does not work out the relationship between the two sentences before picking.",
    misses: [
      {
        q: "Q22 (Module 1)",
        text: 'The transition needed to bridge opposite effects of cortisol between the two sentences, so the answer was "In contrast." She put "Thus."',
      },
      {
        q: "Q24 (Module 1)",
        text: 'The poem seems barren, then a critic finds rich material, so the two phrases are in contrast with one another. The current term for a contrasting transition phrase is "Nonetheless." She put "In turn."',
      },
      {
        q: "Q23 (Module 1)",
        text: 'Examples that confirm a point; she should have answered "Indeed" since it is an affirmative transition word. She put "Consequently," which is a cause and effect transition word.',
      },
      {
        q: "Q24 (Module 2)",
        text: 'The drama club is one more activity alongside her writing activities, so she should have looked for a transition which represented an addition. The correct answer was "Furthermore." She put "Nonetheless," which is a contrasting transition word.',
      },
    ],
    body: [
      "Transitions follow a framework and can be taught and learned with time. First you have to understand the categories of transitions that exist. Then you have to understand which ones do and do not appear on the SAT. Then you have to memorize all SAT transition words assigned to each category. Then finally practice it repeatedly until you are at the desired accuracy (100% on easy, 95% on medium, and 90% on hard).",
      "Teach it in three steps:",
      "1. Learn the transition types. Five cover almost every question: addition (the second sentence adds a similar point), contrast (it pushes against the first), cause and effect (the first leads to the second), example (the second is a specific case of the first), and emphasis or restatement (the second drives home or rewords the first).",
      '2. Memorize which words go with each type. Addition: furthermore, moreover, in addition, also, similarly, likewise. Contrast: however, nonetheless, nevertheless, in contrast, on the other hand, conversely, still, yet. Cause and effect: therefore, thus, consequently, as a result, hence, so. Example: for example, for instance, namely, specifically. Emphasis or restatement: indeed, in fact, in other words, that is. Her errors are all words filed in the wrong type, so she should drill sorting these words into the five groups until it is automatic.',
      "3. On each question, decide the relationship between the two sentences first, then pick a word from that group. Never start from the word or answer options. If any two answers are from the same category (i.e. two contrasting transition words), then they are both incorrect.",
    ],
  },
  {
    rank: 2,
    title: "Reading logic: structure, detail, main idea, and evidence. 5 missed, 3 in Module 1.",
    lead: "Each time she picked a choice built from the passage's words or one detail, not the one that matched the logic. She was looking for items to directly match the exact phrase from the paragraph, but she was not distilling the ask. The question might be asking for the main idea, or evidence to support the claim, neither of which would be directly stated in the passage itself.",
    misses: [
      {
        q: "Q6 (Module 1, function)",
        text: 'The underlined sentence says the technology to detect the waves did not exist. She chose "highlights the skepticism," which is not in the text; she added it.',
      },
      {
        q: "Q8 (Module 1, detail)",
        text: "She chose the critics' position and attached it to Sullivan, who argued the opposite.",
      },
      {
        q: "Q13 (Module 1, evidence)",
        text: 'Ferguson\'s claim is that recovery varied by country. She chose the option about "standardized" efforts and "uniform" results, the opposite of varied.',
      },
      {
        q: "Q5 (Module 2, structure)",
        text: 'The passage gives an old belief, then new research revising it. She chose "introduces differing factors but does not reconcile them," which names the surface content and misses the move.',
      },
      {
        q: "Q8 (Module 2, main idea)",
        text: 'She chose "they provide clear answers about early Christianity," which overstates one detail as being the central idea and is not what the passage says.',
      },
    ],
    body: [
      "To fix this the first thing we teach is the set of jobs a reading question can ask for, because she keeps answering the wrong job.",
      "The primary questions asked on the SAT from passages:",
      "Main idea: the point of the whole text.",
      "Detail: a specific stated fact, and which person or source said it.",
      "Function or purpose: the job a sentence does in the text, not what it says.",
      "Structure: how the text is organized, for example a claim followed by a counterpoint.",
      "Command of evidence: the choice that supports or weakens the exact claim stated.",
      "Inference: what the text leads to, used to fill a blank.",
      "Step one is to read the question and name which of these it is. Her misses are each the wrong job: on Q6 she answered what the sentence says instead of what it does, on the Module 2 main-idea question she picked one detail, on the structure question she described the content instead of the organization. Step two is to answer that job and reject any choice that does a different one, even if it repeats more words from the passage.",
    ],
  },
  {
    rank: 3,
    title: "Boundaries: 3 missed; 2 were in Module 1.",
    lead: "She struggled with boundary questions. Boundary questions test how to punctuate the point where two phrases or parts of a sentence meet. The question is whether the sentence needs no punctuation, a comma, a semicolon, a colon, or a comma plus a conjunction such as and, but, or so.",
    misses: [
      {
        q: "Q18, Module 1",
        text: 'She used a semicolon before "earning a second Nobel Prize," but that phrase is not a complete sentence. A semicolon can only join two complete sentences. This was over-punctuation.',
      },
      {
        q: "Q16, Module 2",
        text: 'Two complete sentences were joined with "and," but she left out the comma before "and." That made the sentence a run-on. This was under-punctuation.',
      },
      {
        q: "Q17, Module 1",
        text: "A descriptive phrase interrupted the sentence and needed commas on both sides. She included the first comma but missed the closing comma.",
      },
    ],
    body: [
      "She needs to learn how to identify independent and dependent clauses. An independent clause is a complete sentence. A dependent clause is not. Once she can label each side of the boundary, she can choose the correct punctuation.",
      "She should learn these rules:",
      "Identify if the two phrases are independent clauses or dependent clauses.",
      "Two complete sentences need a period, a semicolon, or a comma plus a conjunction. They should not be joined by a comma alone or by nothing.",
      "A complete sentence followed by an incomplete phrase may need a comma, no punctuation, or a colon if the first part introduces what follows.",
      "An interruption in the middle of a sentence needs a comma on both sides.",
      "She should also memorize common words that often create dependent clauses: because, although, while, since, when, if, after, and before. These words help show when a sentence part cannot stand alone.",
      "The teaching order should be: identify subjects and verbs, identify complete versus incomplete sentence parts, decide whether the two parts move in the same direction or opposite directions, then apply the punctuation rule.",
    ],
  },
  {
    rank: 4,
    title: "Words in Context: 4 missed; 2 were in Module 1.",
    lead: "She struggled with words in context questions. These questions test whether she can use the sentence around the blank to choose the word that fits both the meaning and the grammar. The goal is not just to know the word. The goal is to use the clues in the sentence before looking at the answer choices.",
    misses: [
      {
        q: "Q1, Module 1",
        text: 'The sentence was positive, so the answer was "exemplifies." She chose "impedes," which is negative. She missed the tone of the sentence.',
      },
      {
        q: "Q2, Module 1",
        text: 'The sentence said the storm was approaching, so the answer was "imminent," meaning about to happen. She chose "transient," which means temporary. She missed the clue that the storm was coming soon.',
      },
      {
        q: "Q3, Module 2",
        text: 'The device was described as a forerunner of computing, so the answer was "precursor," meaning something that comes before. She chose "relic," which means an old object. She missed that the sentence was about sequence, not just age.',
      },
      {
        q: "Q1, Module 2",
        text: 'The blank came after "the chance to," so it needed a plain verb. The answer was "criticize," meaning evaluate. She chose "involved in," which does not fit grammatically after "to." She may also have avoided "criticize" because it sounded negative, but in academic writing it can mean evaluate, not attack.',
      },
    ],
    body: [
      "She does not mainly need more vocabulary. Two of the misses were method errors. In Q1, the words \"exemplifies\" and \"impedes\" are not hard, but she missed that the sentence was positive and chose a negative word. In Q1 from Module 2, the issue was grammar because \"to\" needs a plain verb.",
      "Only \"imminent\" and \"precursor\" were mainly vocabulary misses. Even there, the sentence gave her the clue. The storm was approaching, which points to \"imminent.\" The device came before computers, which points to \"precursor.\"",
      "The order should be method first and vocabulary second.",
      "She should use this method: cover the answer choices; decide whether the blank should be positive, negative, or neutral; predict the rough meaning of the missing word; check whether the answer fits the grammar of the sentence; then choose the word that fits both meaning and grammar.",
      "For vocabulary, she should not do a large memorization push. She should learn a focused list of mid-level academic words that appear often on the SAT. She should also study words whose academic meaning differs from everyday meaning, such as criticize, qualify, sound, novel, and arrest.",
    ],
  },
  {
    rank: 5,
    title: "Rhetorical Synthesis: 3 missed; 2 were in Module 1, and 1 was left blank in Module 2.",
    lead: "She struggled with rhetorical synthesis questions. These questions test whether she can use the notes to choose the answer that matches the stated goal. The goal matters most. If the question asks for an advantage, the answer must give an advantage. If it asks for a difference, the answer must show a difference.",
    misses: [
      {
        q: "Q26, Module 1",
        text: 'The goal was to identify an advantage of the new alloy. She chose an answer that said the alloy "requires complex manufacturing like other alloys." That is not an advantage, and it contradicts the notes.',
      },
      {
        q: "Q27, Module 1",
        text: "The goal was to identify a difference between two paintings. She chose a weaker answer in 23 seconds. The issue was not time alone. The issue was that she did not hold the goal in mind long enough to eliminate choices that did not directly show a difference.",
      },
      {
        q: "Module 2, one question left blank",
        text: "She left one rhetorical synthesis question blank. This suggests she may need a faster, more automatic process for these questions so she can answer them without over-reading the notes.",
      },
    ],
    body: [
      "She should read the goal before reading the notes. The goal tells her what the correct answer must do.",
      "She should use this method: read the goal first; name the task in plain words, such as \"find an advantage\" or \"show a difference\"; read only for the notes that match that goal; eliminate any answer that does not do exactly what the goal asks; eliminate any answer that contradicts the notes; choose the answer that both matches the goal and matches the notes.",
      "She needs to learn that these questions are not mainly asking for the most interesting or detailed answer. They are asking for the answer that does the assigned job.",
    ],
  },
];

export const SKYE_RW_SKILLS_RANK_HEAD =
  "Reading and Writing skills, ranked by where she missed most";

export const SKYE_MATH_INTRO = [
  "Skye has a strong academic record, so the math here is not about ability. The issue is that the SAT asks familiar math topics in unfamiliar ways. Watching her work through the section, she was often unsure how to start a problem and tried different approaches to find one that fit. On many of these it seemed like she was not 100% sure what the question was asking, which left her unable to figure out the best approach to solve the problem.",
  "She got three easy questions wrong and only two of seven medium questions in Module 1, and medium questions are core SAT content. Two topics gave her the most trouble: she missed every systems-of-equations question (0 of 2) and every nonlinear-equation question (0 of 4) in Module 1. Combined, Advanced Math (Algebra II).",
  "The calculator does not make up for this. Desmos only helps once a problem is set up, and if she cannot tell what a question is asking, or if she is not sure how to set the problem up, then even if the calculator could solve the problem she will not know what to enter to get to the answer. So step one would be to get her comfortable with identifying what the SAT questions are asking of her. Step two would be to then have her memorize the method to answering each. And then step 3 would be to teach her the specific calculator or by-hand method for answering, and have her practice until it becomes automatic.",
  "The work has three parts: the underlying skills of the SAT tests, the handful of formulas it expects from memory, and learning to recognize what each question is asking.",
];

export const MATH_WALKTHROUGH_ROWS: MathWalkthroughRow[] = [
  {
    question: "Q5 (M1, easy) systems, # of solutions",
    how: "Graph both lines, count crossings (one)",
    desmos: "Yes",
    formula: "none",
    marked: "Answered 2; two lines cross once, so the answer is one",
  },
  {
    question: "Q7 (M1, easy) nonlinear + linear",
    how: "Graph y=64 and y=x²+8, read x; or set equal, x²=56",
    desmos: "Yes",
    formula: "none",
    marked: "Answered 4√14; correct is 2√14",
  },
  {
    question: "Q9 (M1, med) nonlinear with a constant",
    how: "Substitute each option (42, c, 1+c) and check both sides",
    desmos: "No, by hand",
    formula: "none",
    marked: "Answered III only; correct is I and III (42 is also a solution)",
  },
  {
    question: "Q11 (M1, med) exponential growth",
    how: "By hand: 1000=500·2^(3k), so 3k=1, k=1/3; or test each k",
    desmos: "No, by hand",
    formula: "exponential form a·b^x",
    marked: "Answered k=3, the doubling period from the problem; correct is k=1/3",
  },
  {
    question: "Q13 (M1, med) circle, radians",
    how: "By hand: add π/4 + π/6 = 5π/12, convert ×180/π = 75°",
    desmos: "Arithmetic only",
    formula: "radians to degrees",
    marked: "Answered 45, the value of angle U; the question asks for V, which is 75",
  },
  {
    question: "Q14 (M1, med) linear, intercepts",
    how: "Graph y=5x−20, read both intercepts (4 and −20), add",
    desmos: "Yes",
    formula: "none",
    marked: "Answered 4, the value of h; the question asks for h+k, which is −16",
  },
  {
    question: "Q16 (M1, hard) radical equation",
    how: "Graph both sides, read smaller x; or square, then quadratic formula (won't factor)",
    desmos: "Yes",
    formula: "quadratic formula",
    marked: "Answered 2−4√2; correct is 4−4√2",
  },
  {
    question: "Q17 (M1, med) line from two points",
    how: "Plot both points, test which choice passes through both; or slope = 3/2, then build",
    desmos: "Yes",
    formula: "slope formula",
    marked: "Used slope 3; correct slope is 3/2 (her line passes through only one of the two points)",
  },
  {
    question: "Q18 (M1, hard) perpendicular lines",
    how: "Find perpendicular slope −4/3, graph both lines; or test which answer point is on the given line",
    desmos: "Yes",
    formula: "perpendicular slope (negative reciprocal)",
    marked: "Answered (32/25, −41/25), which is not on the given line; correct is (68/25, −49/25)",
  },
  {
    question: "Q21 (M1, hard) circle, arc length",
    how: "By hand: arc/circumference = angle/360, solve for angle; or test each choice",
    desmos: "Arithmetic only",
    formula: "arc length",
    marked: "Answered 40 in 19 seconds; the range is 34 to 38",
  },
  {
    question: "Q22 (M1, hard) tangent line and parabola",
    how: "Graph both with a slider for c, slide until they touch once, read x=3; or discriminant=0, then solve",
    desmos: "Yes (slider)",
    formula: "discriminant",
    marked: "Answered −3; correct is 3",
  },
  {
    question: "Q2 (M2, easy) rearrange an equation",
    how: "By hand: divide every term by 10; or test with real numbers for q and n",
    desmos: "No, by hand",
    formula: "none",
    marked: "Answered q/10 − 4n; correct is (q−4n)/10",
  },
  {
    question: "Q11 (M2, med) line from two points",
    how: "Plot both points, test which choice fits; or slope = 2, then build",
    desmos: "Yes",
    formula: "slope formula",
    marked: "Used slope 3; correct slope is 2 (her line passes through only one of the two points)",
  },
  {
    question: "Q18 (M2, med) exponential decay",
    how: "By hand: 20·(0.6)^x; or test each choice at x=0 and x=1",
    desmos: "Yes",
    formula: "exponential form a·b^x",
    marked: "Answered 0.6(20)^x; correct is 20(0.6)^x",
  },
  {
    question: "Q22 (M2, hard) function composition",
    how: "Define h, then j(x)=h(x+2), graph y=j, read the intercepts; or substitute x+2 by hand",
    desmos: "Yes",
    formula: "none",
    marked: "Answered 5, the sum of the original roots; correct is −1 after the shift",
  },
];

export const SKYE_MATH_AFTER_TABLE = [
  "Totaled across the fifteen:",
  "Ten of them can be solved entirely with the built-in Desmos calculator. That does not mean she can just open the calculator and get them right. First she has to know every type of problem the SAT uses and which ones can and cannot be done on the calculator. Then, for each one that can, she has to know how to set it up or graph it, and which value on the screen is the answer. That takes training and practice.",
  "Five have to be done by hand: Q9, Q11, and Q2, plus the conversions in Q13 and Q21.",
  "Nine need a formula that is not on the reference sheet, the seven listed below.",
];

export const SKYE_MATH_SKILLS_INTRO =
  "The two clearest priorities are systems of equations and nonlinear equations. In Module 1 she missed every question in both, 0 of 2 and 0 of 4, and both are high-frequency on the SAT.";

export const SKYE_MATH_SKILLS = [
  "Systems of equations: that the solution is where the lines cross, how many solutions a system has, and how to find that point. (Q5, Q18)",
  "Factoring and the zero-product rule. (Q9)",
  "Slope from two points, and writing the equation of a line from it. (Q17, M2 Q11)",
  'Exponential functions: the form a·b^x, and turning a phrase like "doubles every 3 days" or "decreases 40%" into it. (Q11, M2 Q18)',
  "Circle measures: radians to degrees, and arc length. (Q13, Q21)",
  "Perpendicular lines: the negative-reciprocal slope. (Q18)",
  "Function transformations: what h(x+2) does to a graph. (Q22 in Module 2)",
  "Equation manipulation: dividing every term, isolating a variable. (M2 Q2)",
];

export const SKYE_MATH_QUESTION_TYPES =
  "The other half of the work is recognizing what a question is asking. The SAT reuses a fixed set of question types, and the same topic can look unfamiliar depending on the wording. Once she can tell what a question is asking, she knows which formula or approach to use to set it up and solve it. Until then she is guessing or plugging in answer choices and hoping one is right. So she needs to learn the question types and what each one looks like. A few examples: two points and \"find the equation\" is a slope-and-intercept question; \"how many solutions\" is a \"where do the lines cross\" question; and reading for exactly what is asked, angle V and not U, h+k and not h, keeps her from stopping a step early.";

export const SKYE_MATH_FORMULAS_INTRO =
  "These are the formulas she needs to know by heart and be able to apply. They accounted for 9 of her 15 misses, and none of them are on the SAT reference sheet:";

export const SKYE_MATH_FORMULAS = [
  "Slope from two points: m = (y₂ − y₁) / (x₂ − x₁)",
  "The quadratic formula: x = (−b ± √(b² − 4ac)) / (2a)",
  "The discriminant, b² − 4ac, and that a value of zero means the equation has exactly one solution",
  "Radians to degrees: degrees = radians × 180 / π",
  "Arc length: the arc is (central angle ÷ 360) of the full circumference",
  "Exponential form: f(x) = a·b^x, where a is the starting value and b is the growth or decay factor (1 plus the rate for growth, 1 minus the rate for decay)",
  "Perpendicular slope: the negative reciprocal of the other line's slope",
];

export const SKYE_MATH_FORMULAS_FOOT =
  "The reference sheet does give her the area and circumference of a circle and the volume formulas, so those are not on this list.";

export const SKYE_SKIP_TIME = {
  reading:
    "Inferences (every one correct in both modules), Cross-Text Connections, and most of Command of Evidence. Her trouble is the logic-matching habit on the question types above and the specific punctuation and modifier rules, not understanding the passages.",
  math: "Problem-Solving and Data Analysis (every question correct in Module 1: ratios, statistics, two-variable data, margin of error, probability), plus linear equations, lines and angles, and area and volume. Her data and basic-geometry base is solid.",
};
