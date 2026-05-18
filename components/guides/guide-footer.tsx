import { site } from "@/lib/site";

/** Legal disclaimer only — no site links (standalone SAT funnel). */
export function GuideFooter() {
  return (
    <footer className="guide-funnel-footer border-t border-line/60 bg-ivory-100 px-5 py-8 sm:px-8">
      <p className="mx-auto max-w-3xl text-center text-[11.5px] leading-relaxed text-ink-muted">
        Free SAT parent guides · {site.name} · {site.location} · {site.satDate} exam · No
        guaranteed test scores or admission outcomes.
      </p>
    </footer>
  );
}
