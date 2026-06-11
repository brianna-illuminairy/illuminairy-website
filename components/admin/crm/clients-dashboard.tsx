"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ParentsList } from "./parents-list";
import { StudentsList } from "./students-list";

type Tab = "parents" | "students";

const TABS: Array<{ id: Tab; label: string; sub: string }> = [
  { id: "parents", label: "Parents", sub: "One row per paying family" },
  { id: "students", label: "Students", sub: "One row per kid, parent linked" }
];

export function ClientsDashboard() {
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window === "undefined") return "parents";
    const params = new URLSearchParams(window.location.search);
    const v = (params.get("view") ?? "parents") as Tab;
    return TABS.find((x) => x.id === v) ? v : "parents";
  });

  const setTabAndUrl = useCallback((v: Tab) => {
    setTab(v);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", v);
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  // Optional: respond to back/forward navigation
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const v = (params.get("view") ?? "parents") as Tab;
      if (TABS.find((x) => x.id === v)) setTab(v);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">{activeTab.sub}</p>
        </div>
        <Link
          href="/admin/crm"
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          ← Back to leads
        </Link>
      </header>

      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setTabAndUrl(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "parents" ? <ParentsList /> : null}
      {tab === "students" ? <StudentsList /> : null}
    </div>
  );
}
