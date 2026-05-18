import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  if (!isAdminConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-[15px] text-ink-soft">
          Admin is not configured. Set <code className="text-ink">ADMIN_SECRET</code>{" "}
          in your environment.
        </p>
      </div>
    );
  }

  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[60vh] bg-ivory-200/40">
      <nav className="border-b border-line bg-ivory px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6">
          <Link href="/admin/leads" className="text-[14px] font-semibold text-ink">
            Leads
          </Link>
          <Link href="/admin/clients" className="text-[14px] font-semibold text-ink">
            Clients
          </Link>
          <Link href="/" className="ml-auto text-[13px] text-ink-muted hover:text-ink">
            ← Site
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
