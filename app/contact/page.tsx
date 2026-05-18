import type { Metadata } from "next";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { ButtonLink, PageHero, SectionHeader } from "@/components/ui";
import { bookLink, contactReasons, inquiryLink, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Illuminairy for parent and student inquiries, mentor applications, partnerships, billing, or support."
};

export default function ContactPage() {
  const formAction = site.typeformUrl || `mailto:${site.email}`;
  const formMethod = site.typeformUrl ? "get" : "post";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Illuminairy."
        text="For program questions, mentor applications, partnerships, billing, or support, contact our team."
        primary={{ label: "Book a Consultation", href: bookLink }}
        secondary={{ label: "Email Illuminairy", href: `mailto:${site.email}` }}
      />

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader
              eyebrow="Support"
              title="Clear contact details for customers and partners."
              text="Illuminairy provides support for educational services, consultations, billing questions, mentor applications, and partnership inquiries."
            />
            <div className="mt-8 grid gap-3">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-medium text-ink hover:border-indigo/30"
              >
                <Mail className="h-5 w-5 text-indigo" aria-hidden="true" />
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-medium text-ink hover:border-indigo/30"
              >
                <Phone className="h-5 w-5 text-indigo" aria-hidden="true" />
                {site.phone}
              </a>
              <div className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-medium text-ink">
                <MapPin className="h-5 w-5 text-indigo" aria-hidden="true" />
                {site.location}, United States
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-ink">
              Send an inquiry
            </h2>
            <p className="mt-3 text-sm leading-6 text-slatecopy">
              Use this form for parent/student inquiries, mentor applications,
              billing/support, partnerships, or general questions.
            </p>
            <form
              action={formAction}
              method={formMethod}
              encType={site.typeformUrl ? undefined : "text/plain"}
              className="mt-6 grid gap-4"
            >
              <label className="grid gap-2 text-sm font-medium text-ink">
                Name
                <input
                  name="name"
                  required
                  className="h-12 rounded-lg border border-line bg-cloud px-4 text-sm outline-none transition focus:border-indigo"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="h-12 rounded-lg border border-line bg-cloud px-4 text-sm outline-none transition focus:border-indigo"
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Reason for inquiry
                <select
                  name="reason"
                  className="h-12 rounded-lg border border-line bg-cloud px-4 text-sm outline-none transition focus:border-indigo"
                  defaultValue={contactReasons[0]}
                >
                  {contactReasons.map((reason) => (
                    <option key={reason}>{reason}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Message
                <textarea
                  name="message"
                  required
                  className="min-h-36 rounded-lg border border-line bg-cloud px-4 py-3 text-sm outline-none transition focus:border-indigo"
                  placeholder="How can Illuminairy help?"
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-graphite"
              >
                Submit inquiry
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row">
              <ButtonLink href={bookLink}>Book a Consultation</ButtonLink>
              <ButtonLink href={inquiryLink} variant="secondary">
                Request Details
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
