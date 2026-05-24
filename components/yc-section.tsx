import type { ReactNode } from "react";

export function YcSection({
  id,
  children,
  className = ""
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-5 py-16 sm:px-6 sm:py-20 ${className}`.trim()}>
      <div className="mx-auto max-w-content">{children}</div>
    </section>
  );
}
