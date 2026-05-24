import type { ReactNode } from "react";

const miniCard: React.CSSProperties = {
  background: "#fff",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: 2,
  padding: "5px 7px 6px",
  width: 78,
  maxWidth: "100%"
};

const monoLbl: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-soft)",
  lineHeight: 1
};

function PrepIconKhan() {
  return (
    <div style={{ ...miniCard, width: 82, gap: 4 }}>
      <span style={monoLbl}>Online course</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            background: "var(--mint)",
            display: "grid",
            placeItems: "center",
            fontSize: 9,
            fontWeight: 800,
            color: "var(--ink)"
          }}
        >
          ▶
        </span>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "-0.02em" }}>Khan</span>
      </div>
    </div>
  );
}

function PrepIconBluebook() {
  return (
    <div style={{ ...miniCard, width: 84, padding: "4px 6px 5px" }}>
      <span style={monoLbl}>College Board</span>
      <div
        style={{
          width: "100%",
          height: 28,
          border: "2px solid var(--ink)",
          borderRadius: 3,
          background: "var(--cream-2, #ede0c4)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "3px 4px auto",
            height: 4,
            background: "rgba(10,10,10,0.12)"
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 6,
            bottom: 5,
            fontFamily: "var(--mono)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em"
          }}
        >
          BLUEBOOK
        </div>
      </div>
    </div>
  );
}

function PrepIconYoutube() {
  return (
    <div style={{ ...miniCard, width: 80, alignItems: "center", padding: "6px 8px" }}>
      <div
        style={{
          width: 52,
          height: 34,
          borderRadius: 8,
          background: "var(--tomato)",
          display: "grid",
          placeItems: "center",
          boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)"
        }}
      >
        <span
          style={{
            width: 0,
            height: 0,
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
            borderLeft: "12px solid #fff",
            marginLeft: 3
          }}
        />
      </div>
      <span style={{ ...monoLbl, marginTop: 4 }}>Videos</span>
    </div>
  );
}

function PrepIconClass() {
  return (
    <div style={{ ...miniCard, width: 86, gap: 5 }}>
      <span style={monoLbl}>In person</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[0, 1, 2, 3].map((seat) => (
              <span
                key={seat}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: row === 1 && seat === 1 ? "var(--tomato)" : "rgba(10,10,10,0.18)"
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrepIconApp() {
  return (
    <div style={{ ...miniCard, width: 72, alignItems: "center", padding: "5px 6px 6px" }}>
      <div
        style={{
          width: 34,
          height: 52,
          borderRadius: 7,
          border: "2px solid var(--ink)",
          padding: 4,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
          background: "#fff"
        }}
      >
        {["var(--blue)", "var(--mint)", "var(--tomato)", "var(--lagoon)"].map((color) => (
          <span
            key={color}
            style={{
              borderRadius: 2,
              background: color,
              minHeight: 10
            }}
          />
        ))}
      </div>
      <span style={{ ...monoLbl, marginTop: 4 }}>App / course</span>
    </div>
  );
}

function PrepIconLittleNone() {
  return (
    <div style={{ ...miniCard, width: 78 }}>
      <span style={monoLbl}>SAT</span>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "rgba(10,10,10,0.28)"
        }}
      >
        ? ?
      </div>
      <div
        style={{
          width: "100%",
          height: 4,
          marginTop: 4,
          background: "rgba(10,10,10,0.08)",
          borderRadius: 1
        }}
      />
    </div>
  );
}

const PREP_ICON_MAP: Record<string, () => ReactNode> = {
  prep_khan: PrepIconKhan,
  prep_bluebook: PrepIconBluebook,
  prep_youtube: PrepIconYoutube,
  prep_class: PrepIconClass,
  prep_app: PrepIconApp,
  prep_little_none: PrepIconLittleNone
};

export function PrepIcon({ id }: { id: string }) {
  const Comp = PREP_ICON_MAP[id];
  if (!Comp) return null;
  return (
    <div className="quiz-tile-art">
      <div className="worry-ico">
        <div className="worry-ico-box">
          <Comp />
        </div>
      </div>
    </div>
  );
}
