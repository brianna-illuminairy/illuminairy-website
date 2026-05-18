import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { qualificationIntake } from "@/lib/sat-qualification";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thanks for applying",
  description:
    "Illuminairy SAT Accelerator is a premium twelve-week program. Free resources if self-study is the better fit.",
  robots: { index: false, follow: false }
};

export default function GetStartedNotAFitPage() {
  return (
    <section className="px-5 pb-16 pt-10 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-lg text-center">
        <Eyebrow tone="gold">{qualificationIntake.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-serif text-[1.75rem] tracking-[-0.02em] text-ink">
          We&apos;re probably not the right fit right now
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          The SAT Accelerator is a premium twelve-week program with live classes,
          six 1:1 mentor sessions, and weekly accountability — not a free or
          low-cost prep option. Based on your answer, a consultation
          likely wouldn&apos;t be the best use of your time.
        </p>
        <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
          If your plans change, you&apos;re welcome to apply again. For self-study
          foundations,{" "}
          <a
            href="https://www.khanacademy.org/sat"
            className="font-semibold text-gold-deep hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Khan Academy
          </a>{" "}
          and College Board Bluebook are strong starting points.
        </p>
        <p className="mt-8 text-[13px] text-ink-soft">
          Questions?{" "}
          <a
            href={`mailto:${site.supportEmail}`}
            className="font-semibold text-gold-deep hover:underline"
          >
            {site.supportEmail}
          </a>
        </p>
        <p className="mt-6">
          <Link href="/" className="font-semibold text-gold-deep hover:underline">
            Back to illuminairy.com
          </Link>
        </p>
      </div>
    </section>
  );
}
