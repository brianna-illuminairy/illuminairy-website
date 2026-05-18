"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { site } from "@/lib/site";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-ivory px-4 text-[14.5px] font-normal text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

const labelClass =
  "grid gap-2 text-[13px] font-semibold tracking-[-0.005em] text-ink";

export function EnrollCheckout() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      parentName: String(fd.get("parentName") ?? ""),
      email: String(fd.get("email") ?? ""),
      studentName: String(fd.get("studentName") ?? ""),
      company: String(fd.get("company") ?? "")
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setStatus("error");
        setErrorMsg(
          data.error ?? `Something went wrong. Email ${site.supportEmail}.`
        );
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus("error");
      setErrorMsg(`Could not start checkout. Email ${site.supportEmail}.`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className={labelClass}>
        Parent / guardian name
        <input
          name="parentName"
          required
          disabled={status === "loading"}
          className={inputClass}
          placeholder="Your full name"
        />
      </label>

      <label className={labelClass}>
        Email
        <input
          name="email"
          type="email"
          required
          disabled={status === "loading"}
          className={inputClass}
          placeholder="you@example.com"
        />
      </label>

      <label className={labelClass}>
        Student name
        <input
          name="studentName"
          disabled={status === "loading"}
          className={inputClass}
          placeholder="Optional — or share after payment"
        />
      </label>

      {status === "error" && errorMsg && (
        <p className="rounded-xl border border-terracotta/25 bg-terracotta/10 px-4 py-3 text-[14px] leading-relaxed text-terracotta-ink">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-ivory transition hover:-translate-y-0.5 hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            Redirecting to payment…
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          </>
        ) : (
          <>
            Continue to secure payment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
