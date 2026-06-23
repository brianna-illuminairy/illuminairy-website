"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import { PortalProfileChip } from "@/components/portal/portal-profile-chip";
import { PORTAL_PROGRAM_EYEBROW } from "@/lib/portal/portal-product-copy";
import {
  PORTAL_SUBJECT_NAV,
  PORTAL_TOP_NAV,
  portalNavActiveTab,
} from "@/lib/portal/portal-nav";
import type { PortalProfile } from "@/lib/portal/load-dashboard";

type Props = {
  profile: PortalProfile;
  children: React.ReactNode;
  /** Mock backdrop — non-interactive nav labels only. */
  staticChrome?: boolean;
  activeTabId?: string;
  activeSubjectId?: string;
};

export function PortalShell({
  profile,
  children,
  staticChrome = false,
  activeTabId,
  activeSubjectId = "sat-math",
}: Props) {
  const pathname = usePathname() ?? "";
  const resolvedActiveTab = activeTabId ?? portalNavActiveTab(pathname);

  return (
    <div className={`portal-app aurora-portal${staticChrome ? " portal-app--static" : ""}`}>
      <header className="aurora-header portal-app__header">
        <div className="aurora-header__inner portal-app__header-inner">
          <div className="portal-app__header-row">
            {staticChrome ? (
              <span className="portal-app__logo" aria-label="Illuminairy">
                <IlluminairyLogoV7 tone="on-dark" height={30} />
              </span>
            ) : (
              <Link href="/portal/home" className="portal-app__logo" aria-label="Illuminairy home">
                <IlluminairyLogoV7 tone="on-dark" height={30} />
              </Link>
            )}
            {!staticChrome ? <PortalProfileChip profile={profile} /> : (
              <span className="portal-profile__chip portal-profile__chip--mock" aria-hidden="true">
                <span className="portal-profile__avatar">{profile.studentInitials}</span>
                <span className="portal-profile__name">{profile.studentName}</span>
              </span>
            )}
          </div>

          <p className="portal-app__eyebrow aurora-eyebrow aurora-eyebrow--on-dark">
            {PORTAL_PROGRAM_EYEBROW}
          </p>

          <nav className="aurora-nav portal-app__tabs" aria-label="Portal sections">
            {PORTAL_TOP_NAV.map((tab) => {
              const active = tab.id === resolvedActiveTab;
              if (staticChrome || tab.disabled || !tab.href) {
                return (
                  <span
                    key={tab.id}
                    className={`aurora-nav__link portal-app__tab${active ? " is-active" : ""}${tab.disabled ? " portal-app__tab--disabled" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {tab.label}
                  </span>
                );
              }
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`aurora-nav__link portal-app__tab${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="aurora-body-wrap portal-app__main aurora-wash-light">{children}</main>

      <nav className="portal-app__bottom" aria-label="SAT subjects">
        {PORTAL_SUBJECT_NAV.map((subject) => {
          const active = subject.id === activeSubjectId;
          return (
            <span
              key={subject.id}
              className={
                active
                  ? "portal-app__bottom-item portal-app__bottom-item--active"
                  : "portal-app__bottom-item"
              }
            >
              {subject.label}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

export function PortalLoginChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-app portal-app--login aurora-portal aurora-portal--login">
      <header className="aurora-header portal-app__header portal-app__header--login">
        <div className="aurora-header__inner">
          <IlluminairyLogoV7 tone="on-dark" height={30} />
        </div>
      </header>
      <main className="aurora-body-wrap portal-app__main portal-app__main--login">{children}</main>
    </div>
  );
}
