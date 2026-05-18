import type { Metadata } from "next";
import { Send, ShieldCheck, UserCheck } from "lucide-react";
import { ButtonLink, DarkCta, PageHero, SectionHeader } from "@/components/ui";
import { inquiryLink, mentorStandards } from "@/lib/site";

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
        text="Illuminairy mentors are selected for academic credibility, communication ability, professionalism, and teaching potential."
        primary={{ label: "Apply to Become a Mentor", href: inquiryLink }}
        secondary={{ label: "Contact Illuminairy", href: "/contact" }}
      >
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="grid gap-3">
            {mentorStandards.map((standard) => (
              <div key={standard} className="flex gap-3 rounded-lg border border-line bg-cloud p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo" aria-hidden="true" />
                <span className="text-sm font-medium text-ink">{standard}</span>
              </div>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Model"
            title="High-performing educated talent, not anonymous matching."
            text="The mentor model is built around students, graduates, and professionals who can make learning feel clear, current, and personal."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Near-peer clarity", "Students benefit from mentors who recently succeeded in demanding academic environments."],
              ["Vetted standards", "Illuminairy screens for academic background, communication, reliability, and professionalism."],
              ["Teaching ability", "Mentors must be able to explain concepts clearly, not just perform well themselves."],
              ["Selective network", "The long-term platform depends on a high-quality talent standard across program areas."]
            ].map(([title, text]) => (
              <article key={title} className="rounded-lg border border-line bg-white p-6 shadow-ringed">
                <UserCheck className="h-5 w-5 text-indigo" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold tracking-[-0.025em] text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slatecopy">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="SAT mentor standard"
            title="The first cohort starts with academic credibility."
            text="For SAT programs, mentors are Georgia Tech students, Georgia Tech alumni, or similarly qualified academic mentors who scored 1450+ on the SAT where applicable. Illuminairy may verify score records, academic background, communication skill, professionalism, and availability."
          />
          <div className="mt-8">
            <ButtonLink href={inquiryLink} icon={Send}>
              Apply to Become a Mentor
            </ButtonLink>
          </div>
        </div>
      </section>

      <DarkCta
        title="Help build the next version of premium mentorship."
        text="Illuminairy is looking for high-performing mentors who care about clarity, preparation, and student momentum."
        primary={{ label: "Apply as a Mentor", href: inquiryLink }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
