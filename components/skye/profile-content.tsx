import Link from "next/link";
import { profileFullName, SKYE_PROFILE, type ProfilePerson } from "@/lib/skye/profile-data";

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function PersonCard({ person }: { person: ProfilePerson }) {
  return (
    <article className="skye-profile__person">
      <p className="skye-profile__person-role">{person.role}</p>
      <h2 className="skye-profile__person-name">{profileFullName(person)}</h2>
      <dl className="skye-profile__facts">
        <ProfileField label="First name" value={person.firstName} />
        <ProfileField label="Last name" value={person.lastName} />
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${person.email}`}>{person.email}</a>
          </dd>
        </div>
        {person.phone ? (
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${person.phone.replace(/\D/g, "")}`}>{person.phone}</a>
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}

export function SkyeProfileContent() {
  return (
    <div className="skye-profile">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Student profile</p>
        <h1 className="aurora-portal__title">Skye&apos;s profile</h1>
      </header>

      <section className="skye-profile__section">
        <h2>Family</h2>
        <div className="skye-profile__people">
          <PersonCard person={SKYE_PROFILE.parent} />
          <PersonCard person={SKYE_PROFILE.student} />
        </div>
      </section>

      <section className="skye-profile__section">
        <h2>Program plan</h2>
        <p className="skye-profile__section-lede">
          How twice-weekly tutoring, homework, and practice tests fit together. The week-by-week skill
          list is on the{" "}
          <Link href="/skye/plan">improvement plan</Link> page (still being updated).
        </p>
        <dl className="skye-profile__timeline skye-profile__timeline--plan">
          {SKYE_PROFILE.programPlan.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="skye-profile__section">
        <h2>About Skye</h2>
        <ul className="skye-profile__list">
          {SKYE_PROFILE.about.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="skye-profile__section">
        <h2>Testing history and notes</h2>
        <ul className="skye-profile__list">
          {SKYE_PROFILE.testingNotes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="skye-profile__section">
        <h2>Timeline</h2>
        <dl className="skye-profile__timeline">
          {SKYE_PROFILE.timeline.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="skye-profile__section">
        <h2>What we are working on</h2>
        <ul className="skye-profile__list">
          {SKYE_PROFILE.workingOn.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="skye-profile__links">
          See the{" "}
          <Link href="/skye/diagnostic">diagnostic analysis</Link> for question-level detail and the{" "}
          <Link href="/skye/plan">improvement plan</Link> for the weekly schedule.
        </p>
      </section>
    </div>
  );
}
