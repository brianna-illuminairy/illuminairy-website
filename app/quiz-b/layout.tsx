import type { Metadata } from "next";
import "./quiz-b-bundle.css";

export const metadata: Metadata = {
  title: "Free SAT Lesson · Illuminairy",
  description:
    "Plan Builder for parents. Answer a few questions, see what's realistic for their next SAT, and claim a free 1:1 lesson.",
  robots: { index: true, follow: true },
};

export default function QuizBLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="qf-funnel-root qfb-lab-root">
      <div className="qf-funnel-column">
        <div className="qf-funnel-fill">{children}</div>
      </div>
    </div>
  );
}
