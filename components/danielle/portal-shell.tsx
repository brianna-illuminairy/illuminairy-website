"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";

const NAV = [
  { href: "/danielle", label: "SAT Plan", match: (path: string) => path === "/danielle" },
  {
    href: "/danielle/diagnostic",
    label: "Diagnostic Reports",
    match: (path: string) => path.startsWith("/danielle/diagnostic")
  }
] as const;

export function DaniellePortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="danielle-portal">
      <header className="danielle-portal__header">
        <div className="danielle-portal__header-inner">
          <Link href="/danielle" className="danielle-portal__logo" aria-label="Illuminairy">
            <IlluminairyLogoV7 tone="on-dark" height={34} />
          </Link>
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
        </div>
      </header>
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
          <span className="danielle-portal__logo" aria-label="Illuminairy">
            <IlluminairyLogoV7 tone="on-dark" height={34} />
          </span>
        </div>
      </header>
      <div className="danielle-portal__login-wrap">{children}</div>
      <footer className="danielle-portal__footer">
        © {new Date().getFullYear()} Illuminairy · Private student portal
      </footer>
    </div>
  );
}
