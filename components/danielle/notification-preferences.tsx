"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { formatDaniellePhoneDisplay } from "@/lib/danielle-phone";

type SubscriptionPayload = {
  email: string;
  phone: string | null;
  emailOptIn: boolean;
  smsOptIn: boolean;
};

type ApiState = {
  configured: boolean;
  subscription: SubscriptionPayload | null;
};

export function DanielleNotificationPreferences() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [phone, setPhone] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/danielle/notifications");
        if (!res.ok || cancelled) {
          return;
        }
        const data = (await res.json()) as ApiState;
        if (cancelled) {
          return;
        }
        setConfigured(data.configured);
        if (data.subscription) {
          setEmailOptIn(data.subscription.emailOptIn);
          setSmsOptIn(data.subscription.smsOptIn);
          setPhone(data.subscription.phone ? formatDaniellePhoneDisplay(data.subscription.phone) : "");
        }
      } catch {
        if (!cancelled) {
          setError("Could not load notification settings.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/danielle/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          emailOptIn,
          smsOptIn
        })
      });

      const data = (await res.json()) as {
        error?: string;
        dispatched?: number;
      };

      if (!res.ok) {
        setError(data.error ?? "Could not save preferences.");
        return;
      }

      if (data.dispatched && data.dispatched > 0) {
        setMessage("Saved. We sent alerts for new portal updates you had not received yet.");
      } else {
        setMessage("Saved. You will get an email and/or text when something new is added.");
      }
    } catch {
      setError("Could not save preferences.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="danielle-portal__lede">Loading notification settings…</p>;
  }

  if (!configured) {
    return (
      <p className="danielle-portal__lede">
        Portal alerts are not set up yet. Contact Illuminairy if you need help.
      </p>
    );
  }

  return (
    <form className="danielle-portal__notify-form" onSubmit={submit}>
      <label className="danielle-portal__field">
        <span>Mobile number (for texts)</span>
        <input
          type="tel"
          className="danielle-portal__input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="(404) 555-0100"
        />
      </label>

      <label className="danielle-portal__notify-check">
        <input
          type="checkbox"
          checked={emailOptIn}
          onChange={(e) => setEmailOptIn(e.target.checked)}
        />
        <span>Email me when something new is added to my portal</span>
      </label>

      <label className="danielle-portal__notify-check">
        <input
          type="checkbox"
          checked={smsOptIn}
          onChange={(e) => setSmsOptIn(e.target.checked)}
        />
        <span>
          Text me when something new is added to my portal. Message frequency varies. Msg and data
          rates may apply. Reply STOP to opt out.
        </span>
      </label>

      {error ? <p className="danielle-portal__error">{error}</p> : null}
      {message ? <p className="danielle-portal__notify-success">{message}</p> : null}

      <button type="submit" disabled={saving} className="danielle-portal__button">
        {saving ? "Saving…" : "Save notification preferences"}
      </button>
    </form>
  );
}

export function DanielleNotificationPreferencesPage() {
  return (
    <DaniellePortalShell>
      <Link href="/danielle/week-1" className="danielle-portal__back">
        ← Week 1
      </Link>
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Portal alerts</p>
        <h1>Get notified</h1>
        <p className="danielle-portal__lede">
          Turn on email and text alerts for session summaries, lesson updates, and new materials in
          your private portal.
        </p>
      </div>
      <div className="danielle-portal__card danielle-portal__card--wide">
        <DanielleNotificationPreferences />
      </div>
    </DaniellePortalShell>
  );
}
