import { redirect } from "next/navigation";
import { AlertsFeed } from "@/components/admin/alerts-feed";
import { getOverviewKpis } from "@/lib/admin/crm-queries";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import Link from "next/link";

export const metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false }
};

export default async function AdminOverviewPage() {
  if (!isAdminConfigured()) {
    redirect("/admin/login");
  }
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/admin");
  }

  const kpis = await getOverviewKpis();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Alerts, quick KPIs, and links into each module.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold">Alerts</h2>
        <div className="mt-4">
          <AlertsFeed />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Leads", kpis.leads, "/admin/crm"],
          ["Books", kpis.books, "/admin/crm"],
          ["Enrollments", kpis.enrollments, "/admin/finance"],
          ["Clients", kpis.clients, "/admin/crm"],
          ["Open alerts", kpis.openAlerts, "/admin"]
        ].map(([label, value, href]) => (
          <Link
            key={String(label)}
            href={String(href)}
            className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Marketing", "Funnel drop-offs and campaign quality", "/admin/marketing"],
          ["CRM", "Leads, bookings, show rate", "/admin/crm"],
          ["Finance", "Revenue, costs, margin per client", "/admin/finance"],
          ["Ads", "Meta spend vs CRM outcomes", "/admin/ads"],
          ["Automations", "Client lifecycle workflows", "/admin/automations"]
        ].map(([title, desc, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-border bg-surface p-5 hover:border-primary/40"
          >
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
