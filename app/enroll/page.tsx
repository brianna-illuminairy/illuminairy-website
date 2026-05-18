import type { Metadata } from "next";
import { EnrollCheckout } from "@/components/enroll-checkout";
import { EnrollProgramCalendar } from "@/components/enroll-program-calendar";
import { Eyebrow, PageHero, ButtonLink } from "@/components/ui";
import { satProgram, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enroll",
  description:
    "Enroll in the Illuminairy SAT Accelerator for the August 2026 SAT. Secure payment holds your spot.",
  robots: { index: false, follow: false }
};

export default async function EnrollPage({
  searchParams
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="SAT Accelerator · Enrollment"
        title="Raise your August SAT score. Reserve your spot."
        text={`Secure payment holds your spot for the ${site.satDate} SAT.`}
        secondary={{ label: "Need to talk first?", href: "/contact" }}
      />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow tone="gold">What you get</Eyebrow>
            <h2 className="mt-4 text-[1.625rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2rem]">
              {satProgram.headline}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
              {satProgram.tracking} {satProgram.structureLine}
            </p>
            <EnrollProgramCalendar />
            <p className="mt-8 text-[13px] leading-relaxed text-ink-muted">
              Payment is processed securely through Stripe. See our{" "}
              <a href="/refund-policy" className="underline underline-offset-2 hover:text-ink">
                refund policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="underline underline-offset-2 hover:text-ink">
                terms of service
              </a>.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial sm:p-9">
            <Eyebrow tone="gold">Reserve your spot</Eyebrow>
            <h2 className="mt-4 text-[1.625rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2rem]">
              Complete your enrollment
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-soft">
              We use this to set up the student account, connect mentors and
              instructors, and keep parents aligned on schedules and updates.
              Then you&apos;ll continue to secure payment.
            </p>

            {canceled && (
              <p className="mt-5 rounded-xl border border-marigold/25 bg-marigold/10 px-4 py-3 text-[14px] leading-relaxed text-marigold-ink">
                Payment was canceled. You can try again when ready, or email{" "}
                {site.supportEmail} with questions.
              </p>
            )}

            <EnrollCheckout />

            <div className="mt-7 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row">
              <ButtonLink href={`mailto:${site.supportEmail}`} variant="secondary">
                Questions? Email us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

