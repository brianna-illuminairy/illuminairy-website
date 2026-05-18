"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { contactReasons, site } from "@/lib/site";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-ivory px-4 text-[14.5px] font-normal text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

const labelClass =
  "grid gap-2 text-[13px] font-semibold tracking-[-0.005em] text-ink";

export function ContactForm({ defaultReason }: { defaultReason?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      reason: String(data.get("reason") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? "")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          result.error ??
            `Something went wrong. Email us at ${site.supportEmail}.`
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        `Could not send your message. Email ${site.supportEmail} directly.`
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mt-7 rounded-2xl border border-sage/30 bg-sage/10 p-8 text-center">
        <p className="text-[17px] font-medium text-ink">Message sent.</p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          Thanks for reaching out. We typically reply within 1–2 business days
          at {site.supportEmail}.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-[13px] font-semibold text-gold-deep underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
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
        Name
        <input
          name="name"
          required
          disabled={status === "loading"}
          className={inputClass}
          placeholder="Your name"
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
        Reason for inquiry
        <select
          name="reason"
          required
          disabled={status === "loading"}
          className={inputClass}
          defaultValue={defaultReason ?? contactReasons[0]}
        >
          {contactReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Message
        <textarea
          name="message"
          required
          disabled={status === "loading"}
          className="min-h-36 w-full rounded-xl border border-line bg-ivory px-4 py-3 text-[14.5px] font-normal text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          placeholder="How can Illuminairy help?"
        />
      </label>

      {status === "error" && errorMessage && (
        <p className="rounded-xl border border-terracotta/25 bg-terracotta/10 px-4 py-3 text-[14px] leading-relaxed text-terracotta-ink">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-5 text-[13.5px] font-semibold tracking-[-0.01em] text-ivory transition hover:-translate-y-0.5 hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Submit inquiry"}
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
