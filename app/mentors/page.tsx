import type { Metadata } from "next";
import { Send, ShieldCheck, UserCheck } from "lucide-react";
import {
  ButtonLink,
  DarkCta,
  Eyebrow,
  PageHero,
  PopSection,
  SectionHeader
} from "@/components/ui";
import { mentorApplyLink, mentorStandards } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentors",
  description:
    "Illuminairy mentors are high-performing near-peer educators selected for academic credibility, communication, professionalism, and teaching ability."
};

export default function MentorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Mentors"
        title="Premium near-peer mentorship, held to a higher standard."
        text="Illuminairy mentors are selected for academic credibility, communication, professionalism, and — above all — teaching ability."
        primary={{ label: "Apply to become a mentor", href: mentorApplyLink }}
        secondary={{ label: "Contact Illuminairy", href: "/contact" }}
      >
        <div className="rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial">
          <Eyebrow tone="gold">Mentor standards</Eyebrow>
          <div className="mt-5 grid gap-3">
            {mentorStandards.map((standard) => (
              <div
                key={standard}
                className="flex gap-3 rounded-2xl border border-line bg-ivory p-4"
              >
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep"
                  aria-hidden="true"
                  strokeWidth={1.6}
                />
                <span className="text-[14px] font-medium leading-[1.5] text-ink">{standard}</span>
              </div>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Model"
            title="High-performing educated talent. Not anonymous matching."
            text="The mentor model is built around students, graduates, and senior practitioners who can make learning feel clear, current, and personal — not generic and transactional."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [
                "Near-peer clarity",
                "Students benefit from mentors who recently succeeded in demanding academic environments."
              ],
              [
                "Vetted standards",
                "Illuminairy screens for academic background, communication, reliability, and professionalism."
              ],
              [
                "Teaching ability",
                "Mentors must be able to explain concepts clearly — not just perform well themselves."
              ],
              [
                "Selective network",
                "We grow program by program while keeping the same bar for communication, reliability, and teaching."
              ]
            ].map(([title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-line bg-ivory-50 p-6 shadow-editorial"
              >
                <UserCheck className="h-5 w-5 text-gold-deep" aria-hidden="true" strokeWidth={1.6} />
                <h2 className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.018em] text-ink">
                  {title}
                </h2>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PopSection
        color="terracotta"
        eyebrow="Why mentors stay"
        title="Teach inside a program — not a marketplace."
        text="Illuminairy runs defined cohorts with clear schedules, expectations, and support. You focus on instruction and student momentum while the program handles enrollment, policies, and family communication."
        primary={{ label: "Apply as a mentor", href: mentorApplyLink }}
      >
        <div className="grid gap-3">
          {[
            ["Defined cohorts", "You know the timeline, session count, and student cap before you start."],
            ["Clear standards", "Academic credibility, communication, and teaching ability are non-negotiable."],
            ["Human support", "Questions about scheduling, families, or delivery go through the Illuminairy team."]
          ].map(([title, text]) => (
            <article
              key={title}
              className="rounded-2xl border border-terracotta-ink/15 bg-ivory/90 p-5 backdrop-blur-sm"
            >
              <h3 className="text-[15px] font-semibold tracking-[-0.012em] text-terracotta-ink">
                {title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.55] text-terracotta-ink/80">{text}</p>
            </article>
          ))}
        </div>
      </PopSection>

      <section className="bg-ivory-200/40 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="SAT mentor standard"
            title="The first cohort starts with academic credibility."
            text="For SAT programs, mentors are Georgia Tech students, Georgia Tech alumni, or similarly qualified academic mentors who scored 1450+ on the SAT where applicable. Illuminairy may verify score records, academic background, communication, professionalism, and availability."
          />
          <div className="mt-9">
            <ButtonLink href={mentorApplyLink} icon={Send}>
              Apply to become a mentor
            </ButtonLink>
          </div>
        </div>
      </section>

      <DarkCta
        title="Help build the next version of premium mentorship."
        text="Illuminairy is looking for high-performing mentors who care about clarity, preparation, and student momentum."
        primary={{ label: "Apply as a mentor", href: mentorApplyLink }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
