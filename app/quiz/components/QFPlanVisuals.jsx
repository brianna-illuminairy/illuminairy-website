'use client';

const SOPHIA_PLAN_SKILLS = [
  { rank: '01', name: 'Linear Functions', pts: 50 },
  { rank: '02', name: 'Right Triangles', pts: 45 },
  { rank: '03', name: 'Quadratics', pts: 40 },
  { rank: '04', name: 'Word Problems', pts: 35 },
  { rank: '05', name: 'Functions & Graphs', pts: 30 },
];

/** Sophia-style ranked plan card — hero on i-method; annotated on i-steps. */
export function QFSophiaPlanCard({ compact = false }) {
  const maxPts = 50;
  const totalGain = SOPHIA_PLAN_SKILLS.reduce((s, x) => s + x.pts, 0);

  return (
    <div style={{
      background: 'var(--qf-paper)',
      border: '1px solid var(--qf-line)',
      borderRadius: compact ? 14 : 18,
      overflow: 'hidden',
      boxShadow: compact
        ? '0 8px 24px rgba(20,32,46,0.10)'
        : '0 10px 30px rgba(20,32,46,0.12)',
      width: '100%',
    }}>
      <div style={{
        background: 'var(--qf-ink)', padding: compact ? '14px 16px' : '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--qf-mono)', fontSize: 9, letterSpacing: '0.22em',
            color: 'rgba(245,248,250,0.55)', textTransform: 'uppercase', fontWeight: 600,
          }}>
            {compact ? '12-week plan' : 'illuminairy plan'}
          </div>
          <div style={{
            fontFamily: 'var(--qf-display)', fontSize: compact ? 16 : 18, fontWeight: 500,
            color: '#fff', marginTop: 3, letterSpacing: '-0.01em',
          }}>Sophia M.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--qf-mono)', fontSize: 9, letterSpacing: '0.18em',
            color: 'rgba(245,248,250,0.55)', textTransform: 'uppercase', fontWeight: 600,
          }}>Goal</div>
          <div style={{
            fontFamily: 'var(--qf-display)', fontSize: compact ? 18 : 20, fontWeight: 600,
            color: 'var(--qf-glow)', marginTop: 2, letterSpacing: '-0.01em',
          }}>1400</div>
        </div>
      </div>

      <div style={{ padding: compact ? '4px 0' : '6px 0' }}>
        {SOPHIA_PLAN_SKILLS.map((s, i) => {
          const fillPct = (s.pts / maxPts) * 100;
          return (
            <div key={s.rank} style={{
              display: 'grid', gridTemplateColumns: '34px 1fr 52px',
              alignItems: 'center', gap: 12,
              padding: compact ? '12px 16px' : '14px 20px',
              borderTop: i > 0 ? '1px solid var(--qf-line)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--qf-mono)', fontSize: 11,
                color: 'var(--qf-forest)', fontWeight: 600, letterSpacing: '0.08em',
              }}>{s.rank}</div>
              <div>
                <div style={{
                  fontFamily: 'var(--qf-display)', fontSize: compact ? 13.5 : 14.5, fontWeight: 500,
                  color: 'var(--qf-ink)', letterSpacing: '-0.005em', marginBottom: 6,
                }}>{s.name}</div>
                <div style={{
                  height: 6, background: 'rgba(20,32,46,0.08)', borderRadius: 3, overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${fillPct}%`, height: '100%',
                    background: 'linear-gradient(to right, var(--qf-forest), var(--qf-glow))',
                    borderRadius: 3,
                  }} />
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--qf-mono)', fontSize: 12,
                color: 'var(--qf-forest)', fontWeight: 600, letterSpacing: '0.04em',
                textAlign: 'right',
              }}>+{s.pts}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: 'var(--qf-forest-soft)',
        padding: compact ? '10px 16px' : '12px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(47,110,71,0.25)',
      }}>
        <span style={{
          fontFamily: 'var(--qf-mono)', fontSize: 10, letterSpacing: '0.16em',
          color: 'var(--qf-forest)', fontWeight: 600, textTransform: 'uppercase',
        }}>Personalized plan · +{totalGain} pts</span>
        <span style={{
          fontFamily: 'var(--qf-display)', fontSize: 14, color: 'var(--qf-forest)',
          fontWeight: 600, letterSpacing: '-0.005em',
        }}>1180 → 1400</span>
      </div>
    </div>
  );
}

/** Before/after score reports — social proof on Results insight. */
export function QFScoreReportPair({ className = '' }) {
  return (
    <div className={className} style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      width: '100%', maxWidth: 280, margin: '0 auto',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{
          aspectRatio: '4 / 5', borderRadius: 12, overflow: 'hidden',
          position: 'relative', background: '#1f4099',
        }}>
          <img
            src="/photos/before-score-report.png"
            alt="Score report before: 1180"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 32%', display: 'block',
            }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div style={{
          aspectRatio: '4 / 5', borderRadius: 12, overflow: 'hidden',
          position: 'relative', background: '#1f4099',
        }}>
          <img
            src="/photos/score-report.png"
            alt="Score report after: 1410"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 32%', display: 'block',
            }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
      <div style={{
        textAlign: 'center',
        fontFamily: 'var(--qf-body)', fontSize: 14, lineHeight: 1.4,
        color: 'var(--qf-forest)', fontWeight: 600,
      }}>
        1180 <span style={{ color: 'var(--qf-ink-mute)', fontWeight: 500 }}>→</span> 1410{' '}
        <span style={{ color: 'var(--qf-ink-mute)', fontWeight: 500 }}>·</span> +230 pts
      </div>
    </div>
  );
}
