import { getInvestmentBudgetConfirmationCopy } from "@/lib/sat-qualification";

type FunnelBudgetBandConfirmProps = {
  onContinue: () => void;
  onDecline: () => void;
  disabled?: boolean;
};

/** Shown when parent selects $500–$1k band — tuition gap + optional pay-over-time */
export function FunnelBudgetBandConfirm({
  onContinue,
  onDecline,
  disabled = false
}: FunnelBudgetBandConfirmProps) {
  const copy = getInvestmentBudgetConfirmationCopy();

  return (
    <div
      className="grid gap-4 rounded-2xl border border-gold/40 bg-ivory-50 p-5"
      role="region"
      aria-labelledby="budget-confirm-title"
    >
      <h2
        id="budget-confirm-title"
        className="font-serif text-[1.15rem] tracking-[-0.02em] text-ink"
      >
        {copy.title}
      </h2>
      <p className="text-[14px] leading-relaxed text-ink-soft">{copy.lead}</p>
      <p className="text-[14px] leading-relaxed text-ink-soft">{copy.payment}</p>
      <p className="text-[14px] font-medium text-ink">{copy.prompt}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onContinue}
          className="min-h-12 rounded-xl border border-ink bg-ink px-4 text-[14px] font-semibold text-ivory disabled:opacity-60"
        >
          {copy.ctaYes}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onDecline}
          className="min-h-12 rounded-xl border border-line-strong px-4 text-[14px] font-semibold text-ink disabled:opacity-60"
        >
          {copy.ctaNo}
        </button>
      </div>
    </div>
  );
}
