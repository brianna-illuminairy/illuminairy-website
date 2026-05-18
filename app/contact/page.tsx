import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { CalendlyBookingSection } from "@/components/calendly-booking";
import { ContactForm } from "@/components/contact-form";
import { ButtonLink, Eyebrow, PageHero, SectionHeader } from "@/components/ui";
import { resolveContactReason, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Illuminairy for parent and student inquiries, mentor applications, partnerships, billing, or support."
};

export default async function ContactPage({
  searchParams
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const defaultReason = resolveContactReason(reason);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a person at Illuminairy."
        text="For program questions, mentor applications, partnerships, billing, or support — send a message and we'll get back quickly."
        primary={{ label: "Book a consultation", href: "#schedule" }}
        secondary={{
          label: "Email support",
          href: `mailto:${site.supportEmail}`
        }}
      />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader
              eyebrow="Support"
              title="Direct contact for families and mentors."
              text="Illuminairy provides support for educational services, consultations, billing questions, mentor applications, and partnership inquiries."
            />
            <div className="mt-9 grid gap-3">
              <a
                href={`mailto:${site.supportEmail}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-ivory-50 p-5 text-[14.5px] font-medium text-ink transition hover:border-gold/40 hover:bg-ivory"
              >
                <Mail className="h-5 w-5 text-gold-deep" aria-hidden="true" strokeWidth={1.6} />
                {site.supportEmail}
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-ivory-50 p-5 text-[14.5px] font-medium text-ink">
                <MapPin className="h-5 w-5 text-gold-deep" aria-hidden="true" strokeWidth={1.6} />
                {site.location}, United States
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial sm:p-9">
            <Eyebrow tone="gold">Send an inquiry</Eyebrow>
            <h2 className="mt-4 text-[1.625rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2rem]">
              We read every message.
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-soft">
              Use the form for parent/student inquiries, mentor applications,
              billing/support, partnerships, or general questions. Messages go to{" "}
              {site.supportEmail}.
            </p>
            <ContactForm defaultReason={defaultReason} />
            <div className="mt-7 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row">
              <ButtonLink href="#schedule">Book a consultation</ButtonLink>
              <ButtonLink href="/sat-accelerator" variant="secondary">
                View SAT program
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <CalendlyBookingSection
        eyebrow="SAT Accelerator · August 2026"
        title="Book your free consultation."
        text="Choose a time below to talk about program fit, schedule, and enrollment for the August 22, 2026 SAT."
      />
    </>
  );
}
