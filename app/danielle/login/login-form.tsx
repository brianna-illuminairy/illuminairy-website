"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DanielleLoginChrome } from "@/components/danielle/portal-shell";
import { trackDaniellePortalLogin } from "@/lib/danielle-portal-analytics";
import type { DaniellePortalRole } from "@/lib/danielle-portal-roles";

export default function DanielleLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/danielle/diagnostic";
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/danielle/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        setError("That email is not authorized for this page.");
        return;
      }
      const body = (await res.json()) as { ok?: boolean; role?: DaniellePortalRole };
      const role = body.role ?? "other";
      trackDaniellePortalLogin({
        email: email.trim().toLowerCase(),
        role,
        pathname: next
      });
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DanielleLoginChrome>
      <div className="danielle-portal__card">
        <p className="danielle-portal__eyebrow">Illuminairy</p>
        <h1 className="danielle-portal__title">Danielle&apos;s SAT plan</h1>
        <p className="danielle-portal__lede">
          Enter the email we shared with you to view diagnostics, the study plan, and Week 1
          lessons.
        </p>
        <form onSubmit={submit}>
          <label className="danielle-portal__field">
            <span>Email</span>
            <input
              type="email"
              className="danielle-portal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          {error ? <p className="danielle-portal__error">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="danielle-portal__button"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </DanielleLoginChrome>
  );
}
