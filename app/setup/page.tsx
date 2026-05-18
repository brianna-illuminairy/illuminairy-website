"use client";

import { useState, type FormEvent } from "react";

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/setup/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: String(fd.get("secret") ?? ""),
        databasePassword: String(fd.get("databasePassword") ?? "")
      })
    });

    const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };

    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Migration failed.");
      return;
    }

    setStatus("done");
    setMessage(data.message ?? "Done.");
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg bg-ivory px-6 py-16">
      <h1 className="text-2xl font-light text-ink">CRM setup (one time)</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
        Creates Supabase tables for leads, clients, and attribution. Use your{" "}
        <strong>database password</strong> from Supabase → Project Settings →
        Database (not the anon or service_role API keys).
      </p>
      <p className="mt-2 text-[13px] text-ink-muted">
        Admin secret is in your local <code className="text-ink">.env.local</code>{" "}
        as <code className="text-ink">ADMIN_SECRET</code>.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-[13px] font-semibold text-ink">
          ADMIN_SECRET
          <input
            name="secret"
            type="password"
            required
            className="h-11 rounded-lg border border-line px-3 text-[14px]"
          />
        </label>
        <label className="grid gap-2 text-[13px] font-semibold text-ink">
          Database password
          <input
            name="databasePassword"
            type="password"
            required
            className="h-11 rounded-lg border border-line px-3 text-[14px]"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 rounded-lg bg-ink text-[14px] font-semibold text-ivory disabled:opacity-60"
        >
          {status === "loading" ? "Running migration…" : "Create CRM tables"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-[14px] ${status === "error" ? "text-terracotta-ink" : "text-sage-ink"}`}
          role="alert"
        >
          {message}
        </p>
      )}

      {status === "done" && (
        <p className="mt-6 text-[13px] text-ink-soft">
          Next: add <code>SUPABASE_SERVICE_ROLE_KEY</code> and{" "}
          <code>KLAVIYO_PRIVATE_API_KEY</code> to .env.local, then{" "}
          <code className="text-ink">npm run env:sync</code>. Sign in at{" "}
          <a href="/admin/login" className="text-gold-deep underline">
            /admin/login
          </a>{" "}
          with the same ADMIN_SECRET.
        </p>
      )}
    </main>
  );
}
