import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NorthStar, Wordmark } from "@/components/logo";
import { cohorts } from "@/lib/site";

/** Hero card — what's live and what's next. */
export function CohortsPanel() {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-line bg-ivory-50 p-5 shadow-editorial sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(196,154,24,0.14),transparent_65%)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow text-gold-deep">Programs</p>
          <NorthStar size={22} tone="ivory" glow={false} />
        </div>
        <ul className="mt-5 grid gap-3">
          {cohorts.map((c) => (
            <li key={c.name}>
              <Link
                href={c.href}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-ivory p-4 transition hover:border-gold/35 hover:shadow-gold"
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    c.status === "live"
                      ? "bg-gold/15 text-gold-deep"
                      : "bg-ink/5 text-ink-muted"
                  }`}
                >
                  {c.statusLabel}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-semibold tracking-[-0.015em] text-ink">
                      {c.name}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-ink-muted transition group-hover:text-gold-deep"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 block text-[13px] text-ink-soft">
                    {c.when} · {c.audience}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PlatformVisual() {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-line bg-ivory-50 p-6 shadow-editorial sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-north-star opacity-80" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(196,154,24,0.18),transparent_70%)]" />

      <div className="relative flex min-h-[480px] flex-col justify-between rounded-2xl border border-line/80 bg-ivory p-7">
        {/* Top: small voice */}
        <div className="flex items-center justify-between">
          <p className="eyebrow text-gold-deep">North Star</p>
          <p className="eyebrow text-ink-muted">Level 02 · in progress</p>
        </div>

        {/* Center: the brand */}
        <div className="-mt-6 flex flex-col items-center gap-6 text-center">
          <NorthStar size={68} tone="ivory" glow={false} className="north-star-pulse" />
          <Wordmark size="lg" tone="ink" />
          <p className="max-w-xs text-[15px] leading-[1.55] text-ink-soft">
            premium mentorship <br />
            <span className="text-ink">and applied learning</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="h-1.5 rounded-full bg-gold" />
          <div className="h-1.5 rounded-full bg-gold/45" />
          <div className="h-1.5 rounded-full bg-gold/20" />
        </div>
      </div>
    </div>
  );
}

export function IdentityPanel() {
  const palette = [
    { name: "Ivory", hex: "#FAF6F0", text: "text-ink", bg: "bg-ivory" },
    { name: "Ink", hex: "#16120A", text: "text-ivory", bg: "bg-ink" },
    { name: "Navy", hex: "#131C32", text: "text-ivory", bg: "bg-navy" },
    { name: "Gold", hex: "#C49A18", text: "text-ink", bg: "bg-gold" },
    { name: "Marigold", hex: "#E09318", text: "text-marigold-ink", bg: "bg-marigold" },
    { name: "Sage", hex: "#5F9E82", text: "text-sage-ink", bg: "bg-sage" },
    { name: "Terracotta", hex: "#C4623E", text: "text-terracotta-ink", bg: "bg-terracotta" },
    { name: "Sky", hex: "#5A8EB8", text: "text-sky-ink", bg: "bg-sky" }
  ];

  return (
    <div className="rounded-3xl border border-line bg-ivory-50 p-5 shadow-editorial sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Lockup on navy */}
        <div className="flex min-h-44 items-center justify-center rounded-2xl bg-navy-gradient p-8">
          <span className="flex items-center gap-3">
            <NorthStar size={36} tone="ivory" glow />
            <Wordmark size="lg" tone="ivory" />
          </span>
        </div>
        {/* Lockup on ivory */}
        <div className="flex min-h-44 items-center justify-center rounded-2xl border border-line bg-ivory p-8">
          <span className="flex items-center gap-3">
            <NorthStar size={36} tone="ink" glow={false} />
            <Wordmark size="lg" tone="ink" />
          </span>
        </div>

        {/* Wordmark detail */}
        <div className="rounded-2xl border border-line bg-ivory p-6 sm:col-span-2">
          <p className="eyebrow text-gold-deep">Wordmark · the ai is discovered</p>
          <p className="mt-5 text-[44px] leading-none wordmark text-ink sm:text-[64px]">
            illumin<span className="wordmark__ai">ai</span>ry
          </p>
          <p className="mt-5 max-w-md text-[14px] leading-[1.6] text-ink-soft">
	            The AI lives quietly inside the name — gold against warm ink, earned rather than declared.
          </p>
        </div>

        {/* Palette */}
        <div className="rounded-2xl border border-line bg-ivory p-6 sm:col-span-2">
          <p className="eyebrow text-ink-soft">Palette</p>
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {palette.map((swatch) => (
              <div
                key={swatch.hex}
                className={`flex aspect-square flex-col items-start justify-end rounded-xl p-2.5 ${swatch.bg} ${swatch.text}`}
                aria-label={`${swatch.name} ${swatch.hex}`}
              >
                <span className="text-[10px] font-semibold leading-tight">{swatch.name}</span>
                <span className="text-[9px] font-medium uppercase tracking-wider opacity-80">
                  {swatch.hex.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
