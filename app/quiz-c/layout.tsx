import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "June SAT Score Review · Illuminairy",
  description:
    "Score Review is taking a short break. Book a Strategy Call to talk to an SAT expert in the meantime.",
  robots: { index: false, follow: false },
};

export default function QuizCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
