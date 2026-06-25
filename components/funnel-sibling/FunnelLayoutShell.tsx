import type { ReactNode } from "react";
import { funnelFontClassName } from "@/lib/funnel-fonts";
import { QFFunnelLegal } from "@/app/quiz/components/QFFunnelLegal";

type FunnelLayoutShellProps = {
  children: ReactNode;
  rootClassName?: string;
  showLegal?: boolean;
  head?: ReactNode;
  useFunnelFont?: boolean;
};

/**
 * Shared funnel chrome: root → column → fill (+ optional legal).
 * All funnels sync-import funnel-responsive.css in their layout.tsx.
 */
export function FunnelLayoutShell({
  children,
  rootClassName = "",
  showLegal = true,
  head,
  useFunnelFont = true,
}: FunnelLayoutShellProps) {
  const rootClass = ["qf-funnel-root", useFunnelFont ? funnelFontClassName : "", rootClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {head}
      <div className={rootClass}>
        <div className="qf-funnel-column">
          <div className="qf-funnel-fill">{children}</div>
          {showLegal ? <QFFunnelLegal /> : null}
        </div>
      </div>
    </>
  );
}
