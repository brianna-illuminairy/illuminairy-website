/** Site legal strip only — not step CTAs. */
export function QFFunnelLegal() {
  return (
    <div className="qf-funnel-legal" aria-label="Legal">
      <a href="/privacy">Privacy</a>
      <span aria-hidden="true"> · </span>
      <a href="/terms">Terms</a>
    </div>
  );
}
