"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import { Week1LessonNav } from "@/components/soha/week1-lesson-nav";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

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
  {
    href: "/soha/week-1",
    label: "Week 1",
    match: (path: string) => path.startsWith("/soha/week-1"),
  },
  {
    href: "/soha/sat-algebra",
    label: "SAT Algebra",
    match: (path: string) => path.startsWith("/soha/sat-algebra"),
  },
] as const;

function HomeworkPortalCta() {
  return (
    <a
      href={homeworkPortalLoginUrl}
      className="aurora-btn-secondary soha-portal__homework-cta"
      target="_blank"
      rel="noopener noreferrer"
    >
      Homework Portal
    </a>
  );
}

function SohaPortalFooter() {
  return (
    <footer className="aurora-footer">
      <div className="aurora-footer__inner">
        <p className="aurora-footer__legal">
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
            <HomeworkPortalCta />
          </div>
          <SohaHeaderNav pathname={pathname} />
          <Week1LessonNav />
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
        </div>
      </header>
      <div className="aurora-body-wrap">{children}</div>
      <SohaPortalFooter />
    </div>
  );
}
