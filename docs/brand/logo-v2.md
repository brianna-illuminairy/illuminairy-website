# Logo v2 — Illuminairy mark

*2026-05-19 · YC startup visual system*

## Concept

The mark is an **upward path with illumination at the apex**:

| Element | Meaning |
|---------|---------|
| Indigo path + nodes | Near-peer mentorship journey — someone one step ahead, then the next |
| Gold apex + glow | **Illuminate** + **luminary** — the outcome lit, not just knowledge collected |
| No box in UI lockup | Mark sits on `surface` in header; app icon uses midnight tile |

This replaces the v1 **North Star** (parent-ed / candlelight era) for the platform launch cut.

## Files

| File | Use |
|------|-----|
| [`public/icon.svg`](../../public/icon.svg) | Favicon / PWA (64×64, dark tile) |
| [`public/apple-icon.svg`](../../public/apple-icon.svg) | Apple touch icon |
| [`public/logo-mark.svg`](../../public/logo-mark.svg) | Mark only, transparent background |
| [`public/logo-lockup.svg`](../../public/logo-lockup.svg) | Mark + wordmark for decks / exports |
| [`components/logo.tsx`](../../components/logo.tsx) | React `IlluminairyMark` + `Wordmark` |

## Colors

| Role | Light UI | Dark tile (icon) |
|------|----------|------------------|
| Path / nodes | `#6366F1` / `#4F46E5` | `#818CF8` / `#4F46E5` |
| Illumination | `#C49A18` | `#D4AF3A` |
| Tile background | — | `#0A0A0F` |

Wordmark: **illumin** + gold **ai** + **ry** — unchanged brand discovery moment.

## Do not

- Use the old gold 4-point star on new platform pages
- Put gold everywhere (accent only at apex + wordmark `ai`)
- Add graduation caps, books, or robot motifs
