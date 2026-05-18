"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/logo";
import { navItems, scheduleLink } from "@/lib/site";

const headerItems = navItems.filter((item) =>
  ["/sat-accelerator", "/mentors", "/contact"].includes(item.href)
);

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ivory/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {headerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-medium tracking-[-0.005em] text-ink-soft transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center lg:flex">
          <ButtonLink href={scheduleLink} variant="primary">
            Book a consultation
          </ButtonLink>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong bg-ivory-50 text-ink transition hover:border-gold/40 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-ivory px-5 py-6 shadow-soft lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[14.5px] font-medium text-ink-soft hover:bg-ivory-200 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ButtonLink href={scheduleLink}>Book a consultation</ButtonLink>
              <ButtonLink href="/mentors" variant="secondary">
                Apply as a mentor
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
