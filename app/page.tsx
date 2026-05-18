import { Calendar, CheckCircle2, GraduationCap, Sparkles } from "lucide-react";
import { IdentityPanel, PlatformVisual } from "@/components/brand-visual";
import { ButtonLink, DarkCta, FeatureCard, SectionHeader } from "@/components/ui";
import {
  bookLink,
  inquiryLink,
  platformAreas,
  programStats,
  satFeatures,
  site,
  trustPillars
} from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-16 pt-12 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_68%,#eef2f7_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,124,255,0.20),transparent_66%)] blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-full border border-indigo/15 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-indigo shadow-sm">
              Premium mentorship · Applied learning
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.07em] text-ink sm:text-6xl lg:text-7xl">
              Modern mentorship and applied learning for ambitious students and professionals.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slatecopy sm:text-xl">
              Illuminairy connects learners with premium educated talent through structured programs, live mentorship, and applied learning experiences. We’re launching first with a Georgia Tech-led SAT Accelerator for students preparing for the {site.satDate} SAT.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={bookLink} icon={Calendar}>
                Book a SAT Consultation
              </ButtonLink>
              <ButtonLink href="/programs" variant="secondary" icon={Sparkles}>
                Explore Programs
              </ButtonLink>
            </div>
          </div>
          <PlatformVisual />
        </div>
      </section>

      <section className="border-y border-line bg-white px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-line bg-cloud/60 p-5">
              <p className="text-3xl font-semibold tracking-[-0.045em] text-ink">{stat.value}</p>
              <p className="mt-2 text-sm leading-5 text-slatecopy">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Company"
            title="A modern platform for premium mentorship, learning, and applied expertise."
            text="Legacy tutoring and expertise marketplaces are often fragmented, opaque, and transactional. Illuminairy is building a more structured, transparent, mentor-led model for motivated learners."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trustPillars.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-electric">
              First wedge
            </p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Starting with the Illuminairy SAT Accelerator.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/68">
              A 12-week virtual SAT program with live small-group instruction,
              private coaching, diagnostics, and weekly accountability. Built
              for ambitious students targeting competitive colleges and 1300+
              SAT scores.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/sat-accelerator" variant="dark" icon={GraduationCap}>
                View SAT Accelerator
              </ButtonLink>
              <ButtonLink href={inquiryLink} variant="ghost">
                <span className="text-white">Request Program Details</span>
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {satFeatures.slice(0, 4).map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <item.icon className="h-5 w-5 text-electric" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Platform direction"
            title="Built for the categories where trust, skill, and clarity matter."
            text="The SAT Accelerator is the first live product. Over time, Illuminairy can expand into AI upskilling, technical education, business owner learning, professional coaching, and broader applied expertise programs."
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
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            eyebrow="Identity"
            title="Premium, minimal, and technical without looking like a tutoring center."
            text="The Illuminairy identity uses a wordmark-first system with a subtle discoverable AI treatment, a compact mark for favicons, and a restrained palette designed for website, checkout, social, and investor materials."
          />
          <IdentityPanel />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-ringed">
            <CheckCircle2 className="h-6 w-6 text-indigo" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-ink">
              Clear enough for families.
            </h2>
            <p className="mt-4 leading-7 text-slatecopy">
              Parents can understand the service, schedule, delivery format, mentor standards, support contact, and enrollment path without having to decode a marketplace.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-8 shadow-ringed">
            <Sparkles className="h-6 w-6 text-indigo" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-ink">
              Ambitious enough for the larger company.
            </h2>
            <p className="mt-4 leading-7 text-slatecopy">
              The public story starts with SAT prep while leaving room for AI upskilling, technical learning, professional coaching, and applied expertise networks.
            </p>
          </div>
        </div>
      </section>

      <DarkCta
        title="Start with a conversation about the SAT Accelerator."
        text="For parents and students, the best next step is a short consultation to understand fit, schedule, and enrollment details."
        primary={{ label: "Book a Consultation", href: bookLink }}
        secondary={{ label: "Contact Illuminairy", href: "/contact" }}
      />
    </>
  );
}
