export type SohaPatternSkill = {
  title: string;
  body: string;
  fix: string;
};

export const SOHA_ADAPTIVE_INTRO =
  "The Digital SAT is adaptive, which means the second module either becomes easier or harder based on your performance in the first module for each section. The goal is to ensure you get enough correct during the first module that you get the harder version of the second module.";

export const SOHA_ADAPTIVE_GOOD_NEWS =
  'The good news is that Soha made it into the "hard" version of module 2 for both RW and Math and is not at risk of leveling down.';

export const SOHA_RW_INTRO = [
  "Soha missed 2 questions on module 1 of reading and writing, one of which was easy difficulty. Missing an easy question which was on Transitions, and the second of which was medium difficulty and was a Boundaries. That means for module 1 of the R&W section, all of her errors were on grammar and punctuation rules, and none of them were on reading comprehension and vocabulary.",
  'Moving into module 2 of reading and writing, she missed 3 additional grammar questions each a different question type: boundaries, transitions, and subject-verb agreement. She also missed 2 questions on command of evidence which is where you\'re provided with "notes" and you have to identify the best evidence in a passage or graph that supports a stated claim, hypothesis, or logical conclusion.',
  "One thing I found interesting about her Reading and Writing performance is that her misses were spread fairly evenly across difficulty levels. From a points lost per question perspective and impact on her score, the easy question on transitions in module 1 is the single question that cost her the most points. The 3 medium questions she got incorrect cost her the second most points. And the hard questions she got incorrect in module 2 cost her the least points.",
  "After reviewing each of the questions she missed in more depth one by one, the core underlying pattern across them was similar. She is choosing answers that are locally plausible but do not satisfy the full sentence or the full claim being tested.",
];

export const SOHA_RW_PATTERNS: SohaPatternSkill[] = [
  {
    title: "Boundaries and complete clauses",
    body: 'On the Marie Curie question she chose a semicolon plus a participle phrase, "radioactivity; earning." She correctly saw that the sentence needed a break, but she did not test whether both sides of the punctuation were complete sentences. The correct answer added "and she earned," which makes a second full clause.',
    fix: "A single habit: at every punctuation choice, check whether each side is a complete sentence on its own.",
  },
  {
    title: "Transitions",
    body: 'On Module 1, Q22 (easy) she chose "For example," but the second sentence contradicts the first instead of illustrating it, so the answer was "In contrast." On Module 2, Q23 (medium) she chose "Additionally," but the sentence moves to a final interpretation, so "Ultimately" fit. She is picking transitions based on whether the next sentence is related, rather than naming the exact relationship first.',
    fix: "Label the relationship before looking at the choices: contrast, example, result, addition, conclusion, or alternative.",
  },
  {
    title: "Command of Evidence",
    body: 'On the CO2 table she picked an answer about process emissions, but the claim was about total emissions and the "necessary but not sufficient" logic. On the Kurosawa question she picked a true fact about scholars analyzing his films, but the claim needed evidence that the diverse later works reflect his own hybrid approach. Both answers were factually tied to the passage but not matched to the specific claim that was being asked.',
    fix: "Restate the exact claim before reading the answer choices, then reject anything that is true from the passage but not matched to the claim the question is seeking evidence for.",
  },
  {
    title: "Subject-verb agreement with interrupting phrases",
    body: 'On the Henrietta Swan Leavitt question she chose "has remained," matching the nearby singular name, but the real subject was the plural "observations."',
    fix: "The classic move: use the highlighter tool to cross out the long descriptive phrase in the middle, then once done use a different color to highlight the verb and the real subject, then match their tenses.",
  },
];

export const SOHA_RW_PLAN_NOTE =
  "Given her strong performance and overall command, I'd like to do 1-2 lessons per the above skills. I'd also have her implement a mistake log, where every answer she gets wrong she logs into a google sheet and then puts what she got wrong and how she could've identified the correct answer for next time. After each lesson I would then have her complete timed practice until she's able to answer 100% easy questions, 95% medium questions, and 95% hard questions accurately. Each following session we'd review any mistakes she had from the assigned practice problems and go over the logic behind the answer to make sure she understands.";

