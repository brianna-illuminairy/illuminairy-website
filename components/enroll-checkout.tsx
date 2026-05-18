"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { site } from "@/lib/site";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-ivory px-4 text-[14.5px] font-normal text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

const labelClass =
  "grid gap-2 text-[13px] font-semibold tracking-[-0.005em] text-ink";

function Field({
  label,
  name,
  type = "text",
  required,
  disabled,
  placeholder,
  autoComplete
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className={labelClass}>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className={inputClass}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}

export function EnrollCheckout() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      parentFirstName: String(fd.get("parentFirstName") ?? ""),
      parentLastName: String(fd.get("parentLastName") ?? ""),
      parentEmail: String(fd.get("parentEmail") ?? ""),
      parentPhone: String(fd.get("parentPhone") ?? ""),
      studentFirstName: String(fd.get("studentFirstName") ?? ""),
      studentLastName: String(fd.get("studentLastName") ?? ""),
      studentEmail: String(fd.get("studentEmail") ?? ""),
      studentPhone: String(fd.get("studentPhone") ?? ""),
      studentZipCode: String(fd.get("studentZipCode") ?? ""),
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
    <form onSubmit={handleSubmit} className="mt-5 grid gap-5">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <fieldset className="border-0 p-0">
        <legend className="sr-only">Parent or guardian</legend>
        <div className="grid gap-4">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gold-deep">
              Parent or guardian
            </p>
            <p className="text-[13px] leading-relaxed text-ink-muted">
              Billing contact and who we copy on schedules and program updates.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Parent first name"
            name="parentFirstName"
            required
            disabled={status === "loading"}
            autoComplete="given-name"
          />
          <Field
            label="Parent last name"
            name="parentLastName"
            required
            disabled={status === "loading"}
            autoComplete="family-name"
          />
        </div>
        <Field
          label="Parent email"
          name="parentEmail"
          type="email"
          required
          disabled={status === "loading"}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          label="Parent phone"
          name="parentPhone"
          type="tel"
          required
          disabled={status === "loading"}
          placeholder="(555) 555-5555"
          autoComplete="tel"
        />
        </div>
      </fieldset>

      <fieldset className="grid gap-4 border-0 border-t border-line pt-6 p-0">
        <legend className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gold-deep">
          Student taking the SAT
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Student first name"
            name="studentFirstName"
            required
            disabled={status === "loading"}
            autoComplete="given-name"
          />
          <Field
            label="Student last name"
            name="studentLastName"
            required
            disabled={status === "loading"}
            autoComplete="family-name"
          />
        </div>
        <Field
          label="Student email"
          name="studentEmail"
          type="email"
          required
          disabled={status === "loading"}
          placeholder="student@example.com"
          autoComplete="email"
        />
        <Field
          label="Student phone"
          name="studentPhone"
          type="tel"
          required
          disabled={status === "loading"}
          placeholder="(555) 555-5555"
          autoComplete="tel"
        />
        <Field
          label="Student zip code"
          name="studentZipCode"
          required
          disabled={status === "loading"}
          placeholder="30308"
          autoComplete="postal-code"
        />
      </fieldset>

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
            Reserve your spot
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
