"use client";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface no-print">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between gap-3 px-5 sm:px-6">
        <Logo size="sm" />
        <nav className="flex items-center gap-4 text-xs font-semibold sm:gap-6">
          <a href="#program" className="hidden sm:inline">
            program
          </a>
          <a href="#system" className="hidden sm:inline">
            system
          </a>
          <a href="#waitlist">contact</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <ButtonLink
            href="/#waitlist"
            variant="primary"
            icon={null}
            className="min-h-9 px-3 text-xs sm:min-h-10 sm:px-4 sm:text-[13px]"
          >
            Request details
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
