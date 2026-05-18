import type { Metadata } from "next";
import { ShieldCheck, CalendarCheck, UsersRound, UserCheck } from "lucide-react";
import { EnrollCheckout } from "@/components/enroll-checkout";
import { Eyebrow, PageHero, ButtonLink } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enroll",
  description:
    "Complete your enrollment in the Illuminairy SAT Accelerator. Payment reserves your cohort seat.",
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
        title="Reserve your cohort seat."
        text="This page is for families who have already spoken with Illuminairy. Payment reserves your seat in the next SAT Accelerator cohort."
        secondary={{ label: "Need to talk first?", href: "/contact" }}
      />

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow tone="gold">What you get</Eyebrow>
            <h2 className="mt-4 text-[1.625rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2rem]">
              Twelve weeks of structured SAT preparation.
            </h2>
            <div className="mt-8 grid gap-5">
              {[
                {
                  icon: CalendarCheck,
                  label: "24 live small-group sessions"
                },
                {
                  icon: UserCheck,
                  label: "6 private 1:1 coaching sessions"
                },
                {
                  icon: UsersRound,
                  label: "Cohorts capped at 10 students"
                },
                {
                  icon: ShieldCheck,
                  label: "Georgia Tech-led mentors (1450+ SAT)"
                }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 text-gold-deep">
                    <item.icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  </div>
                  <span className="text-[14.5px] font-medium text-ink">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
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
            <Eyebrow tone="gold">Secure checkout</Eyebrow>
            <h2 className="mt-4 text-[1.625rem] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2rem]">
              Complete your enrollment.
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-soft">
              Enter your details below and continue to Stripe for secure payment.
              You will receive onboarding details by email after payment.
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

