"use client";

import type { ReactNode } from "react";
import { landingHeroes, landingShared } from "@/lib/landing/content";
import { landingPhotoSlots } from "@/lib/landing/assets";
import { HeroCta } from "../parts/cta";
import { B3aHeroMediaGrid, HeroMediaGrid } from "../parts/hero-media-grid";

type HeroProps = {
  onStart: () => void;
};

function HeroShell({
  heroKey,
  onStart,
  media,
  stats
}: {
  heroKey: keyof typeof landingHeroes;
  onStart: () => void;
  media: ReactNode;
  stats?: ReactNode;
}) {
  const hero = landingHeroes[heroKey];
  const hasEyebrow = "eyebrow" in hero;

  return (
    <div className="il-hero-grid">
      <div className="il-hero-main">
        <section className="section il-hero-section">
          {hasEyebrow ? (
            <div className="num-badge il-hero-eyebrow">{hero.eyebrow}</div>
          ) : null}
          <h1
            className={
              heroKey === "b3c-authority" ? "il-h1 il-h1-authority" : "il-h1"
            }
          >
            {heroKey === "b3c-authority" ? (
              <>
                {hero.headline[0]}
                <br />
                <span className="accent">{hero.headline[1]}</span>
              </>
            ) : (
              hero.headline.map((line, i) => (
                <span key={line} className={i === hero.accentLine ? "accent" : undefined}>
                  {line}
                  {i < hero.headline.length - 1 && <br />}
                </span>
              ))
            )}
          </h1>
          <ul className="checklist il-hero-checklist">
            {hero.checklist.map((item) => (
              <li key={item}>
                <span className="check" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        {stats ? <div className="il-hero-stats">{stats}</div> : null}
        <div className="il-hero-cta-wrap">
          <HeroCta copy={hero.ctaCopy} cta={landingShared.heroCtaLabel} onClick={onStart} />
        </div>
      </div>
      <div className="il-hero-media">
        {media}
        <p className="disclaimer">{hero.disclaimer}</p>
      </div>
    </div>
  );
}

export function B3aHero({ onStart }: HeroProps) {
  return (
    <HeroShell
      heroKey="b3a-problem"
      onStart={onStart}
      media={<B3aHeroMediaGrid />}
    />
  );
}

export function B3bHero({ onStart }: HeroProps) {
  const hero = landingHeroes["b3b-results"];
  return (
    <HeroShell
      heroKey="b3b-results"
      onStart={onStart}
      stats={<StatRowInline items={hero.stats} />}
      media={<B3aHeroMediaGrid />}
    />
  );
}

export function B3cHero({ onStart }: HeroProps) {
  return (
    <HeroShell
      heroKey="b3c-authority"
      onStart={onStart}
      media={
        <HeroMediaGrid
          primary={{
            slotLabel: "lp-b3c-data.jpg",
            src: landingPhotoSlots.b3cHero,
            alt: "SAT score improvement data"
          }}
          secondary={{
            slotLabel: "lp-b3a-session.jpg",
            src: landingPhotoSlots.b3aHeroSession,
            alt: "SAT tutor session online"
          }}
        />
      }
    />
  );
}

function StatRowInline({
  items
}: {
  items: readonly { num: string; lbl: string; accent?: boolean }[];
}) {
  return (
    <div className="stat-grid">
      {items.map((s) => (
        <div className="stat" key={s.lbl}>
          <div className={`num ${s.accent ? "accent" : ""}`}>{s.num}</div>
          <div className="lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}
