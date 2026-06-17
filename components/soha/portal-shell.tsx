"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";

/** Nada / Soha August 22 bootcamp — standard enroll page. */
export const SOHA_BOOTCAMP_ENROLL_PATH = "/enroll/nada-soha-aug22-bootcamp";

const NAV = [
  {
    href: "/soha/diagnostic",
    label: "Diagnostics",
    match: (path: string) => path.startsWith("/soha/diagnostic")
  },
  {
    href: "/soha/plan",
    label: "Study Plan",
    match: (path: string) => path === "/soha/plan"
  }
] as const;

function SohaEnrollCta() {
  return (
    <Link href={SOHA_BOOTCAMP_ENROLL_PATH} className="danielle-portal__practice-cta">
      Bootcamp enrollment
    </Link>
  );
}

function SohaPortalFooter() {
  return (
    <footer className="danielle-portal__footer">
      <p>
        Parents:{" "}
        <Link href={SOHA_BOOTCAMP_ENROLL_PATH} className="danielle-portal__footer-link">
          August 22 bootcamp enrollment
        </Link>
      </p>
      <p>© {new Date().getFullYear()} Illuminairy · Private student portal</p>
    </footer>
  );
}

function SohaHeaderNav({ pathname }: { pathname: string }) {
  return (
    <nav className="danielle-portal__nav" aria-label="Student portal">
      {NAV.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`danielle-portal__nav-link${active ? " is-active" : ""}`}
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
    <div className="danielle-portal">
      <header className="danielle-portal__header">
        <div className="danielle-portal__header-inner">
          <div className="danielle-portal__topbar">
            <Link href="/soha/diagnostic" className="danielle-portal__logo" aria-label="Illuminairy">
              <IlluminairyLogoV7 tone="on-dark" height={34} />
            </Link>
            <div className="danielle-portal__topbar-actions">
              <SohaEnrollCta />
            </div>
          </div>
          <SohaHeaderNav pathname={pathname} />
        </div>
      </header>
      <div className="danielle-portal__body">{children}</div>
      <SohaPortalFooter />
    </div>
  );
}

export function SohaLoginChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="danielle-portal danielle-portal--login">
      <header className="danielle-portal__header">
        <div className="danielle-portal__header-inner">
          <div className="danielle-portal__topbar">
            <span className="danielle-portal__logo" aria-label="Illuminairy">
              <IlluminairyLogoV7 tone="on-dark" height={34} />
            </span>
            <div className="danielle-portal__topbar-actions">
              <SohaEnrollCta />
            </div>
          </div>
        </div>
      </header>
      <div className="danielle-portal__login-wrap">{children}</div>
      <SohaPortalFooter />
    </div>
  );
}