export const SOHA_MATH_INTRO = [
  "She scored higher on math than on reading and writing, having watched her performance during the test she has a very strong command of Desmos calculator usage and formula sheet usage. However, those very things which are helping her score are also harming her in other ways. For example, I saw her reach for the calculator by default on questions which required math to be completed \"by hand\" and or where you cannot arrive at the complete and accurate answer via the calculator. She pulls up and uses the calculator by default for basically every math question. The problem with this is that she'll often start plugging equations or problems into the calculator that are not solvable by the calculator and then get stuck. So her very strength is also her weakness. So the fix here is that we train her to very quickly identify when a problem is not eligible or solvable with the built-in calculator and then teach her how to solve it by hand.",
  "She missed a total of 6 problems, each spread across a different skill, as per the below table:",
  "One thing I found interesting about her math results is that her misses were more highly concentrated in the hard level difficulty questions, a couple of mediums and no easy level questions. From a point loss by skill perspective. She is losing most of her points from factoring and factor theorem questions (which cannot be solved via the calculator alone and require setup by hand) and from off-formula sheet geometry problems,",
];

export const SOHA_MATH_GAP1_INTRO =
  "She struggles with questions that require factoring or the factor theorem, the same questions she was trying to plug into the calculator to solve which needed to be factored by hand. Three of her six math misses are factoring or factor-theorem questions where the move is algebra by hand, and the calculator either cannot get there or actively leads her to the wrong conclusion.";

export const SOHA_MATH_Q13_WORKED = {
  setup:
    "The question gives 9x³ - 6x² - 24x and says 3x + k is a factor, then asks for k. The path is to factor:",
  factorLine: "9x³ - 6x² - 24x = 3x(3x² - 2x - 8) = 3x(x - 2)(3x + 4), so 3x + k matches 3x + 4 and k = 4",
  after:
    "Instead of factoring, she tried to graph her way to the answer and entered 13.15, which was a point where two curves crossed on the graphing calculator. There is no graphing path to k here. The question is built to reward factoring, and the calculator pulled her away from it.",
  correct: "4",
  marked: "13.15",
};

export const SOHA_MATH_GAP1_AFTER =
  "The same pattern produced two more misses. Module 2 Q20 gives that x + 2a is a factor of f(x) and asks for a. The move is the factor theorem: if x + 2a is a factor, then f(-2a) = 0, which solves to a = 3/2. She answered 5/2. And Module 1 Q9, the nonlinear (quadratic) equation she spent 333 seconds on, which was due to both a quadratic / zero product property miss and a factoring miss.";

export const SOHA_MATH_Q9_CONTEXT =
  "Going back and reviewing her Module 1 Q9 miss, it was a quadratic equation. However, the way to solve is to combine factoring with the zero product property. Going back, she failed to set this problem up correctly. It's another problem that requires some math by hand. She never once moved everything to one side (so that she could set it up to equal zero). If she would've setup the question properly, moving everything to one side it may have been easier for her to identify that the problem had a \"shared chunk\" that could be factored out. Again I think her approach of starting with the calculator really harmed her here, since this question needed to be solved by hand using scratch paper. For Math Module 1 Q9, the issue was not \"she doesn't understand quadratics.\" It was more specifically a setup and strategy issue: she did not recognize the equation needed to be rearranged into zero-product form, then she did not factor it. The steps to solve this problem are simple: move everything to one side, set equal to zero, factor out anything common, solve for the variables present in each expression to identify all possible solutions. Sharing Q9's answer below to demonstrate:";

export const SOHA_MATH_Q9_WORKED_PANELS = [
  {
    src: "/diagnostic/soha-m1-q9-worked-steps-1-3.png",
    alt: "Module 1 Question 9 walkthrough: problem statement through identifying the shared term y minus 42",
    width: 690,
    height: 868,
  },
  {
    src: "/diagnostic/soha-m1-q9-worked-step-4.png",
    alt: "Module 1 Question 9 walkthrough: factoring out y minus 42 from both components",
    width: 690,
    height: 932,
  },
  {
    src: "/diagnostic/soha-m1-q9-worked-steps-5-7.png",
    alt: "Module 1 Question 9 walkthrough: simplified expression through final solutions y equals 42 and y equals 1 plus c",
    width: 756,
    height: 1024,
  },
] as const;

