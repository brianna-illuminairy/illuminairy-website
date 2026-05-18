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
    "Near-peer expert mentorship at Illuminairy — mentors selected for academic credibility, communication, professionalism, and the ability to instruct small groups and mentor one-on-one."
};

export default function MentorsPage() {
  // Mentor flow: apply via contact form → team reviews → invite-only interview Calendly link by email (see lib/internal-links.ts).
  return (
    <>
      <PageHero
        eyebrow="Mentors"
        title="Near-peer expert mentorship."
        text="Illuminairy mentors are selected for academic credibility, communication, professionalism, and — above all — their ability to instruct small groups and mentor one-on-one. Apply first; if you are a fit, we will email you a link to schedule an interview."
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
            title="The mentor your student actually wants to learn from."
            text="Illuminairy mentors are role models first — people who have succeeded in demanding academic environments and can show students what is possible, hold them accountable, and teach in a way that feels personal, not transactional."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [
                "Role models who've been there",
                "Mentors show students what's possible because they have walked the path themselves — recently, credibly, and relatably."
              ],
              [
                "Vetted standards",
                "Illuminairy screens for academic background, communication, reliability, and professionalism."
              ],
              [
                "Small groups and 1:1",
                "Mentors must instruct live classes clearly and mentor students one-on-one — not just perform well on tests themselves."
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
        text="Illuminairy runs defined programs with clear schedules, expectations, and support. You focus on instruction and student momentum while the team handles enrollment, policies, and family communication."
        primary={{ label: "Apply as a mentor", href: mentorApplyLink }}
      >
        <div className="grid gap-3">
          {[
            ["Clear schedule", "You know the timeline, session count, and class size before you start."],
            ["Clear standards", "Academic credibility, communication, and teaching ability are non-negotiable."],
            ["Human support", "Questions about scheduling, families, or the program go through the Illuminairy team."]
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
            title="The SAT program starts with academic credibility."
            text="For SAT programs, mentors are Georgia Tech students, Georgia Tech alumni, or similarly qualified academic mentors who scored 1450+ on the SAT. Illuminairy verifies score records, academic background, communication, professionalism, and availability."
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
