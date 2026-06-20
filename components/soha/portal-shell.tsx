"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";

/** Nada / Soha August 22 bootcamp — standard enroll page. */
export const SOHA_BOOTCAMP_ENROLL_PATH = "/enroll/nada-soha-aug22-bootcamp";

const NAV = [
  {
    href: "/soha/profile",
    label: "Profile",
    match: (path: string) => path.startsWith("/soha/profile"),
  },
  {
    href: "/soha/diagnostic",
    label: "Diagnostic",
    match: (path: string) => path.startsWith("/soha/diagnostic"),
  },
  {
    href: "/soha/plan",
    label: "SAT Improvement Plan",
    match: (path: string) => path === "/soha/plan",
  },
] as const;

function SohaEnrollCta() {
  return (
    <Link href={SOHA_BOOTCAMP_ENROLL_PATH} className="aurora-btn-ghost">
      Bootcamp enrollment
    </Link>
  );
}

function SohaPortalFooter() {
  return (
    <footer className="aurora-footer">
      <div className="aurora-footer__inner">
        <p className="aurora-footer__legal">
          Parents:{" "}
          <Link href={SOHA_BOOTCAMP_ENROLL_PATH} style={{ color: "var(--aurora-green)" }}>
            August 22 bootcamp enrollment
          </Link>
        </p>
        <p className="aurora-footer__legal" style={{ marginTop: "8px" }}>
          © {new Date().getFullYear()} Illuminairy · Private student portal
        </p>
      </div>
    </footer>
  );
}

function SohaHeaderNav({ pathname }: { pathname: string }) {
  return (
    <nav className="aurora-nav" aria-label="Student portal">
      {NAV.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`aurora-nav__link${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SohaPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="aurora-portal">
      <header className="aurora-header">
        <div className="aurora-header__inner" style={{ flexDirection: "column", alignItems: "stretch" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", width: "100%" }}>
            <Link href="/soha/profile" aria-label="Illuminairy">
              <IlluminairyLogoV7 tone="on-dark" height={34} />
            </Link>
            <SohaEnrollCta />
          </div>
          <SohaHeaderNav pathname={pathname} />
        </div>
      </header>
      <div className="aurora-body-wrap">{children}</div>
      <SohaPortalFooter />
    </div>
  );
}

export function SohaLoginChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="aurora-portal aurora-portal--login">
      <header className="aurora-header">
        <div className="aurora-header__inner">
          <span aria-label="Illuminairy">
            <IlluminairyLogoV7 tone="on-dark" height={34} />
          </span>
          <SohaEnrollCta />
        </div>
      </header>
      <div className="aurora-body-wrap">{children}</div>
      <SohaPortalFooter />
    </div>
  );
}
