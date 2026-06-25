"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ShermeenLoginChrome } from "@/components/shermeen/portal-shell";
import { trackShermeenPortalLogin } from "@/lib/shermeen-portal-analytics";

type LoginResponse = {
  ok?: boolean;
  isOwnerQa?: boolean;
};

export default function ShermeenLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/shermeen/diagnostic";
  const showStaffField = params.get("staff") === "1";
  const [email, setEmail] = useState("");
  const [staffCode, setStaffCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shermeen/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          staffCode: staffCode.trim() || undefined
        })
      });
      if (!res.ok) {
        setError("That email is not authorized for this page.");
        return;
      }
      const body = (await res.json()) as LoginResponse;
      const normalizedEmail = email.trim().toLowerCase();
      trackShermeenPortalLogin({
        email: normalizedEmail,
        isOwnerQa: body.isOwnerQa ?? false,
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
    <ShermeenLoginChrome>
      <div className="aurora-portal__card">
        <p className="aurora-eyebrow">Illuminairy</p>
        <h1 className="aurora-portal__title">Shermeen&apos;s SAT Portal</h1>
        <p className="aurora-portal__lede">
          Enter Sohail or Shermeen&apos;s email to open the portal (sohailft@gmail.com or
          shermeen.sohail2010@gmail.com).
        </p>
        <form onSubmit={submit}>
          <label className="aurora-portal__field">
            <span>Email</span>
            <input
              type="email"
              className="aurora-portal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          {showStaffField ? (
            <label className="aurora-portal__field">
              <span>Staff code</span>
              <input
                type="password"
                className="aurora-portal__input"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
                autoComplete="off"
                placeholder="Illuminairy team only"
              />
            </label>
          ) : null}
          {error ? <p className="aurora-portal__error">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="aurora-portal__button aurora-btn-primary"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </ShermeenLoginChrome>
  );
}
