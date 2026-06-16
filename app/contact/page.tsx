import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with Illuminairy. Email ${site.supportEmail} or use the contact form.`
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch with Illuminairy"
        text={`Send us a message and we'll get back to you within one business day. You can also email ${site.supportEmail} directly.`}
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface-elevated p-7 shadow-card sm:p-10">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
