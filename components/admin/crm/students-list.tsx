"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StudentListRow } from "@/lib/admin/students-queries";

export function StudentsList() {
  const [students, setStudents] = useState<StudentListRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/admin/students", { cache: "no-store", signal: ctrl.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load students.");
        return res.json() as Promise<{ students: StudentListRow[] }>;
      })
      .then((j) => setStudents(j.students))
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => ctrl.abort();
  }, []);

  const grades = useMemo(() => {
    if (!students) return [] as string[];
    const set = new Set<string>();
    for (const s of students) if (s.grade) set.add(s.grade);
    return Array.from(set).sort();
  }, [students]);

  const statuses = useMemo(() => {
    if (!students) return [] as string[];
    const set = new Set<string>();
    for (const s of students) if (s.enrollmentStatus) set.add(s.enrollmentStatus);
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => {
      if (gradeFilter !== "all" && s.grade !== gradeFilter) return false;
      if (statusFilter !== "all" && s.enrollmentStatus !== statusFilter) {
        return false;
      }
      if (!query) return true;
      const hay = [
        s.firstName,
        s.lastName,
        s.parentFirst,
        s.parentLast,
        s.parentEmail,
        s.school
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query.toLowerCase());
    });
  }, [students, query, gradeFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          className="w-72 max-w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Search by student name, parent, school…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="all">All grades</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All enrollments</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {students ? (
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {students.length}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-muted/40">
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Student</th>
              <th className="px-4 py-2.5 font-medium">Parent</th>
              <th className="px-4 py-2.5 font-medium">Grade</th>
              <th className="px-4 py-2.5 font-medium">School</th>
              <th className="px-4 py-2.5 font-medium">Tutor</th>
              <th className="px-4 py-2.5 font-medium">Baseline → Target</th>
              <th className="px-4 py-2.5 font-medium">Program</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {!students ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  {students.length === 0
                    ? "No students yet."
                    : "No students match your filters."}
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border/60 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/crm/clients/${s.clientId}#students`}
                      className="block"
                    >
                      <span className="block font-medium">
                        {[s.firstName, s.lastName].filter(Boolean).join(" ")}
                      </span>
                      {s.studentEmail ? (
                        <span className="text-xs text-muted-foreground">
                          {s.studentEmail}
                        </span>
                      ) : null}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/crm/clients/${s.clientId}`}
                      className="block"
                    >
                      <span className="block">
                        {[s.parentFirst, s.parentLast].filter(Boolean).join(" ") ||
                          "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {s.parentEmail}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs">{s.grade ?? "—"}</td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-xs">
                    {s.school ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">{s.tutorAssigned ?? "—"}</td>
                  <td className="px-4 py-3 text-xs tabular-nums">
                    {s.baselineScore || s.targetScore ? (
                      <span>
                        {s.baselineScore ?? "?"}{" "}
                        <span className="text-muted-foreground">→</span>{" "}
                        {s.targetScore ?? "?"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-xs">
                    {s.programLabel ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {s.enrollmentStatus ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                          s.enrollmentStatus === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.enrollmentStatus}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
