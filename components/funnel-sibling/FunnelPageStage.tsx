import type { ReactNode } from "react";

type FunnelPageStageProps = {
  entryShell?: ReactNode;
  children: ReactNode;
};

/** Wraps SSR entry shell + client runner in the shared stage container. */
export function FunnelPageStage({ entryShell, children }: FunnelPageStageProps) {
  return (
    <div className="qf-funnel-stage">
      {entryShell}
      {children}
    </div>
  );
}
