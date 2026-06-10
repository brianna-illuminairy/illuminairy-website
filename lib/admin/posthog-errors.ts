import { createAdminAlert } from "@/lib/admin/alerts";

type HogqlResponse = {
  results?: unknown[][];
  columns?: string[];
};

export async function pollPosthogExceptions(hours = 4) {
  const token =
    process.env.POSTHOG_PERSONAL_API_KEY?.trim() ??
    process.env.POSTHOG_API_KEY?.trim();
  const projectId = process.env.POSTHOG_PROJECT_ID?.trim() ?? "428901";
  const host = process.env.POSTHOG_API_HOST?.trim() ?? "https://us.posthog.com";

  if (!token) {
    return { ok: false as const, error: "posthog_not_configured", created: 0 };
  }

  const query = {
    query: {
      kind: "HogQLQuery",
      query: `
        SELECT
          coalesce(properties.$exception_message, 'Unknown error') AS message,
          count() AS cnt
        FROM events
        WHERE event = '$exception'
          AND timestamp > now() - interval ${hours} hour
        GROUP BY message
        ORDER BY cnt DESC
        LIMIT 10
      `
    }
  };

  const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(query)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[posthog-alerts] query failed:", res.status, text);
    await createAdminAlert({
      alertType: "posthog_poll_failed",
      severity: "warning",
      title: "PostHog error poll failed",
      body: `Could not query $exception events (${res.status}).`,
      source: "posthog",
      dedupeKey: `posthog_poll_failed:${new Date().toISOString().slice(0, 13)}`
    });
    return { ok: false as const, error: "query_failed", created: 0 };
  }

  const json = (await res.json()) as HogqlResponse;
  const rows = json.results ?? [];
  let created = 0;

  for (const row of rows) {
    const message = String(row[0] ?? "Unknown error");
    const count = Number(row[1] ?? 0);
    if (count <= 0) continue;

    const slug = message.slice(0, 80).replace(/\W+/g, "_");
    const windowKey = new Date().toISOString().slice(0, 13);
    const result = await createAdminAlert({
      alertType: "posthog_exception",
      severity: count >= 5 ? "critical" : "warning",
      title: `PostHog: ${count} error(s) in last ${hours}h`,
      body: message,
      linkUrl: `${host}/project/${projectId}/error_tracking`,
      source: "posthog",
      dedupeKey: `posthog_exception:${slug}:${windowKey}`
    });
    if (result.ok && !result.duplicate) created++;
  }

  return { ok: true as const, created, rowCount: rows.length };
}
