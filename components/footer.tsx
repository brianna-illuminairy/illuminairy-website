import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { navItems, policyItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-slatecopy">
            Illuminairy is a premium education and mentorship company building
            structured learning experiences for ambitious students and
            professionals.
          </p>
          <p className="mt-5 text-xs leading-5 text-slatecopy">
            Operated by {site.legalName}. Statement descriptor: {site.descriptor}.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Company</h2>
          <div className="mt-4 grid gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-slatecopy hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Policies</h2>
          <div className="mt-4 grid gap-3">
            {policyItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-slatecopy hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Customer support</h2>
          <div className="mt-4 grid gap-3 text-sm text-slatecopy">
            <a className="inline-flex items-center gap-2 hover:text-ink" href={`mailto:${site.supportEmail}`}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {site.supportEmail}
            </a>
            <a className="inline-flex items-center gap-2 hover:text-ink" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phone}
            </a>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {site.location}, United States
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-line pt-6 text-xs text-slatecopy sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Illuminairy. All rights reserved.</p>
        <p>Virtual educational services. No guaranteed test score or admissions outcome.</p>
      </div>
    </footer>
  );
}
