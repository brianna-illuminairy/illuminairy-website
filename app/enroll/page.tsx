import type { Metadata } from "next";
import { EnrollCheckout } from "@/components/enroll-checkout";
import { EnrollProgramCalendar } from "@/components/enroll-program-calendar";
import { Eyebrow } from "@/components/ui";
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
      <section className="relative overflow-hidden px-5 pb-14 pt-10 sm:px-8 sm:pt-12 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-ivory-gradient" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-paper-grain" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
          <div className="order-2 lg:order-1 lg:pt-2">
            <Eyebrow tone="gold">SAT Accelerator · Enrollment</Eyebrow>
            <h1 className="mt-4 text-balance text-[clamp(1.875rem,1.2rem+2.2vw,2.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-ink">
              Reserve your spot in the SAT Accelerator.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-[1.65] text-ink-soft sm:text-[16px]">
              Twelve weeks with Georgia Tech mentors who scored 1450+, six private
              1:1s, live R&W and Math classes, and a progress report every week
              — for the {site.satDate} SAT.
            </p>
            <p className="mt-5 text-[1.5rem] font-light tracking-[-0.03em] text-ink lg:hidden">
              {satProgram.tuitionDisplay}{" "}
              <span className="text-[13px] text-ink-muted">one-time tuition</span>
            </p>
          </div>

          <div className="order-1 rounded-3xl border border-line bg-ivory-50 p-6 shadow-editorial sm:p-8 lg:order-2">
            <Eyebrow tone="gold">Enroll now</Eyebrow>
            <h2 className="mt-3 text-[1.5rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[1.75rem]">
              Reserve your spot
            </h2>
            <p className="mt-2 hidden text-[1.75rem] font-light tracking-[-0.03em] text-ink lg:block">
              {satProgram.tuitionDisplay}
            </p>
            <p className="mt-1 hidden text-[13px] text-ink-muted lg:block">
              One-time program tuition
            </p>
            <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft">
              Parent or guardian completes this form, then continues to secure
              payment. We send class times, session links, and your mentor&apos;s
              name after enrollment.
            </p>

            {canceled && (
              <p className="mt-5 rounded-xl border border-marigold/25 bg-marigold/10 px-4 py-3 text-[14px] leading-relaxed text-marigold-ink">
                Payment was canceled. You can try again below, or email{" "}
                {site.supportEmail} with questions.
              </p>
            )}

            <EnrollCheckout />

            <p className="mt-6 border-t border-line pt-5 text-[12px] leading-relaxed text-ink-muted">
              Secure payment via Stripe. See our{" "}
              <a href="/refund-policy" className="underline underline-offset-2 hover:text-ink">
                refund policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="underline underline-offset-2 hover:text-ink">
                terms of service
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Eyebrow tone="gold">What you get</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-[1.625rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2rem]">
            {satProgram.headline}
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-ink-soft">
            {satProgram.tracking} {satProgram.structureLine}
          </p>
          <EnrollProgramCalendar />
        </div>
      </section>
    </>
  );
}
