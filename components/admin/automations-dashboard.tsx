"use client";

import { AUTOMATION_CATALOG } from "@/lib/admin/automation-catalog";

export function AutomationsDashboard() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Automations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Client lifecycle workflows. Catalog only in v1 — configure and run when each
          dependency is wired.
        </p>
      </header>

      <div className="grid gap-6">
        {AUTOMATION_CATALOG.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                  Coming soon
                </p>
                <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
              <button
                type="button"
                disabled
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                Configure
              </button>
            </div>

            <p className="mt-4 text-sm">
              <span className="font-medium">Trigger:</span> {item.trigger}
            </p>

            <p className="mt-2 flex flex-wrap gap-2">
              {item.dependencies.map((dep) => (
                <span
                  key={dep}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {dep}
                </span>
              ))}
            </p>

            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              {item.steps.map((step) => (
                <li key={step.id}>{step.label}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
