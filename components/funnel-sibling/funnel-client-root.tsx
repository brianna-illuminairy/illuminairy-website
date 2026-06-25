"use client";

import { useCallback } from "react";

/** Hide SSR entry shell once client runner mounts — never removeChild (React SSR sibling). */
export function useDismissFunnelEntryShell(entryShellId?: string) {
  return useCallback(() => {
    if (!entryShellId) return;
    document.getElementById(entryShellId)?.classList.add("funnel-entry-ssr--dismissed");
  }, [entryShellId]);
}
