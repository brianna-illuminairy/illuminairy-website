import Link from "next/link";
import { policyItems } from "@/lib/site";
import { landingDisclaimers } from "@/lib/landing/content";

/** v4 footer styling, canonical legal links + disclaimer from lib. */
export function V4Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <ul className="links">
          {policyItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <p className="legal">{landingDisclaimers.footer}</p>
        <p className="copy">© {new Date().getFullYear()} Illuminairy.</p>
      </div>
    </footer>
  );
}
