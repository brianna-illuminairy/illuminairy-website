import { Logo } from "@/components/logo";

export function PlatformVisual() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="absolute inset-0 bg-hero-grid bg-[length:28px_28px] opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(91,124,255,0.18),transparent_28%),radial-gradient(circle_at_78%_70%,rgba(139,92,246,0.14),transparent_30%)]" />
      <div className="relative flex h-full min-h-[388px] flex-col justify-between rounded-xl border border-line/80 bg-white/78 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <Logo href="" compact />
          <span className="rounded-full border border-indigo/15 bg-indigo/5 px-3 py-1 text-xs font-medium text-indigo">
            Live cohort
          </span>
        </div>
        <div className="mx-auto grid w-full max-w-sm gap-3">
          <div className="rounded-xl border border-line bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="mb-3 h-2 w-24 rounded-full bg-indigo/20" />
            <div className="h-2 w-full rounded-full bg-slate-100" />
            <div className="mt-2 h-2 w-10/12 rounded-full bg-slate-100" />
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="h-16 rounded-lg bg-ink" />
              <div className="h-16 rounded-lg bg-indigo" />
              <div className="h-16 rounded-lg bg-electric" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">30</p>
              <p className="mt-1 text-xs text-slatecopy">live sessions</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">10</p>
              <p className="mt-1 text-xs text-slatecopy">student cap</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-1.5 rounded-full bg-indigo" />
          <div className="h-1.5 rounded-full bg-electric" />
          <div className="h-1.5 rounded-full bg-violet" />
        </div>
      </div>
    </div>
  );
}

export function IdentityPanel() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-ringed">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex min-h-36 items-center justify-center rounded-xl bg-ink p-6">
          <Logo href="" inverted />
        </div>
        <div className="flex min-h-36 items-center justify-center rounded-xl bg-cloud p-6">
          <Logo href="" />
        </div>
        <div className="rounded-xl border border-line p-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slatecopy">
            Favicon
          </p>
          <div className="mt-5 flex gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-sm font-semibold text-white">
              AI
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-white text-sm font-semibold text-indigo">
              AI
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-line p-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slatecopy">
            Palette
          </p>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {["#0B0D12", "#F8FAFC", "#475569", "#4F46E5", "#5B7CFF"].map(
              (color) => (
                <span
                  key={color}
                  className="h-12 rounded-lg border border-line"
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
