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
  "Weekly accountability and preparation guidance",
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
            title="Live instruction, private coaching, and accountability — built into one program."
            text="The Accelerator is designed to help students prepare with consistency, focus, and mentor guidance. It doesn't promise a specific score. It creates the structure students need to do the work."
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
              text="SAT mentors are Georgia Tech students, alumni, or similarly qualified academic mentors who scored 1450+ on the SAT where applicable — and can teach clearly."
            />
            <div className="mt-7">
              <ButtonLink href="#schedule" variant="secondary" icon={Calendar}>
                Talk to us about fit
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            {[
              "Verified SAT performance where applicable",
              "Communication and professionalism screening",
              "Near-peer perspective for college-bound students",
              "Teaching ability over generic matching"
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
          <Eyebrow>An honest note on outcomes</Eyebrow>
          <h2 className="mt-5 text-[1.75rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.125rem]">
	            We do not guarantee a score. We promise the structure.
          </h2>
          <p className="mt-5 max-w-4xl text-[15.5px] leading-[1.7] text-ink-soft">
            Illuminairy does not guarantee specific SAT score increases, admissions outcomes,
            scholarship results, or college decisions. The SAT Accelerator is designed to support
            preparation through live instruction, structured practice, diagnostics, and
            accountability — done well.
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
