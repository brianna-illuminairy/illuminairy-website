"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import { PortalProfileChip } from "@/components/portal/portal-profile-chip";
import type { PortalProfile } from "@/lib/portal/load-dashboard";

const TABS = [
  {
    href: "/portal/home",
    label: "Home",
    match: (path: string) => path === "/portal/home" || path === "/portal",
  },
  {
    href: "/portal/files",
    label: "Files",
    match: (path: string) => path.startsWith("/portal/files"),
  },
  {
    href: "/portal/diagnostic",
    label: "Diagnostic Report",
    match: (path: string) => path.startsWith("/portal/diagnostic"),
  },
  {
    href: "/portal/plan",
    label: "Plan",
    match: (path: string) => path.startsWith("/portal/plan"),
  },
] as const;

type Props = {
  profile: PortalProfile;
  children: React.ReactNode;
};

export function PortalShell({ profile, children }: Props) {
  const pathname = usePathname() ?? "";

  return (
    <div className="portal-app">
      <header className="portal-app__header">
        <div className="portal-app__header-row">
          <Link href="/portal/home" className="portal-app__logo" aria-label="Illuminairy home">
            <IlluminairyLogoV7 tone="on-light" height={30} />
          </Link>
          <PortalProfileChip profile={profile} />
        </div>

        <div className="portal-app__program-row">
          <h1 className="portal-app__program-title">SAT program</h1>
        </div>

        <nav className="portal-app__tabs" aria-label="Portal sections">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={active ? "portal-app__tab portal-app__tab--active" : "portal-app__tab"}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="portal-app__main">{children}</main>

      <nav className="portal-app__bottom" aria-label="Program navigation">
        <Link href="/portal/home" className="portal-app__bottom-item portal-app__bottom-item--active">
          <span className="portal-app__bottom-icon" aria-hidden="true">
            📘
          </span>
          SAT
        </Link>
        <span className="portal-app__bottom-item portal-app__bottom-item--disabled" aria-disabled="true">
          <span className="portal-app__bottom-icon" aria-hidden="true">
            ✨
          </span>
          Enroll
        </span>
      </nav>
    </div>
  );
}

export function PortalLoginChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-app portal-app--login">
      <header className="portal-app__header portal-app__header--login">
        <IlluminairyLogoV7 tone="on-light" height={30} />
      </header>
      <main className="portal-app__main portal-app__main--login">{children}</main>
    </div>
  );
}
