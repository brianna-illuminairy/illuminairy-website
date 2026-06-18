"use client";

import { useState } from "react";

type AdaptivePath = "strong" | "rough";

const PATHS: Record<
  AdaptivePath,
  {
    label: string;
    m1Summary: string;
    m2Label: string;
    m2Detail: string;
    takeaway: string;
  }
> = {
  strong: {
    label: "Strong Module 1",
    m1Summary: "You miss only a few questions in Module 1.",
    m2Label: "Harder Module 2",
    m2Detail:
      "Questions get tougher, but this module is where most of your upside lives. Strong students who earn the harder route can reach higher scores.",
    takeaway: "Accuracy in Module 1 matters. Easy and medium misses in Module 1 can block the harder route."
  },
  rough: {
    label: "Rough Module 1",
    m1Summary: "You miss several easy or medium questions in Module 1.",
    m2Label: "Easier Module 2",
    m2Detail:
      "Questions are more forgiving, but the score ceiling is lower. You still answer every question; the test is matching difficulty to where you are today.",
    takeaway: "A rough Module 1 does not mean you failed. It means Module 2 meets you where you are. We use both modules to see what to teach."
  }
};

export function AdaptiveModulesSlide() {
  const [path, setPath] = useState<AdaptivePath>("strong");
  const active = PATHS[path];

  return (
    <>
      <p>
        Each section is <strong>adaptive</strong>: your Module 1 results decide whether Module 2 is harder or
        easier. The test does this automatically. You never choose.
      </p>

      <div className="skye-adaptive__flow" aria-label="Adaptive module flow">
        <div className="skye-adaptive__module skye-adaptive__module--m1">
          <span className="skye-adaptive__module-tag">Module 1</span>
          <span className="skye-adaptive__module-title">Same starting mix for everyone</span>
          <span className="skye-adaptive__module-detail">Easy, medium, and hard questions · your score here routes Module 2</span>
        </div>
        <div className="skye-adaptive__arrow" aria-hidden="true">
          ↓
        </div>
        <div className="skye-adaptive__fork">
          <button
            type="button"
            className={`skye-adaptive__path-btn${path === "strong" ? " is-active" : ""}`}
            onClick={() => setPath("strong")}
          >
            Few misses in M1
          </button>
          <button
            type="button"
            className={`skye-adaptive__path-btn${path === "rough" ? " is-active" : ""}`}
            onClick={() => setPath("rough")}
          >
            More misses in M1
          </button>
        </div>
        <div className="skye-adaptive__arrow" aria-hidden="true">
          ↓
        </div>
        <div className={`skye-adaptive__module skye-adaptive__module--m2${path === "strong" ? " is-hard" : " is-easy"}`}>
          <span className="skye-adaptive__module-tag">Module 2</span>
          <span className="skye-adaptive__module-title">{active.m2Label}</span>
          <span className="skye-adaptive__module-detail">{active.m2Detail}</span>
        </div>
      </div>

      <p className="skye-scoring__rule">
        <strong>What this means for you:</strong> {active.m1Summary} {active.takeaway}
      </p>

      <ul className="skye-adaptive__bullets">
        <li>Do your best on <strong>every</strong> Module 1 question, especially easy and medium ones.</li>
        <li>Module 2 difficulty is not a grade. It is the test adjusting to you.</li>
        <li>Today is a baseline. Whatever route you get, the report still ranks your weakest topics.</li>
      </ul>
    </>
  );
}