export const SOHA_MATH_Q9_STEPS: { title: string; body: string; note?: string }[] = [
  {
    title: "Move everything to one side and set equal to zero",
    body: "y - 42 - (y - c)(y - 42) = 0",
  },
  {
    title: "Break everything left of the equal sign, or non zero side into its component expressions",
    body: "Component 1: y - 42\nComponent 2: -(y - c)(y - 42)",
  },
  {
    title: "Identify any shared terms which can be factored out from both expressions",
    body: "Shared term: y - 42",
  },
  {
    title: "Factor out that term",
    body:
      "Component 1 before factoring: y - 42 → after factoring: 1\nComponent 2 before factoring: -(y - c)(y - 42) → after factoring: -(y - c)",
    note:
      "If we factor out y - 42, we're left with just 1, because y - 42 × 1 = y - 42. Where people get tripped up here is thinking that once they factor it out nothing is left behind; that's not true, you need the 1 as a placeholder. If we factor out y - 42 from the second component, we're left with -(y - c). The problem here is that people get rid of the negative sign since there's nothing before it. But you have to keep it. We've done nothing to the equation to get rid of it, so it must remain.",
  },
  {
    title: "Rewrite the factored out term + the post factoring terms into the new simplified expression",
    body:
      "Factored term: (y - 42)\nRemaining component 1 terms: 1\nRemaining component 2 terms: -(y - c)\nSimplified expression: (y - 42)[1 - (y - c)]\nSet equal to zero: (y - 42)[1 - (y - c)] = 0",
  },
  {
    title: "Simplify the second term by distributing the negative sign",
    body: "[1 - (y - c)] = 0\n1 - y + c = 0",
  },
  {
    title: "Set the remaining components equal to zero and solve for y",
    body: "y - 42 = 0  →  y = 42\n1 - y + c = 0  →  -y + c = -1  →  -y = -1 - c  →  y = 1 + c",
  },
];

export const SOHA_MATH_GAP2 =
  "The second area I saw her struggling, was geometry for problems which cannot be solved using the built-in formula sheet. On Module 2 Q12, a cube has a volume of 125,000 cubic units and the question asks for its surface area. The path is side = cube root of 125,000 = 50, then surface area = 6 times 50² = 15,000. She answered 25,000, which means she did not know the formula and setup the problem properly. The relationship between cube volume and surface-area relationships is not on the SAT formula sheet, so this question rewards remembering the concept, not looking it up. She leaned on the formula sheet and calculator, but struggled when problems required her to remember something from courses she likely took 1+ years ago that could not be solved with either resource.";

export const SOHA_MATH_GAP2_RESOLVE =
  "To resolve for this, I'll take the time to re-teach or refresh her on any gaps she has on solving quadratic equations and on geometry concepts she needs to know which are not provided in the formula sheets.";

export const SOHA_MATH_REMAINING = [
  {
    q: "Module 2 Q16",
    text: "a hard algebra question about three collinear points, where the move is to set the two slopes equal and simplify to ak + bh = hk. h and k have varying meanings depending on circles or parabolas. You need to know and understand their relationships and meanings, which I've covered in the formulas section below.",
  },
  {
    q: "Module 2 Q22",
    text: "a profit and loss proportional-reasoning question (sell part at a loss, then find the profit percent needed on the rest to net 20%). This one is very teachable, but these multi-step proportional questions do not appear often on the SAT, so we'd cover this closer to the test date only once she's gotten to 95%+ accuracy on the topics that appear more often.",
  },
];

export const SOHA_BEHAVIOR_REVIEW =
  "She finished early and went back over her answers. On a school test I would encourage that. On a test that runs two hours and fourteen minutes, I would not have her review every Reading and Writing question twice. Switching back and forth between question types drains mental stamina, and that fatigue carries into the math section where she needs it most. Two facts from her own session make the case. During review she mostly did not change her answers, so the second pass added almost nothing. And the one Reading and Writing answer she did change, Q22, she changed from right to wrong, and that is an easy question in Module 1, so it is also her most expensive miss in the section. The review habit did not just fail to help. On the one question it touched, it cost her the most valuable point. My recommendation: one careful pass, use mark for review only for questions she is truly unsure of, and bank the leftover time and energy for math.";

