"use client";

import { useState } from "react";
import type { PortalProfile, PortalProfileContact } from "@/lib/portal/load-dashboard";
import {
  canClearPortalProfileField,
  portalProfileFieldLabel,
  validatePortalProfilePatch,
  type PortalProfilePatch,
} from "@/lib/portal/profile-contact";

type Props = {
  profile: PortalProfile;
  canEdit: boolean;
};

export function PortalProfileEditor({ profile, canEdit }: Props) {
  const [baseline, setBaseline] = useState<PortalProfileContact>(profile.contact);
  const [contact, setContact] = useState<PortalProfileContact>(profile.contact);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof PortalProfilePatch>(key: K, value: string) {
    if (!canClearPortalProfileField(baseline, key) && !value.trim()) {
      setError(`${portalProfileFieldLabel(key)} can't be removed. Update it or contact support.`);
      return;
    }
    setContact((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
    setError(null);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;

    const validated = validatePortalProfilePatch(baseline, {
      studentFirst: contact.studentFirst,
      parentFirst: contact.parentFirst,
      parentLast: contact.parentLast,
      parentPhone: contact.parentPhone,
      parentZip: contact.parentZip,
    });
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentFirst: validated.merged.studentFirst,
          parentFirst: validated.merged.parentFirst,
          parentLast: validated.merged.parentLast,
          parentPhone: validated.merged.parentPhone,
          parentZip: validated.merged.parentZip,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save. Try again.");
        return;
      }
      setBaseline(validated.merged);
      setContact(validated.merged);
      setMessage("Saved.");
    } catch {
      setError("Could not save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="portal-profile-page">
      <header className="portal-profile-page__head">
        <p className="portal-profile-page__eyebrow">Account</p>
        <h1 className="portal-profile-page__title">Profile</h1>
        <p className="portal-profile-page__lede">
          Add or update contact details for your family and lesson reminders. Saved fields
          can&apos;t be cleared here.
        </p>
      </header>

      {canEdit ? (
        <form className="portal-profile-page__section" onSubmit={onSave}>
          <h2 className="portal-profile-page__section-title">Contact</h2>
          <div className="portal-profile-page__fields">
            <label className="portal-profile-page__field">
              <span className="portal-profile-page__label">Student first name</span>
              <input
                type="text"
                autoComplete="given-name"
                required
                value={contact.studentFirst}
                onChange={(e) => setField("studentFirst", e.target.value)}
                className="portal-profile-page__input"
              />
            </label>
            <label className="portal-profile-page__field">
              <span className="portal-profile-page__label">Parent first name</span>
              <input
                type="text"
                autoComplete="given-name"
                value={contact.parentFirst}
                onChange={(e) => setField("parentFirst", e.target.value)}
                className="portal-profile-page__input"
                placeholder={baseline.parentFirst ? undefined : "Add parent first name"}
              />
            </label>
            <label className="portal-profile-page__field">
              <span className="portal-profile-page__label">Parent last name</span>
              <input
                type="text"
                autoComplete="family-name"
                value={contact.parentLast}
                onChange={(e) => setField("parentLast", e.target.value)}
                className="portal-profile-page__input"
                placeholder={baseline.parentLast ? undefined : "Add parent last name"}
              />
            </label>
            <div className="portal-profile-page__field">
              <span className="portal-profile-page__label">Email</span>
              <p className="portal-profile-page__readonly">{contact.parentEmail}</p>
              <p className="portal-profile-page__hint">
                Email is tied to your login. Contact support to change it.
              </p>
            </div>
            <label className="portal-profile-page__field">
              <span className="portal-profile-page__label">Phone</span>
              <input
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={contact.parentPhone}
                onChange={(e) => setField("parentPhone", e.target.value)}
                className="portal-profile-page__input"
                placeholder={baseline.parentPhone ? undefined : "Add phone number"}
              />
            </label>
            <label className="portal-profile-page__field">
              <span className="portal-profile-page__label">Zip code</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={contact.parentZip}
                onChange={(e) => setField("parentZip", e.target.value)}
                className="portal-profile-page__input"
                maxLength={10}
                placeholder={baseline.parentZip ? undefined : "Add zip code"}
              />
            </label>
          </div>

          {error ? (
            <p className="portal-profile-page__error" role="alert">
              {error}
            </p>
          ) : null}
          {message ? <p className="portal-profile-page__success">{message}</p> : null}

          <button type="submit" className="portal-profile-page__save" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      ) : (
        <section className="portal-profile-page__section">
          <h2 className="portal-profile-page__section-title">Contact</h2>
          <dl className="portal-profile-page__readonly-list">
            <div>
              <dt>Student</dt>
              <dd>{profile.studentName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile.parentEmail}</dd>
            </div>
          </dl>
          <p className="portal-profile-page__hint">
            Sign in with the email you used on your SAT Score Path to edit this profile.
          </p>
        </section>
      )}

      {profile.programFields.length > 0 ? (
        <section className="portal-profile-page__section portal-profile-page__section--readonly">
          <h2 className="portal-profile-page__section-title">From your SAT Score Path</h2>
          <p className="portal-profile-page__hint">
            These answers shape your lesson plan. Reply to your lesson confirmation email if
            something changed.
          </p>
          <dl className="portal-profile-page__readonly-list">
            {profile.programFields.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
