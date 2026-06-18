"use client";

import { useState } from "react";
import {
  DIAGNOSTIC_SKILL_HIERARCHY,
  DIAGNOSTIC_MATH_TOPIC_COUNT,
  DIAGNOSTIC_RW_TOPIC_COUNT,
  DIAGNOSTIC_TOTAL_TOPIC_COUNT,
  type DiagnosticSkillSection
} from "@/lib/skye/diagnostic-skill-taxonomy";

function HierarchyDiagram() {
  return (
    <div className="skye-taxonomy__pyramid" aria-label="Diagnostic report hierarchy">
      <div className="skye-taxonomy__pyramid-row skye-taxonomy__pyramid-row--section">
        <span className="skye-taxonomy__pyramid-label">Section</span>
        <span className="skye-taxonomy__pyramid-value">Reading &amp; Writing · Math</span>
      </div>
      <div className="skye-taxonomy__pyramid-arrow" aria-hidden="true">
        ↓
      </div>
      <div className="skye-taxonomy__pyramid-row skye-taxonomy__pyramid-row--domain">
        <span className="skye-taxonomy__pyramid-label">Domain</span>
        <span className="skye-taxonomy__pyramid-value">4 domains per section (broad category)</span>
      </div>
      <div className="skye-taxonomy__pyramid-arrow" aria-hidden="true">
        ↓
      </div>
      <div className="skye-taxonomy__pyramid-row skye-taxonomy__pyramid-row--topic">
        <span className="skye-taxonomy__pyramid-label">Topic</span>
        <span className="skye-taxonomy__pyramid-value">
          {DIAGNOSTIC_RW_TOPIC_COUNT} RW + {DIAGNOSTIC_MATH_TOPIC_COUNT} Math = {DIAGNOSTIC_TOTAL_TOPIC_COUNT}{" "}
          discrete skills (what each question is tagged)
        </span>
      </div>
    </div>
  );
}

function SectionExplorer({ section }: { section: DiagnosticSkillSection }) {
  const [openDomains, setOpenDomains] = useState<Set<string>>(new Set([section.domains[0]?.id]));

  function toggleDomain(domainId: string) {
    setOpenDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domainId)) next.delete(domainId);
      else next.add(domainId);
      return next;
    });
  }

  const topicCount = section.domains.reduce((sum, d) => sum + d.topics.length, 0);

  return (
    <div className="skye-taxonomy__section">
      <p className="skye-taxonomy__school-span">
        <strong>{section.id === "math" ? "Math level" : "School skills"}:</strong> {section.schoolSpan}
      </p>
      <p className="skye-taxonomy__count">
        {section.domains.length} domains · {topicCount} topics on your diagnostic
      </p>
      <div className="skye-taxonomy__domains">
        {section.domains.map((domain) => {
          const open = openDomains.has(domain.id);
          return (
            <div key={domain.id} className={`skye-taxonomy__domain${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="skye-taxonomy__domain-head"
                onClick={() => toggleDomain(domain.id)}
                aria-expanded={open}
              >
                <span className="skye-taxonomy__domain-name">{domain.label}</span>
                <span className="skye-taxonomy__domain-meta">
                  {domain.topics.length} topics {open ? "−" : "+"}
                </span>
              </button>
              {open ? (
                <ul className="skye-taxonomy__topics">
                  {domain.topics.map((topic) => (
                    <li key={topic.id} className="skye-taxonomy__topic">
                      <span className="skye-taxonomy__topic-label">{topic.label}</span>
                      {topic.hint ? <span className="skye-taxonomy__topic-hint">{topic.hint}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SkillTaxonomyHierarchySlide() {
  return (
    <>
      <p>
        After the diagnostic, your report lists <strong>every question</strong> with three labels: section,
        domain, and topic. The <strong>topic</strong> is the smallest, most specific skill (what we rank and
        teach first).
      </p>
      <HierarchyDiagram />
      <p style={{ fontSize: 14, color: "var(--aurora-muted)" }}>
        Illuminairy reads your misses by topic, then picks the 5–6 topics that will move your score the most.
        You do not need to memorize this list today. It is here so nothing on the test feels random.
      </p>
    </>
  );
}

export function SkillTaxonomyExplorerSlide({ initialSection }: { initialSection: "rw" | "math" }) {
  const [active, setActive] = useState<"rw" | "math">(initialSection);
  const section = DIAGNOSTIC_SKILL_HIERARCHY.find((s) => s.id === active)!;

  return (
    <>
      <p>Tap a domain to expand every topic on the diagnostic. These names match your tabular report.</p>
      <div className="skye-taxonomy__tabs" role="tablist" aria-label="Section">
        <button
          type="button"
          role="tab"
          aria-selected={active === "rw"}
          className={`skye-taxonomy__tab${active === "rw" ? " is-active" : ""}`}
          onClick={() => setActive("rw")}
        >
          Reading &amp; Writing
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === "math"}
          className={`skye-taxonomy__tab${active === "math" ? " is-active" : ""}`}
          onClick={() => setActive("math")}
        >
          Math
        </button>
      </div>
      <SectionExplorer section={section} />
    </>
  );
}
