"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { subscribeToKlaviyo } from "@/lib/klaviyo-client";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  LEAD_MAGNET_ACCESS_KEY,
  type LeadMagnetSlug
} from "@/lib/lead-magnets";

export function LeadMagnetForm({
  slug,
  klaviyoSource,
  downloadPath,
  theme = "light",
  submitLabel = "Email me the SAT guide",
  successOpenLabel = "Open your SAT guide"
}: {
  slug: LeadMagnetSlug;
  klaviyoSource: string;
  downloadPath: string;
  theme?: "light" | "dark";
  submitLabel?: string;
  successOpenLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const isDark = theme === "dark";
  const inputClass = isDark
    ? "h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-[15px] text-ivory placeholder:text-ivory/40 outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/25"
    : "h-12 w-full rounded-xl border border-line bg-ivory px-4 text-[15px] text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
  const btnClass = isDark
    ? "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 text-[14px] font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
    : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-ink bg-ink px-5 text-[14px] font-semibold text-ivory transition hover:bg-ink-soft disabled:opacity-60";
  const hintClass = isDark
    ? "text-[12px] leading-relaxed text-ivory/50"
    : "text-[12px] leading-relaxed text-ink-muted";
  const successBox = isDark
    ? "mt-6 rounded-xl border border-sage/40 bg-sage/20 p-6"
    : "mt-6 rounded-xl border border-sage/30 bg-sage/10 p-6";
  const successTitle = isDark ? "text-ivory" : "text-ink";
  const successText = isDark ? "text-ivory/75" : "text-ink-soft";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return;

    const trimmed = email.trim();
    if (!trimmed) return;

    try {
      await subscribeToKlaviyo({
        email: trimmed,
        customSource: klaviyoSource,
        properties: {
          lead_magnet_slug: slug,
          lead_magnet_download_url: downloadPath
        }
      });

      const access = JSON.parse(
        sessionStorage.getItem(LEAD_MAGNET_ACCESS_KEY) ?? "{}"
      ) as Record<string, boolean>;
      access[slug] = true;
      sessionStorage.setItem(LEAD_MAGNET_ACCESS_KEY, JSON.stringify(access));

      captureAnalytics(AnalyticsEvents.leadMagnetSubmitted, {
        lead_magnet_slug: slug
      });

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={successBox}>
        <p className={`text-center text-[16px] font-medium ${successTitle}`}>
          You&apos;re in.
        </p>
        <p className={`mt-2 text-center text-[14px] leading-relaxed ${successText}`}>
          Your guide is ready — open it now and save as PDF anytime.
        </p>
        <Link
          href={downloadPath}
          onClick={() =>
            captureAnalytics(AnalyticsEvents.leadMagnetDownloadViewed, {
              lead_magnet_slug: slug
            })
          }
          className={`${btnClass} mt-5`}
        >
          {successOpenLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="sr-only" htmlFor={`magnet-email-${slug}`}>
        Email address
      </label>
      <input
        id={`magnet-email-${slug}`}
        type="email"
        name="email"
        required
        value={email}
        disabled={status === "loading"}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={inputClass}
      />
      <button type="submit" disabled={status === "loading"} className={btnClass}>
        {status === "loading" ? "Sending…" : submitLabel}
        {status !== "loading" && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
      <p className={`text-center ${hintClass}`}>
        Parent-focused SAT notes occasionally. Unsubscribe anytime.
      </p>
      {message && (
        <p className="text-center text-[13px] text-terracotta" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
