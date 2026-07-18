"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const NAV = [
  {
    href: "/shermeen/profile",
    label: "Profile",
    match: (path: string) => path.startsWith("/shermeen/profile"),
  },
  {
    href: "/shermeen/diagnostic",
    label: "Diagnostic Analysis",
    match: (path: string) =>
      path.startsWith("/shermeen/diagnostic") && !path.startsWith("/shermeen/login"),
  },
  {
    href: "/shermeen/plan",
    label: "Improvement Plan",
    match: (path: string) => path.startsWith("/shermeen/plan"),
  },
  {
    href: "/shermeen/week-1",
    label: "Week 1",
    match: (path: string) => path.startsWith("/shermeen/week-1"),
  },
  {
    href: "/shermeen/sat-algebra",
    label: "SAT Algebra",
    match: (path: string) => path.startsWith("/shermeen/sat-algebra"),
  },
] as const;

function HomeworkPortalCta() {
  return (
    <a
      href={homeworkPortalLoginUrl}
      className="aurora-btn-ghost"
      target="_blank"
      rel="noopener noreferrer"
    >
      Homework Portal
    </a>
  );
}

function ShermeenPortalFooter() {
  return (
    <footer className="aurora-footer">
      <div className="aurora-footer__inner">
        <p className="aurora-footer__legal">
          Skill Diagnostic:{" "}
          <a
            href={homeworkPortalLoginUrl}
            style={{ color: "var(--aurora-green)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            my.illuminairy.com
          </a>
        </p>
        <p className="aurora-footer__legal" style={{ marginTop: "8px" }}>
          © {new Date().getFullYear()} Illuminairy · Private student portal
        </p>
      </div>
    </footer>
  );
}

function ShermeenHeaderNav({ pathname }: { pathname: string }) {
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

export function ShermeenPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="aurora-portal shermeen-portal">
      <header className="aurora-header">
        <div className="aurora-header__inner" style={{ flexDirection: "column", alignItems: "stretch" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", width: "100%" }}>
            <Link href="/shermeen/profile" aria-label="Illuminairy">
              <IlluminairyLogoV7 tone="on-dark" height={34} />
            </Link>
            <HomeworkPortalCta />
          </div>
          <ShermeenHeaderNav pathname={pathname} />
        </div>
      </header>
      <div className="aurora-body-wrap">{children}</div>
      <ShermeenPortalFooter />
    </div>
  );
}

export function ShermeenLoginChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="aurora-portal aurora-portal--login shermeen-portal">
      <header className="aurora-header">
        <div className="aurora-header__inner">
          <span aria-label="Illuminairy">
            <IlluminairyLogoV7 tone="on-dark" height={34} />
          </span>
          <HomeworkPortalCta />
        </div>
      </header>
      <div className="aurora-body-wrap">{children}</div>
      <ShermeenPortalFooter />
    </div>
  );
}
