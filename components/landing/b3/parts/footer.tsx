import Link from "next/link";
import { policyItems } from "@/lib/site";
import { landingDisclaimers, landingShared } from "@/lib/landing/content";

export function LandingFooter() {
  return (
    <footer className="footer il-premium-footer">
      <div className="il-premium-container">
        <div className="foot-head">{landingShared.footer.head}</div>
        <div className="il-footer-rule" aria-hidden />
        <nav className="links" aria-label="Legal">
          {policyItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="footer-legal">{landingDisclaimers.footer}</p>
        <p className="footer-copy">© {new Date().getFullYear()} Illuminairy.</p>
      </div>
    </footer>
  );
}
