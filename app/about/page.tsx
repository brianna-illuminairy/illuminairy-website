import type { Metadata } from "next";
import { Blocks, Compass, GraduationCap } from "lucide-react";
import { NorthStar } from "@/components/logo";
import { DarkCta, FeatureCard, PageHero, SectionHeader } from "@/components/ui";
import { scheduleLink, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Illuminairy runs mentorship programs starting with the SAT Accelerator — twelve weeks, Georgia Tech mentors who scored 1450+, and weekly progress reports. Based in Atlanta."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Illuminairy"
        title="Your guiding light for goals and growth."
        text="Illuminairy runs the SAT Accelerator: twelve weeks, Georgia Tech mentors who scored 1450+, week-one diagnostics, six private 1:1s, and a progress report sent to parents every week. Professional and business programs are next."
        primary={{ label: "Explore Programs", href: "/programs" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Why it exists"
            title="A better way to learn with mentors."
            text="Most SAT programs rotate through different tutors, give you vague updates, and promise scores they can't control. Illuminairy gives you a named mentor, a twelve-week schedule, and a report every week showing exactly what your student worked on and how they did."
          />
          <div className="grid gap-4">
            {[
              {
                icon: GraduationCap,
                title: "Start with a real need",
                text: "Parents spend thousands on SAT tutoring and usually can't tell if it's working. We start here because the problem is obvious and the fix is specific."
              },
              {
                icon: Blocks,
                title: "Build a clear, repeatable plan",
                text: "One twelve-week program with the same schedule every week — not one-off sessions where you start over each time."
              },
              {
                icon: Compass,
                title: "Expand with intention",
                text: "After the SAT Accelerator, we'll open professional and business programs — details and pricing published when they're ready."
              }
            ].map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-gradient px-5 py-28 sm:px-8 lg:px-12">
        <div className="absolute -right-32 top-0 -z-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(196,154,24,0.16),transparent_65%)] blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <NorthStar size={32} tone="ivory" className="mx-auto" />
          <p className="mt-6 eyebrow text-gold-light">The thesis</p>
          <blockquote className="mt-7">
            <p className="text-balance text-[clamp(1.75rem,1.1rem+2.4vw,3rem)] font-light leading-[1.15] tracking-[-0.025em] text-ivory">
              Most SAT companies rotate tutors, hide results behind vague updates, and
              promise scores they can't control. <span className="text-gold-light">Illuminairy gives
              your student a named mentor, a fixed twelve-week schedule, and a report every
              week</span> — starting with the SAT Accelerator.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Today"
            title="What Illuminairy is building right now."
            text="We are a premium mentorship company based in Atlanta, operating as Zytech Development LLC. Families and students can enroll in the Georgia Tech-led SAT Accelerator today; professional and business programs are opening next."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Live program",
                text: "Illuminairy SAT Accelerator — twelve weeks, weekly R&W and Math classes, six private 1:1s, and weekly family reports for the August 22, 2026 SAT."
              },
              {
                title: "Who we serve",
                text: "Students and families who want to know exactly what happens each week, who's teaching, and how it's going — not a tutoring center where you hope for the best."
              },
              {
                title: "How to reach us",
                text: `Support at ${site.supportEmail}. Book a consultation or send a message through contact.`
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-line bg-ivory-50 p-6 shadow-editorial"
              >
                <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-soft">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DarkCta
        title="Connect with Illuminairy."
        text="Reach out for parent inquiries, mentor applications, partnerships, billing, or general questions."
        primary={{ label: "Book a consultation", href: scheduleLink }}
        secondary={{ label: "View SAT Accelerator", href: "/sat-accelerator" }}
      />
    </>
  );
}