export const SOHA_BEHAVIOR_CALCULATOR =
  "We can do some drills to make this more automatic for her, so that every time she sees a question as she's reading it she can quickly identify if she should or shouldn't use the calculator.";

export const SOHA_FORMULAS_INTRO =
  'For the SAT Math, you do not need to memorize "h and k" as standalone variables. What you need to recognize is what they mean when they appear in common equation forms.';

export const SOHA_VERTEX_FORM = {
  equation: "y = a(x - h)² + k",
  bullets: [
    "Vertex = (h, k)",
    "Axis of symmetry = x = h",
    "a determines whether the parabola opens up or down and how wide it is",
  ],
  example: "y = 2(x - 4)² - 3",
  exampleBullets: ["Vertex = (4, -3)", "Axis of symmetry = x = 4", "Opens upward because a = 2"],
  foot: "This is a very common SAT question.",
};

export const SOHA_CIRCLE_FORM = {
  equation: "(x - h)² + (y - k)² = r²",
  bullets: ["Center = (h, k)", "Radius = r"],
  example: "(x - 2)² + (y + 5)² = 16",
  exampleBullets: ["Center = (2, -5)", "Radius = 4"],
  foot: "Also common on the SAT.",
};

export const SOHA_SIGN_TRICK = {
  intro: "Students frequently miss points because of signs.",
  examples: [
    { given: "(x - 3)²", result: "h = 3" },
    { given: "(x + 3)²", result: "h = -3" },
  ],
  rule: "The sign inside the parentheses is always the opposite of the coordinate.",
  table: [
    { equation: "(x - 4)² + (y - 2)² = 25", h: "4", k: "2" },
    { equation: "(x + 4)² + (y - 2)² = 25", h: "-4", k: "2" },
    { equation: "(x - 4)² + (y + 2)² = 25", h: "4", k: "-2" },
    { equation: "(x + 4)² + (y + 2)² = 25", h: "-4", k: "-2" },
  ],
};

export const SOHA_MEMORIZE_TABLE = [
  { form: "y = a(x - h)² + k", memorize: "Vertex = (h, k)" },
  { form: "(x - h)² + (y - k)² = r²", memorize: "Center = (h, k), Radius = r" },
  { form: "(x - h)", memorize: "Shift right h units" },
  { form: "(x + h)", memorize: "Shift left h units" },
  { form: "+k outside", memorize: "Shift up k units" },
  { form: "-k outside", memorize: "Shift down k units" },
];

export const SOHA_PATTERN_RULES = [
  "Vertex form → (h, k) is the vertex",
  "Circle form → (h, k) is the center",
  "Inside parentheses = opposite sign",
  "Outside parentheses = same sign",
];

export const SOHA_QUADRATIC_FORMULA = {
  formula: "x = (-b ± √(b² - 4ac)) / (2a)",
  note: "Not on the SAT formula sheet. Use when factoring isn't obvious.",
};

export const SOHA_DISCRIMINANT = {
  formula: "b² - 4ac",
  rules: [
    "Positive → 2 real solutions",
    "Zero → 1 real solution",
    "Negative → no real solutions",
  ],
};

export const SOHA_FACTORING_PATTERNS = [
  { label: "Difference of squares", formula: "a² - b² = (a - b)(a + b)" },
  {
    label: "Perfect square trinomials",
    formula: "(a + b)² = a² + 2ab + b²  ·  (a - b)² = a² - 2ab + b²",
  },
];

export const SOHA_MATH_750_LIST = [
  "Slope formula",
  "y = mx + b",
  "Point-slope form",
  "Vertex form (h, k)",
  "Quadratic formula",
  "Discriminant",
  "Difference of squares",
  "30-60-90 triangle ratios",
  "45-45-90 triangle ratio",
  "Percent change formula",
];
