"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LESSONS = [
  {
    href: "/danielle/week-1/lesson-1",
    label: "Lesson 1 · Tue Jun 9",
    match: (path: string) => path.includes("/lesson-1")
  },
  {
    href: "/danielle/week-1/lesson-2",
    label: "Lesson 2 · Thu Jun 11",
    match: (path: string) => path.includes("/lesson-2")
  }
] as const;

export function Week1LessonNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  if (!pathname.startsWith("/danielle/week-1")) {
    return null;
  }

  const active =
    LESSONS.find((lesson) => lesson.match(pathname))?.href ?? LESSONS[0].href;

  return (
    <div className="danielle-portal__week1-subnav">
      <div className="danielle-portal__week1-subnav-inner">
        <label className="danielle-portal__week1-picker">
          <span className="danielle-portal__week1-picker-label">Week 1 lesson</span>
          <select
            className="danielle-portal__week1-select"
            value={active}
            onChange={(e) => router.push(e.target.value)}
            aria-label="Choose Week 1 lesson"
          >
            {LESSONS.map((lesson) => (
              <option key={lesson.href} value={lesson.href}>
                {lesson.label}
              </option>
            ))}
          </select>
        </label>
        <div className="danielle-portal__week1-tabs" aria-label="Week 1 lessons">
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
