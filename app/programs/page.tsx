import type { Metadata } from "next";
import {
  ButtonLink,
  DarkCta,
  Eyebrow,
  PageHero,
  PopSection,
  SectionHeader
} from "@/components/ui";
import { platformAreas, satProgram, scheduleLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Current and future Illuminairy programs. Starting with the SAT Accelerator and growing into AI upskilling, technical education, and applied expertise."
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Structured programs led by people who actively do the thing."
        text="Illuminairy starts with premium SAT preparation and is building additional programs for professionals and business owners — announced only when new sessions are scheduled."
        primary={{ label: "Explore SAT Accelerator", href: "/sat-accelerator" }}
        secondary={{ label: "Contact Illuminairy", href: "/contact" }}
      />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Current and future"
            title="Starting focused. Expanding carefully."
            text="The live product today is the Illuminairy SAT Accelerator. Other program areas below are in development and are not open for enrollment until Illuminairy announces dates."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {platformAreas.map((area) => (
              <article
                key={area.title}
                className="group rounded-2xl border border-line bg-ivory-50 p-7 transition hover:border-gold/30 hover:shadow-gold"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 text-gold-deep">
                    <area.icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
                  </div>
                  <p className="eyebrow text-gold-deep">{area.status}</p>
                </div>
                <h3 className="mt-6 text-[1.375rem] font-semibold tracking-[-0.022em] text-ink">
                  {area.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PopSection
        color="sage"
        eyebrow="Live now"
        title="Illuminairy SAT Accelerator."
        text={`${satProgram.headline} ${satProgram.structureLine} For the August 22, 2026 SAT.`}
        primary={{ label: "View the Accelerator", href: "/sat-accelerator" }}
        secondary={{ label: "Book a consultation", href: scheduleLink }}
      >
        <div className="rounded-3xl border border-sage-ink/15 bg-ivory/90 p-7 backdrop-blur-sm">
          <Eyebrow tone="sage">Program structure</Eyebrow>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {[
              ["12", "weeks"],
              ["2", "classes / week"],
              ["6", "private 1:1"],
              ["10", "max per class"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-sage-ink/10 bg-ivory p-4">
                <p className="text-[2rem] font-light leading-none tracking-[-0.04em] text-sage-ink">
                  {value}
                </p>
                <p className="mt-2 text-[12.5px] text-sage-ink/75">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </PopSection>

      <PopSection
        color="sky"
        eyebrow="In design"
        title="More programs, same standard."
        text="Illuminairy is exploring AI upskilling, technical education, business owner education, and professional coaching. We will announce dates, pricing, and enrollment only when a program is ready."
        primary={{ label: "Join the newsletter", href: "/#newsletter" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      >
        <div className="rounded-3xl border border-sky-ink/15 bg-ivory/85 p-7 backdrop-blur-sm">
          <p className="text-[16px] leading-[1.65] text-sky-ink">
            SAT prep comes first because families need clarity now. Future programs will use
            the same model: live classes, weekly reports, clear policies, and mentors held to a high bar.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[12px]">
            {["AI", "Automation", "Technical", "Business", "Coaching", "Professional", "Labs"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sky-ink/15 bg-ivory px-3 py-1 font-medium text-sky-ink"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </PopSection>

      <DarkCta
        title="Looking for the SAT Accelerator?"
        text="The SAT Accelerator is the first live Illuminairy program — and the best place for families to begin."
        primary={{ label: "View SAT Accelerator", href: "/sat-accelerator" }}
        secondary={{ label: "Contact Illuminairy", href: "/contact" }}
      />
    </>
  );
}
