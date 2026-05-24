import Link from "next/link";
import { WaitlistSignup } from "@/components/waitlist-signup";
import { site } from "@/lib/site";

const palette = [
  ["pink", "#e4abc4"],
  ["tomato", "#f24822"],
  ["mustard", "#dfc653"],
  ["green", "#2f8b55"],
  ["clock", "#379bd0"],
  ["blush", "#eee3e0"],
  ["peach", "#ecc8a4"],
  ["off-white", "#f5ecd9"],
  ["mint", "#c8e2c4"],
  ["lagoon", "#90bdc1"]
];

const satFacts = [
  ["12", "weeks"],
  ["30", "live sessions"],
  ["24", "small group"],
  ["6", "private 1:1"],
  ["10", "student cap"],
  ["1450+", "mentor standard"]
];

const paths = [
  ["SAT", "Structured test preparation for ambitious college-bound students."],
  ["AI", "Applied AI upskilling for professionals and business owners."],
  ["Mentors", "A selective network of high-performing educated talent."],
  ["Labs", "Future experiments in technical education and applied expertise."]
];

const iconNames = [
  "rise",
  "window",
  "stack",
  "circle",
  "corner",
  "steps",
  "burst",
  "flag",
  "grid",
  "path",
  "dot",
  "spark"
];

function BoardMeta({
  n,
  label,
  title
}: {
  n: string;
  label: string;
  title: string;
}) {
  return (
    <div className="board-meta">
      <span>{n}</span>
      <i aria-hidden="true" />
      <span>{label}</span>
      <strong>{title}</strong>
    </div>
  );
}

export default function Home() {
  return (
    <section className="brand-board-page">
      <div className="brand-board-grid">
        <article className="brand-sheet brand-sheet--hero brand-sheet--wide">
          <BoardMeta n="01" label="identity" title="company home" />
          <div className="hero-spec">
            <p className="spec-note">
              Modern mentorship and applied learning for ambitious students,
              professionals, and business owners.
            </p>
            <h1 className="brand-display">
              illumin<span>ai</span>ry
            </h1>
            <div className="word-rule" aria-hidden="true">
              <b>ai</b>
            </div>
          </div>
          <div className="sheet-footer">
            <span>{site.legalName}</span>
            <span>{site.location}</span>
          </div>
        </article>

        <article className="brand-sheet brand-sheet--palette">
          <BoardMeta n="02" label="color" title="brand palette" />
          <div className="palette-grid">
            {palette.map(([name, color]) => (
              <div key={name} className="palette-tile" style={{ backgroundColor: color }}>
                <span>{name}</span>
                <small>{color}</small>
              </div>
            ))}
          </div>
          <div className="sheet-footer">
            <span>flat color only</span>
            <span>no gradients</span>
          </div>
        </article>

        <article className="brand-sheet brand-sheet--type">
          <BoardMeta n="03" label="type" title="voice" />
          <div>
            <p className="type-stack">
              learn.
              <br />
              build.
              <br />
              ship.
            </p>
            <p className="type-copy">
              Premium mentor-led programs with a high signal-to-noise ratio.
              Calm, sharp, and direct.
            </p>
          </div>
          <div className="type-panel">
            <span>medium</span>
            <span>regular</span>
            <span>tight</span>
            <b>AaBbCcDdEeFfGg</b>
          </div>
        </article>

        <article className="brand-sheet brand-sheet--mustard" id="program">
          <BoardMeta n="04" label="program" title="sat accelerator" />
          <div className="vertical-word">cohort</div>
          <div className="sat-facts">
            {satFacts.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="program-note">
            Georgia Tech-led SAT preparation for the {site.satDate} SAT. No
            guaranteed scores, just structure and accountability.
          </p>
        </article>

        <article className="brand-sheet brand-sheet--center">
          <BoardMeta n="05" label="positioning" title="platform" />
          <p className="slash-title">
            mentor-led /
            <br />
            applied learning
          </p>
          <div className="path-list">
            {paths.map(([name, text]) => (
              <div key={name}>
                <strong>{name}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="brand-sheet brand-sheet--icons" id="system">
          <BoardMeta n="06" label="system" title="icons" />
          <div className="icon-board" aria-label="Flat Illuminairy icon system">
            {iconNames.map((name) => (
              <span key={name} className={`shape-icon shape-icon--${name}`} />
            ))}
          </div>
        </article>

        <article className="brand-sheet brand-sheet--contact brand-sheet--wide">
          <BoardMeta n="07" label="next step" title="request details" />
          <div className="contact-layout" id="waitlist">
            <div>
              <h2>
                Start with SAT.
                <br />
                Expand into AI.
              </h2>
              <p>
                Ask about the SAT cohort, mentor applications, partnerships, or
                the broader Illuminairy platform.
              </p>
              <div className="contact-actions">
                <Link href={`mailto:${site.email}`}>email us</Link>
                <Link href={`mailto:${site.email}?subject=SAT%20consultation`}>
                  book consult
                </Link>
              </div>
            </div>
            <WaitlistSignup compact />
          </div>
        </article>
      </div>
    </section>
  );
}
