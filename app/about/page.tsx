import type { Metadata } from "next";
import { ArrowUpRight, Blocks, Compass, GraduationCap } from "lucide-react";
import { ButtonLink, DarkCta, FeatureCard, PageHero, SectionHeader } from "@/components/ui";
import { bookLink, inquiryLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Illuminairy exists to make modern learning more transparent, structured, mentor-led, and useful."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Illuminairy"
        title="Building a modern platform for mentorship and applied learning."
        text="Illuminairy exists because learning should be more transparent, structured, and human. We are starting with premium SAT preparation and building toward a broader platform for applied expertise."
        primary={{ label: "Explore Programs", href: "/programs" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeader
            eyebrow="Why it exists"
            title="A better model for high-trust learning."
            text="Many tutoring and expertise platforms feel opaque, transactional, and outdated. Families want clarity. Learners want momentum. Mentors want meaningful work. Illuminairy is building a product-led model around structure, transparency, and excellent human guidance."
          />
          <div className="grid gap-4">
            {[
              {
                icon: GraduationCap,
                title: "Start with a real need",
                text: "SAT preparation is a high-stakes learning category where trust, structure, and mentor quality matter immediately."
              },
              {
                icon: Blocks,
                title: "Build repeatable structure",
                text: "Instead of one-off tutoring, Illuminairy packages mentorship into clear programs with defined delivery, support, and expectations."
              },
              {
                icon: Compass,
                title: "Expand into applied expertise",
                text: "The same model can support AI upskilling, technical education, professional coaching, and business owner learning."
              }
            ].map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Positioning"
            title="Starting narrow, with room to become much larger."
            text="Illuminairy is not presenting itself as a fully built AI-native platform today. The current business is a premium virtual education and mentorship company launching with structured SAT cohorts. The broader opportunity is to create a trusted layer for premium mentorship and applied learning across categories."
          />
          <div className="mt-10 rounded-2xl border border-line bg-cloud p-8">
            <p className="max-w-4xl text-xl leading-9 tracking-[-0.02em] text-ink">
              “Legacy tutoring and expertise marketplaces are fragmented, opaque,
              and transactional. Illuminairy is building a modern, product-led
              platform for premium mentorship, learning, and applied expertise.”
            </p>
          </div>
        </div>
      </section>

      <DarkCta
        title="Connect with Illuminairy."
        text="Reach out for parent inquiries, mentor applications, partnerships, billing, or general questions."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "View SAT Accelerator", href: "/sat-accelerator" }}
      />
    </>
  );
}
