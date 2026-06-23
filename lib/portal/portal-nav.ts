export type PortalNavTab = {
  id: string;
  label: string;
  href?: string;
  match?: (path: string) => boolean;
  disabled?: boolean;
};

export const PORTAL_TOP_NAV: PortalNavTab[] = [
  {
    id: "lessons",
    label: "Lessons",
    href: "/portal/home",
    match: (path) => path === "/portal/home" || path === "/portal",
  },
  {
    id: "diagnostic",
    label: "Diagnostic",
    href: "/portal/diagnostic",
    match: (path) => path.startsWith("/portal/diagnostic"),
  },
  {
    id: "plans",
    label: "SAT Plan",
    href: "/portal/plan",
    match: (path) => path.startsWith("/portal/plan"),
  },
  {
    id: "practice-tests",
    label: "Practice Tests",
    disabled: true,
  },
  {
    id: "homework",
    label: "Homework",
    disabled: true,
  },
  {
    id: "progress-reports",
    label: "Progress Reports",
    disabled: true,
  },
  {
    id: "enroll",
    label: "Enroll",
    href: "/portal/enroll",
    match: (path) => path.startsWith("/portal/enroll"),
  },
];

export type PortalSubjectNavItem = {
  id: string;
  label: string;
};

export const PORTAL_SUBJECT_NAV: PortalSubjectNavItem[] = [
  { id: "sat-math", label: "SAT Math" },
  { id: "sat-rw", label: "SAT Reading & Writing" },
];

export function portalNavActiveTab(pathname: string): string {
  if (pathname.startsWith("/portal/enroll")) return "enroll";
  for (const tab of PORTAL_TOP_NAV) {
    if (tab.match?.(pathname)) return tab.id;
  }
  return "lessons";
}
