"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LESSONS = [
  {
    href: "/danielle/week-5/lesson-1",
    label: "Lesson 1 · Tue Jul 14",
    match: (path: string) => path.includes("/lesson-1")
  }
] as const;

export function Week5LessonNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  if (!pathname.startsWith("/danielle/week-5")) {
    return null;
  }

  const active =
    LESSONS.find((lesson) => lesson.match(pathname))?.href ?? LESSONS[0].href;

  return (
    <div className="danielle-portal__week1-subnav">
      <div className="danielle-portal__week1-subnav-inner">
        <label className="danielle-portal__week1-picker">
          <span className="danielle-portal__week1-picker-label">Week 5</span>
          <select
            className="danielle-portal__week1-select"
            value={active}
            onChange={(e) => router.push(e.target.value)}
            aria-label="Choose Week 5 section"
          >
            {LESSONS.map((lesson) => (
              <option key={lesson.href} value={lesson.href}>
                {lesson.label}
              </option>
            ))}
          </select>
        </label>
        <div className="danielle-portal__week1-tabs" aria-label="Week 5 sections">
          {LESSONS.map((lesson) => {
            const isActive = lesson.match(pathname);
            return (
              <Link
                key={lesson.href}
                href={lesson.href}
                className={`danielle-portal__week1-tab${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {lesson.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
