"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { contactReasons, site } from "@/lib/site";

type Status = { kind: "ok" | "err"; msg: string } | null;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<string>(contactReasons[0]);
  const [message, setMessage] = useState("");
  // Honeypot — real users leave this blank.
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ kind: "err", msg: "Please fill in your name, email, and message." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reason, message, company })
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus({
          kind: "err",
          msg:
            data.error ||
            `We could not send your message. Email ${site.supportEmail} directly.`
        });
        setSubmitting(false);
        return;
      }
      setStatus({
        kind: "ok",
        msg: "Thanks. We'll get back to you within 1 business day."
      });
      setName("");
      setEmail("");
      setMessage("");
      setReason(contactReasons[0]);
      setSubmitting(false);
    } catch (err) {
      console.error("contact form error:", err);
      setStatus({
        kind: "err",
        msg: `Something went wrong. Email ${site.supportEmail} directly.`
      });
      setSubmitting(false);
    }
  }

  const fieldBase =
    "w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-[15px] text-primary placeholder:text-primary-muted/70 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {/* Honeypot, hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-2">
        <label htmlFor="cf-name" className="text-[13px] font-semibold text-primary">
          Your name
        </label>
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldBase}
          placeholder="Jane Smith"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="cf-email" className="text-[13px] font-semibold text-primary">
          Email
        </label>
        <input
          id="cf-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldBase}
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="cf-reason" className="text-[13px] font-semibold text-primary">
          What&apos;s this about?
        </label>
        <select
          id="cf-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={fieldBase}
        >
          {contactReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="cf-message"
          className="text-[13px] font-semibold text-primary"
        >
          Message
        </label>
        <textarea
          id="cf-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={fieldBase + " min-h-[140px] resize-y"}
          placeholder="Tell us a little about what you're looking for."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent bg-accent px-5 text-[14px] font-semibold tracking-tight text-accent-foreground shadow-card transition hover:opacity-90 disabled:opacity-60"
      >
        <span>{submitting ? "Sending…" : "Send message"}</span>
        {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </button>

      {status && (
        <div
          role="alert"
          className={
            "rounded-xl px-4 py-3 text-[14px] " +
            (status.kind === "ok"
              ? "border border-accent/30 bg-accent/5 text-primary"
              : "border border-red-200 bg-red-50 text-red-800")
          }
        >
          {status.msg}
        </div>
      )}

      <p className="mt-1 text-[13px] text-primary-muted">
        Or email{" "}
        <a
          href={`mailto:${site.supportEmail}`}
          className="font-medium text-primary underline underline-offset-4"
        >
          {site.supportEmail}
        </a>{" "}
        directly.
      </p>
    </form>
  );
}
