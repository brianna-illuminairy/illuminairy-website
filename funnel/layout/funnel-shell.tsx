import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

export function FunnelShell({
  children,
  footer
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <header className="border-b border-line bg-ivory/95 px-5 py-4 backdrop-blur-sm sm:px-8">
        <Logo size="sm" />
      </header>
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
