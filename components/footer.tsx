import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { navItems, policyItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-ivory-50 px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-[15px] leading-[1.6] text-ink-soft">
            {site.tagline}. Premium near-peer mentorship — SAT cohorts live now,
            with more programs opening soon.
          </p>
          <p className="mt-6 text-xs leading-5 text-ink-muted">
            Operated by {site.legalName}.
          </p>
          <div id="newsletter" className="mt-8 scroll-mt-28">
            <NewsletterSignup compact />
          </div>
        </div>
        <div>
          <p className="eyebrow text-ink-soft">Company</p>
          <div className="mt-5 grid gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] text-ink-soft transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow text-ink-soft">Policies</p>
          <div className="mt-5 grid gap-3">
            {policyItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] text-ink-soft transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow text-ink-soft">Customer support</p>
          <div className="mt-5 grid gap-3 text-[14px] text-ink-soft">
            <a className="inline-flex items-center gap-2 transition hover:text-ink" href={`mailto:${site.supportEmail}`}>
              <Mail className="h-4 w-4 text-gold-deep" aria-hidden="true" />
              {site.supportEmail}
            </a>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-deep" aria-hidden="true" />
              {site.location}, United States
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-line/70 pt-7 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Illuminairy. All rights reserved.</p>
        <p>Virtual educational services. No guaranteed test score or admissions outcome.</p>
      </div>
    </footer>
  );
}
