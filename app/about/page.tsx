import type { Metadata } from "next";
import { Blocks, Compass, GraduationCap } from "lucide-react";
import { NorthStar } from "@/components/logo";
import { DarkCta, FeatureCard, PageHero, SectionHeader } from "@/components/ui";
import { scheduleLink, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Illuminairy is a premium mentorship and applied learning company — illuminate + luminary. Launching with Georgia Tech-led SAT preparation and expanding from there."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Illuminairy"
        title="Your guiding light for goals and growth."
        text="Illuminairy exists because high-trust learning should feel clearer, more guided, and more human. We are starting with premium SAT preparation and building toward professional and business programs."
        primary={{ label: "Explore Programs", href: "/programs" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="Why it exists"
            title="A better way to learn with mentors."
            text="Most SAT prep feels opaque and transactional — rotating staff, unclear progress, promises that sound too good. Illuminairy is built on what research and families both want: mentors and instructors who have walked the path, a program you can see, and weekly honesty about effort and results."
          />
          <div className="grid gap-4">
            {[
              {
                icon: GraduationCap,
                title: "Start with a real need",
                text: "SAT preparation is a high-stakes category where trust, clarity, and mentor quality matter immediately."
              },
              {
                icon: Blocks,
                title: "Build a clear, repeatable plan",
                text: "Instead of one-off sessions, Illuminairy packages mentorship and instruction into guided programs with a defined plan, support, and expectations."
              },
              {
                icon: Compass,
                title: "Expand with intention",
                text: "After SAT, the same approach will support professional and business programs — always with clear outcomes and excellent mentors."
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
              Legacy prep programs and expertise marketplaces are fragmented, opaque, and
              transactional. <span className="text-gold-light">Illuminairy is building guided
              near-peer mentorship and applied learning</span>, starting with the SAT
              Accelerator and expanding carefully from there.
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
                text: "Ambitious students and families who want a clear plan, accountability, and mentors who have actually succeeded — not a generic prep center."
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
