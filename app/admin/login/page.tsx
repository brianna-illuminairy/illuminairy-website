"use client";

import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const secret = String(fd.get("secret") ?? "");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret })
    });

    if (!res.ok) {
      setError("Invalid secret.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin/leads";
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-light tracking-tight text-ink">Admin login</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-[13px] font-semibold text-ink">
          Secret
          <input
            name="secret"
            type="password"
            required
            className="h-12 rounded-xl border border-line bg-ivory px-4 text-[14px]"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="text-[14px] text-terracotta-ink">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-lg bg-ink text-[14px] font-semibold text-ivory disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
