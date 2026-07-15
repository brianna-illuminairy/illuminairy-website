"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import { OwnerQaBadge } from "@/components/danielle/owner-qa-badge";
import { PortalUpdatesBanner } from "@/components/danielle/portal-updates-banner";
import { Week1LessonNav } from "@/components/danielle/week1-lesson-nav";
import { Week2LessonNav } from "@/components/danielle/week2-lesson-nav";
import { Week3LessonNav } from "@/components/danielle/week3-lesson-nav";
import { Week4LessonNav } from "@/components/danielle/week4-lesson-nav";
import { Week5LessonNav } from "@/components/danielle/week5-lesson-nav";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const NAV = [
  {
    href: "/danielle/diagnostic",
    label: "Diagnostics",
    match: (path: string) => path.startsWith("/danielle/diagnostic")
  },
  {
    href: "/danielle/plan",
    label: "Study Plan",
    match: (path: string) => path === "/danielle/plan"
  },
  {
    href: "/danielle/week-1",
    label: "Week 1",
    match: (path: string) => path.startsWith("/danielle/week-1")
  },
  {
    href: "/danielle/week-2",
    label: "Week 2",
    match: (path: string) => path.startsWith("/danielle/week-2")
  },
  {
    href: "/danielle/week-3",
    label: "Week 3",
    match: (path: string) => path.startsWith("/danielle/week-3")
  },
  {
    href: "/danielle/week-4",
    label: "Week 4",
    match: (path: string) => path.startsWith("/danielle/week-4")
  },
  {
    href: "/danielle/week-5",
    label: "Week 5",
    match: (path: string) => path.startsWith("/danielle/week-5")
  }
] as const;

function HomeworkPortalCta() {
  return (
    <a
      href={homeworkPortalLoginUrl}
      className="danielle-portal__practice-cta"
      target="_blank"
      rel="noopener noreferrer"
    >
      Homework Portal
    </a>
  );
}

function DanielleHeaderNav({ pathname }: { pathname: string }) {
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

export function DaniellePortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="danielle-portal">
      <header className="danielle-portal__header">
        <div className="danielle-portal__header-inner">
          <div className="danielle-portal__topbar">
            <Link href="/danielle/diagnostic" className="danielle-portal__logo" aria-label="Illuminairy">
              <IlluminairyLogoV7 tone="on-dark" height={34} />
            </Link>
            <div className="danielle-portal__topbar-actions">
              <OwnerQaBadge />
              <HomeworkPortalCta />
            </div>
          </div>
          <DanielleHeaderNav pathname={pathname} />
        </div>
      </header>
      <PortalUpdatesBanner />
      <Week1LessonNav />
      <Week2LessonNav />
      <Week3LessonNav />
      <Week4LessonNav />
      <Week5LessonNav />
      <div className="danielle-portal__body">{children}</div>
      <footer className="danielle-portal__footer">
        © {new Date().getFullYear()} Illuminairy · Private student portal
      </footer>
    </div>
  );
}

export function DanielleLoginChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="danielle-portal danielle-portal--login">
      <header className="danielle-portal__header">
        <div className="danielle-portal__header-inner">
          <div className="danielle-portal__topbar">
            <span className="danielle-portal__logo" aria-label="Illuminairy">
              <IlluminairyLogoV7 tone="on-dark" height={34} />
            </span>
            <HomeworkPortalCta />
          </div>
        </div>
      </header>
      <div className="danielle-portal__login-wrap">{children}</div>
      <footer className="danielle-portal__footer">
        © {new Date().getFullYear()} Illuminairy · Private student portal
      </footer>
    </div>
  );
}
