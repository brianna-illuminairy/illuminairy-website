import { redirect } from "next/navigation";
import { AdminPlatformShell } from "@/components/admin/admin-platform-shell";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export default async function AdminPlatformLayout({
  children
}: {
  children: React.ReactNode;
}) {
  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Set <code>ADMIN_SECRET</code> in the environment to enable the business platform.
        </p>
      </main>
    );
  }

  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login?next=/admin");
  }

  return <AdminPlatformShell>{children}</AdminPlatformShell>;
}
