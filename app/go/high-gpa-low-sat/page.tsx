import type { Metadata } from "next";
import { HighGpaLowSatLanding } from "@/components/high-gpa-low-sat-landing";

export const metadata: Metadata = {
  title: "High GPA, low SAT?",
  description:
    "We'll help you figure out why they're struggling to get the score they need. Built on College Board data from 250,000+ students.",
  robots: { index: false, follow: false }
};

export default function HighGpaLowSatPage() {
  return <HighGpaLowSatLanding />;
}
