import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "June SAT Score Review · Illuminairy",
  description:
    "Score Review is taking a short break. Book a Strategy Call to talk to an SAT expert in the meantime.",
  robots: { index: false, follow: false },
};

export default function QuizCPlaceholderPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "var(--qf-canvas, #f7f5ef)",
        color: "var(--qf-ink, #121a2b)",
        fontFamily: "var(--qf-font-family, 'Plus Jakarta Sans', system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <p
          style={{
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.7,
            margin: 0,
          }}
        >
          Illuminairy
        </p>
        <h1
          style={{
            fontSize: 26,
            lineHeight: 1.2,
            margin: "12px 0 16px",
            fontWeight: 700,
          }}
        >
          Score Review is coming back soon.
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.5, margin: "0 0 24px", opacity: 0.85 }}>
          We&apos;re polishing this experience. In the meantime, talk to an SAT expert about
          your student&apos;s score on a free Strategy Call.
        </p>
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            padding: "12px 22px",
            borderRadius: 12,
            background: "var(--qf-accent, #121a2b)",
            color: "#f7f5ef",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Book a Strategy Call
        </Link>
      </div>
    </main>
  );
}
