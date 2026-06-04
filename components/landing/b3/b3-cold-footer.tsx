"use client";

import Link from "next/link";
import { policyItems } from "@/lib/site";
import { landingDisclaimers } from "@/lib/landing/content";

/** Cold DR: legal only — no newsletter block or second CTA. */
export function B3ColdFooter() {
  return (
    <footer className="footer il-premium-footer il-cold-footer">
      <div className="il-premium-container">
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
