"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/logo";
import { bookLink, navItems } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/86 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slatecopy transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/mentors"
            className="text-sm font-medium text-slatecopy transition hover:text-ink"
          >
            Apply as a Mentor
          </Link>
          <ButtonLink href={bookLink}>Book a Consultation</ButtonLink>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-white px-5 py-5 shadow-soft lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slatecopy hover:bg-cloud hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ButtonLink href={bookLink}>Book a Consultation</ButtonLink>
              <ButtonLink href="/mentors" variant="secondary">
                Apply as a Mentor
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
