type StudentWeakness = {
  id: string;
  accent: string;
};

const STUDENTS: StudentWeakness[] = [
  { id: "s1", accent: "#c83e2c" },
  { id: "s2", accent: "#2f6fb0" },
  { id: "s3", accent: "#7a5c1e" },
  { id: "s4", accent: "#2f8b55" },
  { id: "s5", accent: "#8b4f9e" },
  { id: "s6", accent: "#c83e2c" },
  { id: "s7", accent: "#2f6fb0" },
  { id: "s8", accent: "#7a5c1e" },
  { id: "s9", accent: "#2f8b55" },
  { id: "s10", accent: "#8b4f9e" },
  { id: "s11", accent: "#c83e2c" },
  { id: "s12", accent: "#2f6fb0" },
  { id: "s13", accent: "#7a5c1e" },
  { id: "s14", accent: "#2f8b55" },
  { id: "s15", accent: "#8b4f9e" }
];

const SCORES = ["1100", "1120", "1110", "1140"];

type Int8GroupClassClassroomGraphicProps = {
  ariaLabel: string;
};

export function Int8GroupClassClassroomGraphic({
  ariaLabel
}: Int8GroupClassClassroomGraphicProps) {
  return (
    <div
      className="int8-group-class-graphic quiz-step-trust-graphic"
      role="img"
      aria-label={ariaLabel}
    >
      <div className="quiz-step-trust-card int8-group-class-graphic__card">
        <div className="int8-group-class-graphic__teacher-row">
          <div className="int8-group-class-graphic__teacher" aria-hidden>
            <span className="int8-group-class-graphic__teacher-head" />
            <span className="int8-group-class-graphic__teacher-body" />
          </div>
          <div className="int8-group-class-graphic__board" aria-hidden>
            <span className="int8-group-class-graphic__board-label">One lesson for everyone</span>
            <span className="int8-group-class-graphic__board-topic">All 28 SAT skills · same pace</span>
          </div>
        </div>

        <div className="int8-group-class-graphic__seats" aria-hidden>
          {STUDENTS.map((student) => (
            <div key={student.id} className="int8-group-class-graphic__seat">
              <span
                className="int8-group-class-graphic__student"
                style={{ borderColor: student.accent }}
              >
                <span
                  className="int8-group-class-graphic__weak-spot"
                  style={{ background: student.accent }}
                />
              </span>
            </div>
          ))}
        </div>

        <p className="int8-group-class-graphic__overlay">
          One curriculum. Different weaknesses.
        </p>

        <div className="int8-group-class-graphic__scores" aria-hidden>
          {SCORES.map((score, index) => (
            <span key={score} className="int8-group-class-graphic__score-item">
              {index > 0 ? (
                <span className="int8-group-class-graphic__score-arrow">→</span>
              ) : null}
              <span className="int8-group-class-graphic__score">{score}</span>
            </span>
          ))}
          <span className="int8-group-class-graphic__score-note">Minimal movement</span>
        </div>
      </div>
    </div>
  );
}
