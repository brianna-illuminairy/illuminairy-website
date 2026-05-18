import type { Metadata } from "next";
import { ButtonLink, DarkCta, FeatureCard, PageHero, SectionHeader } from "@/components/ui";
import { bookLink, platformAreas } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Current and future Illuminairy learning programs, starting with the SAT Accelerator and expanding into AI, technical education, and applied expertise."
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Structured learning programs led by high-performing mentors."
        text="Illuminairy begins with SAT preparation and is building toward a broader platform for premium mentorship, technical education, and applied expertise."
        primary={{ label: "Explore SAT Accelerator", href: "/sat-accelerator" }}
        secondary={{ label: "Contact Illuminairy", href: "/contact" }}
      />

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Current and future"
            title="Starting focused, expanding carefully."
            text="The current live product is the Illuminairy SAT Accelerator. Future programs will be announced as they become available; they are not presented as currently launched services."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {platformAreas.map((area) => (
              <FeatureCard
                key={area.title}
                icon={area.icon}
                title={area.title}
                text={area.text}
                meta={area.status}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-line bg-cloud p-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo">
              Live now
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-ink">
              Illuminairy SAT Accelerator
            </h2>
            <p className="mt-5 leading-7 text-slatecopy">
              A 12-week virtual SAT cohort with 30 live sessions, small-group
              instruction, private coaching, diagnostics, and accountability for
              students preparing for the August 22, 2026 SAT.
            </p>
            <div className="mt-7">
              <ButtonLink href={bookLink}>Book a Consultation</ButtonLink>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-8 shadow-ringed">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo">
              In development
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-ink">
              Applied expertise beyond test prep.
            </h2>
            <p className="mt-5 leading-7 text-slatecopy">
              Illuminairy’s future program areas include AI upskilling,
              automation education for business owners, technical learning,
              professional coaching, and expert-led applied learning. These
              areas are planned platform directions, not currently sold as live
              programs unless announced by Illuminairy.
            </p>
          </div>
        </div>
      </section>

      <DarkCta
        title="Looking for the current SAT cohort?"
        text="The SAT Accelerator is the first live Illuminairy program and the best place for families to begin."
        primary={{ label: "View SAT Accelerator", href: "/sat-accelerator" }}
      />
    </>
  );
}
