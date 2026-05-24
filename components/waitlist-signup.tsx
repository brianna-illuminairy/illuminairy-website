"use client";

import { useState } from "react";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { subscribeToKlaviyo } from "@/lib/klaviyo-client";
import { homePlatform, site } from "@/lib/site";

type WaitlistTrack = "professional" | "business_owner" | "both" | "";

export function WaitlistSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState<WaitlistTrack>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("company")) {
      return;
    }

    const properties: Record<string, string> = {};
    if (track) {
      properties.waitlist_track = track;
    }

    try {
      await subscribeToKlaviyo({
        email: email.trim(),
        customSource: "illuminairy.com platform waitlist",
        properties,
        listId: site.platformWaitlistListId || undefined
      });

      captureAnalytics(AnalyticsEvents.platformWaitlistSubmitted, {
        waitlist_track: track || "unspecified"
      });

      setStatus("success");
      setEmail("");
      setTrack("");
      setMessage(homePlatform.waitlist.successMessage);
    } catch {
      setStatus("error");
      setMessage(`Something went wrong. Email ${site.supportEmail} and we will add you.`);
    }
  }

  return (
    <div className={compact ? "" : "w-full max-w-md"}>
      {!compact && (
        <>
          <p className="text-sm font-medium text-primary">{homePlatform.waitlist.headline}</p>
          <p className="mt-1 text-sm text-primary-muted">{homePlatform.waitlist.subcopy}</p>
        </>
      )}
      <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${compact ? "" : "mt-4"}`}>
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <fieldset className="space-y-2">
          <legend className="sr-only">{homePlatform.waitlist.interestLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "professional", label: "Professional" },
                { value: "business_owner", label: "Business owner" },
                { value: "both", label: "Both" }
              ] as const
            ).map(({ value, label }) => (
              <label
                key={value}
                className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                  track === value
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface-elevated text-primary-muted hover:border-accent/30"
                }`}
              >
                <input
                  type="radio"
                  name="waitlist_track"
                  value={value}
                  checked={track === value}
                  onChange={() => setTrack(value)}
                  className="sr-only"
                  disabled={status === "loading" || status === "success"}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="waitlist-email">
            Email
          </label>
          <input
            id="waitlist-email"
            type="email"
            name="email"
            required
            value={email}
            disabled={status === "loading" || status === "success"}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-accent bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading"
              ? "Joining…"
              : status === "success"
                ? "Joined"
                : "Join waitlist"}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${status === "error" ? "text-red-600 dark:text-red-400" : "text-primary-muted"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
