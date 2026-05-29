"use client";

import { useId } from "react";

type LogoTone = "on-dark" | "on-light";

/**
 * Logo v7b — from illuminairy_logos_v7.html (straight text, arc below, star cluster left).
 * Use `on-dark` on navy/deep chrome; `on-light` on white/paper.
 */
export function IlluminairyLogoV7({
  tone = "on-dark",
  height = 36,
  className = ""
}: {
  tone?: LogoTone;
  height?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const arcId = `logo-arc-${uid}`;
  const starId = `logo-star-${uid}`;
  const textFill = tone === "on-dark" ? "#F5F8FA" : "#181818";
  const width = Math.round(height * (340 / 100));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 340 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illuminairy"
    >
      <title>Illuminairy</title>
      <defs>
        <linearGradient id={arcId} x1="0" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0057A8" stopOpacity="0" />
          <stop offset="10%" stopColor="#0057A8" stopOpacity="0.9" />
          <stop offset="44%" stopColor="#3D9BBF" />
          <stop offset="90%" stopColor="#77C89A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#77C89A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={starId} x1="-11" y1="-11" x2="11" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8F5D1" />
          <stop offset="100%" stopColor="#77C89A" />
        </linearGradient>
      </defs>
      <text
        x="52"
        y="58"
        fontFamily="var(--font-dm-sans), 'DM Sans', system-ui, sans-serif"
        fontWeight="300"
        fontSize="44"
        letterSpacing="5"
        fill={textFill}
      >
        Illuminairy
      </text>
      <path
        d="M 0 74 Q 170 56 340 70"
        stroke={`url(#${arcId})`}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <g transform="translate(20,24) rotate(10)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke={`url(#${starId})`} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke={`url(#${starId})`} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="-7" y1="-7" x2="7" y2="7" stroke={`url(#${starId})`} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="7" y1="-7" x2="-7" y2="7" stroke={`url(#${starId})`} strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g transform="translate(34,12) rotate(-5)">
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#77C89A" strokeWidth="1.5" strokeLinecap="round" opacity="0.82" />
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#77C89A" strokeWidth="1.5" strokeLinecap="round" opacity="0.82" />
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="#77C89A" strokeWidth="1.1" strokeLinecap="round" opacity="0.82" />
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="#77C89A" strokeWidth="1.1" strokeLinecap="round" opacity="0.82" />
      </g>
      <g transform="translate(8,38) rotate(15)">
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#0057A8" strokeWidth="1.3" strokeLinecap="round" opacity="0.72" />
        <line x1="-4" y1="0" x2="4" y2="0" stroke="#0057A8" strokeWidth="1.3" strokeLinecap="round" opacity="0.72" />
        <line x1="-2.8" y1="-2.8" x2="2.8" y2="2.8" stroke="#0057A8" strokeWidth="0.9" strokeLinecap="round" opacity="0.72" />
        <line x1="2.8" y1="-2.8" x2="-2.8" y2="2.8" stroke="#0057A8" strokeWidth="0.9" strokeLinecap="round" opacity="0.72" />
      </g>
    </svg>
  );
}
