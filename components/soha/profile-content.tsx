import Link from "next/link";
import {
  profileFullName,
  SOHA_PROFILE,
  type ProfilePerson,
} from "@/lib/soha/profile-data";
import { SOHA_BOOTCAMP_ENROLL_PATH } from "@/components/soha/portal-shell";

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
        {person.email ? (
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${person.email}`}>{person.email}</a>
            </dd>
          </div>
        ) : null}
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

export function SohaProfileContent() {
  return (
    <div className="skye-profile">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Student profile</p>
        <h1 className="aurora-portal__title">Soha&apos;s profile</h1>
      </header>

      <section className="skye-profile__section">
        <h2>Family</h2>
        <div className="skye-profile__people">
          <PersonCard person={SOHA_PROFILE.parent} />
          <PersonCard person={SOHA_PROFILE.student} />
        </div>
      </section>

      <section className="skye-profile__section">
        <h2>Program plan</h2>
        <p className="skye-profile__section-lede">
          Soha is not enrolled yet. The improvement plan and diagnostic analysis are ready; enrollment
          is through the{" "}
          <Link href={SOHA_BOOTCAMP_ENROLL_PATH}>August 22 bootcamp page</Link>. Week-by-week skills
          are on the <Link href="/soha/plan">SAT Improvement Plan</Link>.
        </p>
        <dl className="skye-profile__timeline skye-profile__timeline--plan">
          {SOHA_PROFILE.programPlan.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="skye-profile__section">
        <h2>About Soha</h2>
        <ul className="skye-profile__list">
          {SOHA_PROFILE.about.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="skye-profile__section">
        <h2>Testing history and notes</h2>
        <ul className="skye-profile__list">
          {SOHA_PROFILE.testingNotes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="skye-profile__section">
        <h2>Timeline</h2>
        <dl className="skye-profile__timeline">
          {SOHA_PROFILE.timeline.map((row) => (
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
          {SOHA_PROFILE.workingOn.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="skye-profile__links">
          See the <Link href="/soha/diagnostic">diagnostic analysis</Link> for question-level detail and
          the <Link href="/soha/plan">SAT Improvement Plan</Link> for the weekly schedule, error log
          approach, and mistake-driven review.
        </p>
      </section>
    </div>
  );
}
