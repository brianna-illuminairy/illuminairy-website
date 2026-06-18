"use client";

import { useState } from "react";

type FormulaGroup = {
  id: string;
  label: string;
  items: { name: string; formula: string }[];
};

const REFERENCE_GROUPS: FormulaGroup[] = [
  {
    id: "area",
    label: "Area",
    items: [
      { name: "Rectangle", formula: "A = lw" },
      { name: "Triangle", formula: "A = ½bh" },
      { name: "Circle", formula: "A = πr²" },
      { name: "Circumference", formula: "C = 2πr" }
    ]
  },
  {
    id: "triangles",
    label: "Right triangles",
    items: [
      { name: "Pythagorean theorem", formula: "a² + b² = c²" },
      { name: "45-45-90 sides", formula: "x, x, x√2" },
      { name: "30-60-90 sides", formula: "x, x√3, 2x" }
    ]
  },
  {
    id: "volume",
    label: "Volume",
    items: [
      { name: "Rectangular prism", formula: "V = lwh" },
      { name: "Cylinder", formula: "V = πr²h" },
      { name: "Sphere", formula: "V = (4/3)πr³" },
      { name: "Cone", formula: "V = ⅓πr²h" },
      { name: "Pyramid", formula: "V = ⅓lwh" }
    ]
  },
  {
    id: "facts",
    label: "Angle facts",
    items: [
      { name: "Degrees in a circle", formula: "360°" },
      { name: "Radians in a circle", formula: "2π" },
      { name: "Degrees in a triangle", formula: "180°" }
    ]
  }
];

const NOT_ON_SHEET = [
  "Slope and line equations (y = mx + b)",
  "Quadratic formula",
  "Exponent rules and factoring patterns",
  "Percent change, mean, and stats formulas",
  "Distance or midpoint formulas"
] as const;

export function ReferenceSheetSlide() {
  const [activeGroup, setActiveGroup] = useState(REFERENCE_GROUPS[0].id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const group = REFERENCE_GROUPS.find((g) => g.id === activeGroup) ?? REFERENCE_GROUPS[0];

  return (
    <>
      <p>
        On every <strong>Math</strong> question, Bluebook includes a built-in <strong>Reference</strong> sheet.
        It is geometry only: areas, volumes, right triangles, and a few angle facts. Click the Reference
        button in the top toolbar (often labeled <strong>Reference</strong> or shown as x²).
      </p>

      <div className="skye-ref-demo">
        <div className="skye-ref-demo__toolbar">
          <span>Math · Module 1</span>
          <button
            type="button"
            className={`skye-ref-demo__btn${sheetOpen ? " is-active" : ""}`}
            onClick={() => setSheetOpen((v) => !v)}
          >
            Reference
          </button>
        </div>
        {sheetOpen ? (
          <div className="skye-ref-sheet" aria-label="SAT reference sheet preview">
            <p className="skye-ref-sheet__title">Reference sheet (given on the test)</p>
            <div className="skye-ref-sheet__tabs">
              {REFERENCE_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`skye-ref-sheet__tab${activeGroup === g.id ? " is-active" : ""}`}
                  onClick={() => setActiveGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <ul className="skye-ref-sheet__list">
              {group.items.map((item) => (
                <li key={item.name}>
                  <span className="skye-ref-sheet__name">{item.name}</span>
                  <span className="skye-ref-sheet__formula">{item.formula}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="skye-ref-demo__hint">Tap Reference above to preview what opens on the real test.</p>
        )}
      </div>

      <p className="skye-scoring__rule">
        <strong>How to use it:</strong> when a problem mentions area, volume, or a right triangle, open
        Reference and pick the matching shape. You still decide which formula fits the question.
      </p>

      <div className="skye-ref-not">
        <p className="skye-ref-not__title">Not on the sheet (you need to know these yourself)</p>
        <ul className="skye-ref-not__list">
          {NOT_ON_SHEET.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="skye-ref-not__note">
          That is why plug-in, graphing, and scratch-paper algebra still matter. The sheet is a helper for
          geometry, not a cheat code for every Math question.
        </p>
      </div>
    </>
  );
}
