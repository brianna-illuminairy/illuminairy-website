import type { Metadata } from "next";
import { Calendar, FileText, Mail, ShieldCheck } from "lucide-react";
import { ButtonLink, DarkCta, FeatureCard, PageHero, SectionHeader } from "@/components/ui";
import { bookLink, inquiryLink, satFeatures, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "SAT Accelerator",
  description:
    "A 12-week virtual SAT program with 30 live sessions, private coaching, diagnostics, and accountability for students preparing for the August 22, 2026 SAT."
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
        eyebrow="Illuminairy SAT Accelerator"
        title={`A 12-week SAT accelerator for students preparing for the ${site.satDate} SAT.`}
        text="A structured virtual SAT program for ambitious students targeting competitive colleges and 1300+ SAT scores."
        primary={{ label: "Book a Free SAT Consultation", href: bookLink }}
        secondary={{ label: "Request Program Details", href: inquiryLink }}
      >
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <div className="rounded-xl bg-ink p-6 text-white">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">
              Program structure
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                ["12", "weeks"],
                ["30", "live sessions"],
                ["24", "small-group"],
                ["6", "private 1:1"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-3xl font-semibold tracking-[-0.05em]">{value}</p>
                  <p className="mt-1 text-sm text-white/62">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-line bg-cloud p-5">
            <p className="text-sm font-medium text-ink">
              Built for families who want a premium, organized SAT prep experience without generic tutoring.
            </p>
          </div>
        </div>
      </PageHero>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="What students receive"
            title="Live instruction, private coaching, and accountability in one structured program."
            text="The Accelerator is designed to help students prepare with consistency, focus, and mentor guidance. It does not guarantee a specific score; it creates the structure students need to do serious work."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {satFeatures.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionHeader
              eyebrow="Delivery"
              title="A clear virtual fulfillment model."
              text="Illuminairy sells virtual educational services. After enrollment, families receive onboarding details, cohort schedules, session links, and support instructions by email."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={bookLink} icon={Calendar}>
                Book a Consultation
              </ButtonLink>
              <ButtonLink href="/refund-policy" variant="secondary" icon={FileText}>
                View Refund Policy
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-3">
            {schedule.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-line bg-cloud/70 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo" aria-hidden="true" />
                <p className="text-sm leading-6 text-slatecopy">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeader
              eyebrow="Mentors"
              title="Georgia Tech-led, with a high bar."
              text="SAT mentors are Georgia Tech students, alumni, or similarly qualified academic mentors who scored 1450+ on the SAT where applicable and can teach clearly."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            {[
              "Verified SAT performance where applicable",
              "Communication and professionalism screening",
              "Near-peer perspective for college-bound students",
              "Teaching ability over generic matching"
            ].map((text) => (
              <div key={text} className="rounded-lg border border-line bg-white p-6 shadow-ringed">
                <p className="text-base font-medium text-ink">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-2xl border border-line bg-cloud p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-ink">
            Important outcome note
          </h2>
          <p className="mt-4 max-w-4xl leading-7 text-slatecopy">
            Illuminairy does not guarantee specific SAT score increases,
            admissions outcomes, scholarship results, or college decisions. The
            SAT Accelerator is designed to support preparation through live
            instruction, structured practice, diagnostics, and accountability.
          </p>
        </div>
      </section>

      <DarkCta
        title="Request fit, schedule, and enrollment details."
        text="Pricing and cohort enrollment details are shared during consultation so families can confirm fit before moving forward."
        primary={{ label: "Book a Free SAT Consultation", href: bookLink }}
        secondary={{ label: "Email Illuminairy", href: `mailto:${site.email}` }}
      />
    </>
  );
}
