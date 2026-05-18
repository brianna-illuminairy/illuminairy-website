import Link from "next/link";
import { ArrowRight, Calendar, GraduationCap, UserCheck, Users } from "lucide-react";
import { CohortsPanel } from "@/components/brand-visual";
import { NorthStar } from "@/components/logo";
import {
  ButtonLink,
  DarkCta,
  Eyebrow,
  FeatureCard,
  PopSection,
  SectionHeader
} from "@/components/ui";
import { mentorApplyLink, programStats, scheduleLink, site, trustPillars } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-ivory-gradient" />
        <div className="absolute inset-0 -z-10 bg-paper-grain" />
        <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(196,154,24,0.10),transparent_62%)] blur-2xl" />

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <NorthStar size={20} tone="ivory" glow={false} />
              <Eyebrow tone="gold">{site.tagline}</Eyebrow>
            </div>

            <h1 className="mt-6 text-balance text-[clamp(2.5rem,1.5rem+4vw,4.75rem)] font-extralight leading-[1.02] tracking-[-0.035em] text-ink">
              The right mentor for where you&apos;re headed.
            </h1>

            <p className="mt-7 max-w-xl text-pretty text-lg leading-[1.65] text-ink-soft sm:text-xl">
              Premium near-peer mentorship with structure, clarity, and a high
              bar. Two SAT cohorts are live now — with professional and business
              owner programs opening next.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={scheduleLink} icon={Calendar}>
                Book a consultation
              </ButtonLink>
              <ButtonLink href={mentorApplyLink} variant="secondary" icon={ArrowRight}>
                Apply as a mentor
              </ButtonLink>
            </div>
          </div>

          <CohortsPanel />
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-line/70 bg-ivory-200/50 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {programStats.map((stat) => (
            <div key={stat.label} className="px-2">
              <p className="text-[2.5rem] font-extralight leading-none tracking-[-0.04em] text-ink">
                {stat.value}
              </p>
              <p className="mt-3 text-[13.5px] leading-[1.5] text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAT — marigold pop */}
      <PopSection
        color="marigold"
        eyebrow="Live now · August 2026 SAT"
        title="Illuminairy SAT Accelerator."
        text={`Twelve weeks. Thirty live sessions. Ten students per cohort. Georgia Tech-led mentorship for students preparing for the ${site.satDate} SAT.`}
        primary={{ label: "View the Accelerator", href: "/sat-accelerator" }}
        secondary={{ label: "Book a consultation", href: scheduleLink }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "24 live small-group sessions",
            "6 private 1:1 coaching sessions",
            "Diagnostic-driven weekly plan",
            "Virtual delivery nationwide"
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-marigold-ink/15 bg-ivory/90 px-5 py-4 text-[14px] font-medium leading-snug text-marigold-ink backdrop-blur-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </PopSection>

      {/* Company + trust */}
      <section className="bg-ivory px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why illuminairy"
            title="Structure you can see. Mentors you can trust."
            text="Families get a clear program outline, live schedule, and policies upfront. Students get near-peer guidance and weekly mentor check-ins. Every cohort has a defined schedule and a real human mentor — not a random name from a tutoring website."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trustPillars.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Audience paths — sage pop */}
      <PopSection
        color="sage"
        eyebrow="Who it's for"
        title="Built for families, students, and mentors."
        text="Parents evaluating SAT prep. Students aiming for competitive colleges. Mentors who want meaningful, well-structured work with a high bar for quality."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              label: "Families & students",
              text: "Structured SAT cohorts, clear policies, and a direct path to enrollment.",
              href: "/sat-accelerator"
            },
            {
              icon: UserCheck,
              label: "Mentors",
              text: "Georgia Tech-led standards today. More program areas as cohorts open.",
              href: "/mentors"
            },
            {
              icon: Users,
              label: "Programs",
              text: "SAT live now. AI for Professionals and Business Owners opening soon.",
              href: "/programs"
            }
          ].map(({ icon: Icon, label, text, href }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-2xl border border-sage-ink/15 bg-ivory/90 p-6 backdrop-blur-sm transition hover:border-sage-ink/30"
            >
              <Icon className="h-5 w-5 text-sage-ink" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.015em] text-sage-ink">
                {label}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.55] text-sage-ink/80">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-sage-ink/70 group-hover:text-sage-ink">
                Learn more
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </PopSection>

      {/* Trust + clarity */}
      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-navy-gradient p-9 text-ivory sm:p-11">
            <Eyebrow tone="ivory">The model</Eyebrow>
            <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-[-0.03em] sm:text-4xl">
              Mentorship with a high bar.
            </h2>
            <p className="mt-6 max-w-md text-[15.5px] leading-[1.65] text-ivory/72">
              Small cohorts, clear structure, and mentors we would trust with our
              own goals. Quality and clarity over volume.
            </p>
            <p className="wordmark mt-10 text-[clamp(2.5rem,5vw,4rem)] leading-none text-ivory">
              illumin<span className="text-gold-light">ai</span>ry
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-line bg-ivory-50 p-9 sm:p-11">
            <div>
              <Eyebrow>Trust & policies</Eyebrow>
              <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-[-0.03em] text-ink sm:text-4xl">
                Clear policies. Straightforward next steps.
              </h2>
            </div>
            <ul className="mt-10 grid gap-0">
              {[
                { label: "Refund policy", href: "/refund-policy" },
                { label: "Support policy", href: "/support-policy" },
                { label: "Terms of service", href: "/terms" },
                { label: "Privacy policy", href: "/privacy" },
                { label: "Contact & enrollment", href: "/contact" }
              ].map(({ label, href }) => (
                <li key={href} className="border-t border-line first:border-t-0">
                  <Link
                    href={href}
                    className="flex items-center justify-between py-4 text-[14.5px] font-medium text-ink-soft transition hover:text-ink"
                  >
                    {label}
                    <ArrowRight className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <DarkCta
        title="Start with a conversation."
        text="Parents and students: book a short call about the SAT Accelerator. Mentors: apply through contact. Everyone else: send a message anytime."
        primary={{ label: "Book a consultation", href: scheduleLink }}
        secondary={{ label: "Contact illuminairy", href: "/contact" }}
      />
    </>
  );
}
