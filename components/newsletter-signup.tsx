"use client";

import Link from "next/link";
import { useState } from "react";
import { subscribeToKlaviyo } from "@/lib/klaviyo-client";

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
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

    try {
      await subscribeToKlaviyo({
        email: email.trim(),
        customSource: "illuminairy.com newsletter"
      });
      setStatus("success");
      setEmail("");
      setMessage("You're on the list. We'll be in touch.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (compact && status === "success") {
    return <p className="text-[14px] text-ink-soft">{message}</p>;
  }

  return (
    <div className={compact ? "" : "rounded-2xl border border-line bg-ivory p-6"}>
      {!compact && (
        <>
          <p className="eyebrow text-gold-deep">Stay in the loop</p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
            Program updates, new session openings, and Illuminairy news.{" "}
            <Link href="/guides" className="font-medium text-gold-deep hover:underline">
              Free parent guides
            </Link>{" "}
            are also available.
          </p>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-3 ${compact ? "mt-0" : "mt-5"} sm:flex-row`}
      >
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          value={email}
          disabled={status === "loading" || status === "success"}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-ivory-50 px-4 text-[14px] text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg border border-ink bg-ink px-5 text-[13px] font-semibold text-ivory transition hover:bg-ink-soft disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : status === "success" ? "Joined" : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-[13px] ${status === "error" ? "text-terracotta" : "text-ink-soft"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
