import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { CalendlyBookingSection } from "@/components/calendly-booking";
import {
  ButtonLink,
  DarkCta,
  Eyebrow,
  FeatureCard,
  PageHero,
  SectionHeader
} from "@/components/ui";
import { AcceleratorModel } from "@/components/accelerator-model";
import { ProgramDifferentiation } from "@/components/program-differentiation";
import { mentorshipMessaging, satFeatures, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "SAT Accelerator",
  description:
    "Twelve weeks with weekly Reading & Writing and Math classes, private 1:1 sessions, and weekly progress reports for the August 22, 2026 SAT."
};

export default function SatAcceleratorPage() {
  return (
    <>
      <PageHero
        eyebrow="Illuminairy SAT · August 2026"
        title={`Better mentors and instructors — for the ${site.satDate} SAT.`}
        text={mentorshipMessaging.thesis}
        primary={{ label: "Book a free consultation", href: "#schedule" }}
        secondary={{ label: "Request program details", href: "/contact?reason=parent" }}
      >
        <div className="relative rounded-3xl border border-line bg-ivory-50 p-6 shadow-editorial sm:p-7">
          <div className="rounded-2xl bg-navy-gradient p-7 text-ivory">
            <Eyebrow tone="ivory">Program at a glance</Eyebrow>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                ["12", "weeks"],
                ["2", "classes / week"],
                ["6", "private 1:1"],
                ["10", "max per class"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-ivory/10 bg-ivory/[0.04] p-4">
                  <p className="text-[2.25rem] font-light leading-none tracking-[-0.04em] text-ivory">
                    {value}
                  </p>
                  <p className="mt-2 text-[12.5px] text-ivory/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-line bg-ivory-200/60 p-5">
            <p className="text-[14px] font-medium leading-[1.55] text-ink">
              Not self-study. Not à la carte sessions. One twelve-week program with
              diagnostics, six 1:1s, live classes each week, and practice built in.
            </p>
          </div>
        </div>
      </PageHero>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="What's included"
            title="Mentors and instructors inside a model built around 1:1."
            text="Georgia Tech mentors (1450+ SAT) lead your student's 1:1s; instructors teach live R&W and Math classes — all inside one fixed plan. Diagnostics personalize six private sessions, and practice reinforces what was taught every week. After enrollment, your family gets class times, session links, and your mentor's name before week one."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {satFeatures.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
          <p className="mt-10 text-center text-[14px] text-ink-muted">
            Classes capped at 10 students.{" "}
            <a
              href="/refund-policy"
              className="font-medium text-gold-deep underline-offset-2 hover:underline"
            >
              Refund policy
            </a>
          </p>
        </div>
      </section>

      <AcceleratorModel />

      <ProgramDifferentiation showResearchNote={false} />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeader
              eyebrow="Mentors"
              title="Georgia Tech-led, with a high bar."
              text="SAT mentors are Georgia Tech students, alumni, or similarly qualified academic mentors who scored 1450+ on the SAT — and can teach clearly."
            />
            <div className="mt-7">
              <ButtonLink href="#schedule" variant="secondary" icon={Calendar}>
                Talk to us about fit
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            {[
              "Verified 1450+ SAT scores",
              "Communication and professionalism screening",
              "Relatable role models for college-bound students",
              "Chosen for teaching ability — not assigned at random"
            ].map((text) => (
              <div
                key={text}
                className="rounded-2xl border border-line bg-ivory-50 p-6 shadow-editorial"
              >
                <p className="text-[15px] font-medium leading-[1.55] text-ink">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory-200/50 px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-line bg-ivory p-9">
          <Eyebrow tone="gold">How people actually learn</Eyebrow>
          <h2 className="mt-5 text-balance text-[1.75rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.25rem]">
            The oldest model of learning — built for the SAT.
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-5 text-[15.5px] leading-[1.75] text-ink-soft">
              <p>
                For most of human history, the deepest learning did not happen in a lecture hall
                with hundreds of faces. It happened in relationship: one teacher, one student,
                honest feedback, and work that earns understanding. Socrates with his
                interlocutors. Aristotle with Alexander. A bonded pair — not a conveyor belt.
              </p>
              <p>
                That is still how mastery forms. A mentor can light the way — see the path,
                name the next move, hold the standard. Only the student can take the steps. Our
                job is to make both roles clear: guidance from someone who has walked it, and
                ownership of the work that actually moves the score.
              </p>
            </div>

            <div className="space-y-5 text-[15.5px] leading-[1.75] text-ink-soft">
              <p>
                Research has measured what intuition already knew. Benjamin Bloom&apos;s landmark
                study found that one-to-one instruction can raise achievement by roughly{" "}
                <span className="font-medium text-ink">two standard deviations</span> compared with
                conventional classroom instruction — the famous &ldquo;two sigma&rdquo; result (
                <em>Educational Researcher</em>, 1984). Mentor-led programs in college show the same
                pattern in a different form: students learn better when someone close to their
                experience gives timely feedback, holds them accountable, and makes it safe to
                ask real questions — not when they sit in another lecture.
              </p>
              <p className="font-medium text-ink">
                That is what the SAT Accelerator delivers: better mentors and instructors
                (Georgia Tech, 1450+), a better model than self-study or random sessions,
                week-one diagnostics
                that shape six private 1:1s, live classes, practice that reinforces through
                repetition, and weekly reports — so families always know what was covered and
                what&apos;s due.
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-3xl border-t border-line pt-8 text-[14.5px] leading-[1.7] text-ink-soft">
            You get a mentor who knows the material, a schedule your family can follow, and
            weekly clarity on effort and progress — not a promised score. Illuminairy does not
            guarantee any specific SAT score, admissions result, scholarship, or college decision;
            outcomes depend on starting point, attendance, and the work a student puts in. This
            program is built to make that work count.
          </p>
        </div>
      </section>

      <CalendlyBookingSection
        eyebrow="Schedule"
        title="Book your free SAT consultation."
        text="Pick a time below. We'll cover program fit, the August 2026 timeline, and enrollment details."
      />

      <DarkCta
        title="Questions before you book?"
        text="Email us for program details, or use the scheduler above to reserve a consultation."
        primary={{ label: "Book a consultation", href: "#schedule" }}
        secondary={{ label: "Email Illuminairy", href: `mailto:${site.supportEmail}` }}
      />
    </>
  );
}
