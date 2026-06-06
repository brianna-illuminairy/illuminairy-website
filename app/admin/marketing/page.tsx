import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { MarketingDashboard } from "@/components/admin/marketing-dashboard";

export const metadata = {
  title: "Marketing dashboard",
  robots: { index: false, follow: false }
};

export default async function AdminMarketingPage() {
  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-xl font-semibold">Marketing dashboard</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Set <code>ADMIN_SECRET</code> in the environment to enable this page.
        </p>
      </main>
    );
  }

  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login?next=/admin/marketing");
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <MarketingDashboard />
    </main>
  );
}
