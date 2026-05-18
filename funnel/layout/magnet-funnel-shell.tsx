import type { ReactNode } from "react";

/** Full-bleed growth LP — no blog chrome, no site header. */
export function MagnetFunnelShell({ children }: { children: ReactNode }) {
  return <div className="magnet-funnel min-h-dvh">{children}</div>;
}
