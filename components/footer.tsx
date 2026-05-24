import Link from "next/link";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 py-12 no-print sm:px-6">
      <div className="mx-auto flex max-w-content flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo size="sm" />
          <p className="mt-4 max-w-sm text-sm text-primary-muted">
            {site.tagline}. Operated by {site.legalName}.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:items-end">
          <Link
            href={`mailto:${site.supportEmail}`}
            className="text-sm text-primary-muted transition hover:text-accent"
          >
            {site.supportEmail}
          </Link>
          <p className="text-xs text-primary-muted">
            © {new Date().getFullYear()} Illuminairy
          </p>
        </div>
      </div>
    </footer>
  );
}
