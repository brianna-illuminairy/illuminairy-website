import Link from "next/link";
import type { Metadata } from "next";
import "./quiz-funnel.css";
import "./quiz-globals.css";

export const metadata: Metadata = {
  title: "High GPA, low SAT? · Illuminairy",
  description:
    "Find out why they're struggling, what score improvement is realistic, and how to fix it before their next SAT.",
  openGraph: {
    title: "High GPA, low SAT? · Illuminairy",
    description:
      "Free 2-minute diagnostic for parents. Backed by data from 250,000+ students.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }]
  },
  robots: { index: true, follow: true }
};

function ApplicationCard({
  gpa,
  sat,
  satColor,
  status,
  statusColor
}: {
  gpa: string;
  sat: string;
  satColor: string;
  status: string;
  statusColor: string;
}) {
  return (
    <div
      style={{
        background: "var(--qf-paper)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        borderRadius: 12,
        border: "1px solid var(--qf-line)"
      }}
    >
      <div className="qf-meta" style={{ marginBottom: 6 }}>
        APPLICATION
      </div>
      <div style={{ height: 1, background: "rgba(20,20,20,0.1)", marginBottom: 8 }} />
      <div className="qf-meta">GPA</div>
      <div
        style={{
          fontFamily: "var(--qf-display)",
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: "-0.02em",
          marginBottom: 8
        }}
      >
        {gpa}
      </div>
      <div className="qf-meta">SAT</div>
      <div
        style={{
          fontFamily: "var(--qf-display)",
          fontWeight: 500,
          fontSize: 36,
          letterSpacing: "-0.02em",
          color: satColor,
          lineHeight: 1
        }}
      >
        {sat}
      </div>
      <div style={{ height: 1, background: "rgba(20,20,20,0.1)", margin: "10px 0 8px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "inline-block", width: 9, height: 9, background: statusColor }} />
        <span className="qf-meta" style={{ color: statusColor }}>
          {status}
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="qf-page" style={{ minHeight: "100dvh" }}>
      <div className="qf-top">
        <div className="qf-top-row">
          <div style={{ width: 30 }} />
          <img
            src="/brand/logo-horizontal.png"
            alt="illuminairy"
            style={{ height: 24, width: "auto" }}
          />
          <div style={{ width: 30 }} />
        </div>
      </div>

      <div className="qf-body" style={{ background: "var(--qf-bg)", overflow: "auto" }}>
        <div style={{ padding: "24px 22px 0" }}>
          <h1 className="qf-h1" style={{ fontSize: 40, lineHeight: 1.02 }}>
            <span style={{ color: "var(--qf-ink)" }}>High GPA,</span>
            <br />
            low SAT?
          </h1>
        </div>

        <div style={{ padding: "22px 22px 28px" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: 16,
              lineHeight: 1.5,
              color: "var(--qf-ink-mid)"
            }}
          >
            Find out why they&apos;re struggling.
            <br />
            What score improvement is realistic.
            <br />
            And how to fix it before their next test.
            <br />
            <strong>Backed by College Board data from 250,000+ students.</strong>
          </p>
        </div>

        <div
          style={{
            padding: "0 22px 22px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12
          }}
        >
          <ApplicationCard
            gpa="3.9"
            sat="1180"
            satColor="var(--qf-celestial)"
            status="OUT OF RANGE"
            statusColor="var(--qf-celestial)"
          />
          <ApplicationCard
            gpa="3.9"
            sat="1400"
            satColor="var(--qf-forest)"
            status="COMPETITIVE"
            statusColor="var(--qf-forest)"
          />
        </div>

        <div style={{ padding: "6px 22px 18px", textAlign: "center" }}>
          <div className="qf-meta" style={{ letterSpacing: "0.15em" }}>
            +220 PTS · 12 WEEKS
          </div>
        </div>

        <div style={{ padding: "0 22px 24px" }}>
          <Link href="/quiz?step=q1" className="btn qf-btn forest" style={{ display: "block", textAlign: "center" }}>
            Get my answers <span className="arrow">→</span>
          </Link>
        </div>

        <div style={{ padding: "0 22px 40px", textAlign: "center" }}>
          <p className="qf-disclaimer">Free · 2 minutes · No account needed</p>
        </div>
      </div>
    </div>
  );
}
