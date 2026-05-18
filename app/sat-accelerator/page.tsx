import type { Metadata } from "next";
import { Calendar, Check } from "lucide-react";
import { CalendlyBookingSection } from "@/components/calendly-booking";
import { DigitalSatCallout } from "@/components/digital-sat-callout";
import { NoGuaranteeSection } from "@/components/no-guarantee-section";
import { SatPillars } from "@/components/sat-pillars";
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
import {
  commitments,
  consultationCopy,
  satFeatures,
  satHero,
  site
} from "@/lib/site";

export const metadata: Metadata = {
  title: "SAT Accelerator",
  description:
    "Twelve weeks with Georgia Tech mentors (1450+ SAT), week-one diagnostics, six personalized 1:1s, live classes, and weekly progress reports for families targeting selective admissions — August 22, 2026 SAT."
};

export default function SatAcceleratorPage() {
  return (
    <>
      <PageHero
        eyebrow="Illuminairy SAT · August 2026"
        title={satHero.title}
        text={satHero.lead}
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
              Not self-study. Not a tutor marketplace. One guided program from
              diagnostics to test day.
            </p>
          </div>
        </div>
      </PageHero>

      {/* Commitments strip */}
      <section className="border-y border-line/70 bg-ivory-200/50 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-center text-gold-deep">What we commit to</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((item) => (
              <li key={item} className="flex gap-3 px-2 text-[14px] leading-[1.6] text-ink-soft">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="What's included"
            title="Mentors and instructors — built around 1:1."
            text="Georgia Tech mentors (1450+ SAT) run your student's 1:1s. Instructors teach live R&W and Math classes. Week-one diagnostics tell the mentor which question types to focus on, and practice is assigned between every session. After enrollment, you get class times, session links, and your mentor's name before week one."
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

      <SatPillars />

      <ProgramDifferentiation showResearchNote={false} />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeader
              eyebrow="Mentors"
              title="Georgia Tech-led, with a high bar."
              text="SAT mentors are Georgia Tech students, alumni, or similarly qualified mentors who scored 1450+ on the SAT — screened for how they explain things, not just their score."
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
              "Recently took the same test your student is preparing for",
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

      <NoGuaranteeSection />

      <DigitalSatCallout />

      <section className="bg-ivory-200/50 px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-line bg-ivory p-9">
          <Eyebrow tone="gold">Research-informed</Eyebrow>
          <h2 className="mt-5 text-balance text-[1.75rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.25rem]">
            The oldest way people learn — built for the SAT.
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-5 text-[15.5px] leading-[1.75] text-ink-soft">
              <p>
                Most learning that actually changes how someone performs doesn't happen in a
                lecture hall. It happens when one person who knows the material sits with one
                person who doesn't, spots exactly where they're going wrong, and explains it
                until they get it right.
              </p>
              <p>
                That's what the 1:1 sessions are for. The mentor sees your student's errors,
                knows the test, and spends the session on the specific problems your student
                keeps missing. The student does the work — the mentor makes sure it's the
                right work.
              </p>
            </div>

            <div className="space-y-5 text-[15.5px] leading-[1.75] text-ink-soft">
              <p>
                Benjamin Bloom&apos;s landmark study found that one-to-one instruction can raise
                achievement by roughly{" "}
                <span className="font-medium text-ink">two standard deviations</span> compared with
                conventional classroom instruction — the famous &ldquo;two sigma&rdquo; result (
                <em>Educational Researcher</em>, 1984). Students learn better when someone close to
                their experience gives timely feedback, holds them accountable, and makes it safe to
                ask real questions.
              </p>
              <p className="font-medium text-ink">
                That is what the SAT Accelerator delivers: Georgia Tech mentors (1450+),
                a clear twelve-week plan, week-one diagnostics that shape six private 1:1s, live
                classes, practice that reinforces through repetition, and weekly reports — so
                families always know what was covered and what&apos;s due.
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
        eyebrow={consultationCopy.eyebrow}
        title={consultationCopy.title}
        text={consultationCopy.text}
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
