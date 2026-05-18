import type { Metadata } from "next";
import { FunnelLandingHero } from "@/components/funnel-landing-hero";
import { FunnelLandingTracker } from "@/components/funnel-landing-tracker";
import { resolveFunnelContext } from "@/funnel/lib/campaigns";
import { resolveFunnelHero } from "@/funnel/lib/resolve-hero";
import { satProgram, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply for the August SAT Program",
  description:
    "Georgia Tech mentors (1450+). Twelve-week SAT Accelerator for the August 22, 2026 exam. Apply for the program — free consultation after your application.",
  robots: { index: false, follow: false }
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GoSatLandingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const context = resolveFunnelContext(params);
  const hero = resolveFunnelHero(context);

  return (
    <>
      <FunnelLandingTracker context={context} />
      <FunnelLandingHero hero={hero} context={context} />
      <section className="border-t border-line px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-lg text-[13px] leading-relaxed text-ink-soft">
          <p>
            {satProgram.tuitionDisplay} · Program starts{" "}
            {satProgram.programStartLabel} · Exam {site.satDate}
          </p>
          <p className="mt-4">
            Illuminairy does not guarantee SAT scores or admission to any
            university. Every application is reviewed before we schedule your
            free consultation.
          </p>
        </div>
      </section>
    </>
  );
}
