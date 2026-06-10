"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_NAV } from "@/lib/admin/platform-nav";

function navActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminPlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    void fetch("/api/admin/alerts?count=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { count?: number } | null) => {
        if (json && typeof json.count === "number") setAlertCount(json.count);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Illuminairy
            </p>
            <p className="text-lg font-semibold tracking-tight">Business platform</p>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {ADMIN_NAV.map((item) => {
              const active = navActive(pathname, item.href, "exact" in item && item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {item.href === "/admin" && alertCount > 0 ? (
                    <span className="ml-1.5 inline-flex min-w-[1.25rem] justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">
                      {alertCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
