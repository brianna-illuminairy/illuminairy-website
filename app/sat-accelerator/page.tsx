import type { Metadata } from "next";
import { Calendar, ShieldCheck } from "lucide-react";
import { CalendlyBookingSection } from "@/components/calendly-booking";
import {
  ButtonLink,
  DarkCta,
  Eyebrow,
  FeatureCard,
  PageHero,
  PopSection,
  SectionHeader
} from "@/components/ui";
import { satFeatures, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "SAT Accelerator",
  description:
    "Twelve weeks. Thirty live sessions. Georgia Tech-led mentorship for students preparing for the August 22, 2026 SAT."
};

const schedule = [
  "24 live small-group sessions across 12 weeks",
  "6 private 1:1 coaching sessions",
  "Weekly check-ins with your mentor on pace and priorities",
  "Diagnostic review to identify priority areas",
  "Virtual delivery for students across the United States",
  "Cohorts capped at 10 students"
];

export default function SatAcceleratorPage() {
  return (
    <>
      <PageHero
        eyebrow="Illuminairy SAT · August 2026"
        title={`A twelve-week SAT accelerator for the ${site.satDate} test.`}
        text="Structured, Georgia Tech-led mentorship for ambitious students targeting competitive colleges and 1300+ SAT scores."
        primary={{ label: "Book a free consultation", href: "#schedule" }}
        secondary={{ label: "Request program details", href: "/contact?reason=parent" }}
      >
        <div className="relative rounded-3xl border border-line bg-ivory-50 p-6 shadow-editorial sm:p-7">
          <div className="rounded-2xl bg-navy-gradient p-7 text-ivory">
            <Eyebrow tone="ivory">Program at a glance</Eyebrow>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                ["12", "weeks"],
                ["30", "live sessions"],
                ["24", "small-group"],
                ["6", "private 1:1"]
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
              For families who want a premium, organized SAT experience — without the tutoring-center feel.
            </p>
          </div>
        </div>
      </PageHero>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="What students receive"
            title="Live teaching, private coaching, and a mentor who knows your name."
            text="The Accelerator is built around the way people have always learned best: a real relationship, honest feedback, and work that earns understanding — with a clear schedule so preparation actually happens."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {satFeatures.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <PopSection
        color="marigold"
        eyebrow="Delivery"
        title="A clear virtual fulfillment model."
        text="Illuminairy sells virtual educational services. After enrollment, families receive onboarding details, cohort schedules, session links, and support instructions by email."
        primary={{ label: "Book a consultation", href: "#schedule" }}
        secondary={{ label: "View refund policy", href: "/refund-policy" }}
      >
        <div className="grid gap-3">
          {schedule.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-2xl border border-marigold-ink/15 bg-ivory/90 p-4 backdrop-blur-sm"
            >
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-marigold-ink"
                aria-hidden="true"
                strokeWidth={1.6}
              />
              <p className="text-[14px] leading-[1.55] text-marigold-ink">{item}</p>
            </div>
          ))}
        </div>
      </PopSection>

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
              "Near-peer perspective for college-bound students",
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
                study found that one-to-one tutoring can raise achievement by roughly{" "}
                <span className="font-medium text-ink">two standard deviations</span> compared with
                conventional classroom instruction — the famous &ldquo;two sigma&rdquo; result (
                <em>Educational Researcher</em>, 1984). Work on deliberate, effortful practice
                shows the same pattern: skill grows when difficulty is calibrated, feedback is
                timely, and a teacher keeps the student honest about the work.
              </p>
              <p className="font-medium text-ink">
                That is what the SAT Accelerator delivers: Georgia Tech-led mentors, cohorts
                capped at ten, twenty-four live small-group sessions, six private 1:1s, and a
                twelve-week arc that makes serious preparation the default — with transparency
                into effort and progress toward the goal, so families and students always know
                where they stand and what comes next.
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-3xl text-[16px] leading-[1.7] text-ink">
            We do not sell a score on a checkout page. We give you a mentor who lights the way,
            a structure you can see, and an honest read on effort and progress — so when the
            student takes the steps, performing well is the natural outcome, not a lottery ticket.
          </p>

          <p className="mt-8 border-t border-line pt-6 text-[13px] leading-[1.65] text-ink-muted">
            Illuminairy does not guarantee any specific SAT score, admissions result, scholarship,
            or college decision. Outcomes depend on starting point, attendance, and the effort a
            student puts in — but the model above is what makes that effort count.
          </p>
        </div>
      </section>

      <CalendlyBookingSection
        eyebrow="Schedule"
        title="Book your free SAT consultation."
        text="Pick a time below. We'll cover cohort fit, the August 2026 timeline, and enrollment details."
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
