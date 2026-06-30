"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LESSONS = [
  {
    href: "/soha/week-1/lesson-1",
    label: "Lesson 1 · Tue Jun 24",
    match: (path: string) => path.includes("/lesson-1"),
  },
  {
    href: "/soha/week-1/lesson-2",
    label: "Lesson 2 · Wed Jun 25",
    match: (path: string) => path.includes("/lesson-2"),
  },
  {
    href: "/soha/week-1/lesson-3",
    label: "Lesson 3 · Sat Jun 28",
    match: (path: string) => path.includes("/lesson-3"),
  },
  {
    href: "/soha/week-1/exercises",
    label: "Exercises",
    match: (path: string) => path.includes("/exercises"),
  },
  {
    href: "/soha/week-1/report",
    label: "Week 1 report",
    match: (path: string) => path.includes("/report"),
  },
] as const;

export function Week1LessonNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  if (!pathname.startsWith("/soha/week-1")) {
    return null;
  }

  const active = LESSONS.find((lesson) => lesson.match(pathname))?.href ?? LESSONS[0].href;

  return (
    <div className="soha-week1__subnav">
      <div className="soha-week1__subnav-inner">
        <label className="soha-week1__picker">
          <span className="soha-week1__picker-label">Week 1</span>
          <select
            className="soha-week1__select"
            value={active}
            onChange={(e) => router.push(e.target.value)}
            aria-label="Choose Week 1 section"
          >
            {LESSONS.map((lesson) => (
              <option key={lesson.href} value={lesson.href}>
                {lesson.label}
              </option>
            ))}
          </select>
        </label>
        <div className="soha-week1__tabs" aria-label="Week 1 sections">
          {LESSONS.map((lesson) => {
            const isActive = lesson.match(pathname);
            return (
              <Link
                key={lesson.href}
                href={lesson.href}
                className={`soha-week1__tab${isActive ? " is-active" : ""}`}
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
