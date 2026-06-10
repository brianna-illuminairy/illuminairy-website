export type AutomationStep = {
  id: string;
  label: string;
};

export type AutomationCatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  status: "coming_soon";
  trigger: string;
  dependencies: string[];
  steps: AutomationStep[];
};

export const AUTOMATION_CATALOG: AutomationCatalogItem[] = [
  {
    id: "enrollment-diagnostic-kickoff",
    title: "Enrollment → diagnostic kickoff",
    subtitle: "After payment and intake — welcome, MentoMind student, diagnostic booking",
    status: "coming_soon",
    trigger: "Enrollment active + intake complete",
    dependencies: ["Skill Diagnostic Calendly", "MentoMind", "Resend"],
    steps: [
      { id: "a1", label: "Merge lead into client / student / enrollment" },
      { id: "a2", label: "Welcome email with Skill Diagnostic Calendly link" },
      { id: "a3", label: "Create free MentoMind student" },
      { id: "a4", label: "Send calendar invite when diagnostic is booked" },
      { id: "a5", label: "Email pre-diagnostic instructions" }
    ]
  },
  {
    id: "diagnostic-first-session",
    title: "Diagnostic complete → first session",
    subtitle: "Pull MentoMind reports, build plan, publish portal, Week 1 lessons",
    status: "coming_soon",
    trigger: "Diagnostic marked complete or MentoMind reports available",
    dependencies: ["MentoMind", "Plan engine", "Student portal"],
    steps: [
      { id: "b1", label: "Download tabular + PDF diagnostic reports from MentoMind" },
      { id: "b2", label: "Analyze weaknesses and build personalized plan to test day" },
      { id: "b3", label: "Publish results, analysis, and plan in student portal" },
      { id: "b4", label: "Email parent + student when portal is ready" },
      { id: "b5", label: "Generate Week 1 lesson plan and slides in portal" },
      { id: "b6", label: "Confirm first tutoring session from intake windows" }
    ]
  },
  {
    id: "first-session-test-day",
    title: "First session → test day",
    subtitle: "Weekly progress, re-tests, lesson loop from practice results",
    status: "coming_soon",
    trigger: "Weekly cron per active enrollment",
    dependencies: ["MentoMind", "Session transcripts", "Student portal"],
    steps: [
      { id: "c1", label: "Ingest session transcripts" },
      { id: "c2", label: "Pull MentoMind homework completion and misses" },
      { id: "c3", label: "Re-rank skills and update plan" },
      { id: "c4", label: "Send weekly progress report to parent" },
      { id: "c5", label: "Schedule full-length re-test every 3–4 weeks by timeline" },
      { id: "c6", label: "Feed re-test results into next lesson plans" }
    ]
  },
  {
    id: "owner-weekly-digest",
    title: "Owner weekly reporting",
    subtitle: "Funnel, ad spend, margins, and follow-ups for Brianna",
    status: "coming_soon",
    trigger: "Monday morning ET cron",
    dependencies: ["Marketing digest", "Finance module", "Ads module"],
    steps: [
      { id: "d1", label: "Compile funnel KPIs and funnel leaks" },
      { id: "d2", label: "Include Meta spend and attributed outcomes" },
      { id: "d3", label: "List clients at negative margin and no-show risks" },
      { id: "d4", label: "Email digest to owner inbox" }
    ]
  }
];
