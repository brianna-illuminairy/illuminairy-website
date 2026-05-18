import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enrollment confirmed",
  description: "Your SAT Accelerator enrollment is confirmed. Onboarding details are on the way.",
  robots: { index: false, follow: false }
};

export default function EnrollSuccessPage() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-sage/30 bg-sage/10">
          <CheckCircle2 className="h-8 w-8 text-sage-ink" strokeWidth={1.5} />
        </div>

        <Eyebrow tone="gold">Enrollment confirmed</Eyebrow>

        <h1 className="mt-5 text-balance text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] font-light tracking-[-0.035em] leading-[1.04] text-ink">
          You are enrolled.
        </h1>

        <p className="mt-6 text-pretty text-lg leading-[1.65] text-ink-soft">
          Thank you for joining the Illuminairy SAT Accelerator. Within 1–2
          business days we will email the student and parent with account setup,
          mentor introductions, schedule, and session links.
        </p>

        <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-muted">
          Questions? Email us at{" "}
          <a
            href={`mailto:${site.supportEmail}`}
            className="font-medium text-ink underline underline-offset-2 hover:text-gold-deep"
          >
            {site.supportEmail}
          </a>
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/">Back to Illuminairy</ButtonLink>
          <ButtonLink href="/sat-accelerator" variant="secondary">
            View program details
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
