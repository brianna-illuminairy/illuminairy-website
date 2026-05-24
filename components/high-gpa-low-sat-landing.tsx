import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandSixPointStar } from "@/components/brand-six-point-star";
import { Wordmark } from "@/components/logo";

const ANSWERS = [
  "Why they scored low",
  "If they should retake (and when)",
  "What score they can realistically get",
  "Exactly how to get there"
] as const;

export function HighGpaLowSatLanding({ ctaHref = "#check" }: { ctaHref?: string }) {
  return (
    <div className="sat-gpa-mobile-frame">
      <div className="sat-gpa-phone">
        <div className="sat-gpa-phone__island" aria-hidden="true" />
        <section
          className="sat-gpa-landing"
          aria-labelledby="sat-gpa-landing-title"
        >
        <header className="sat-gpa-landing__header">
          <Link href="/" aria-label="Illuminairy — home" className="sat-gpa-landing__wordmark">
            <Wordmark size="sm" tone="solid" />
          </Link>
        </header>

        <h1 id="sat-gpa-landing-title" className="sat-gpa-landing__title">
          High GPA, low SAT?
        </h1>

        <p className="sat-gpa-landing__lead">
          We&apos;ll help you figure out why they&apos;re struggling to get the score they
          need.
        </p>

        <p className="sat-gpa-landing__proof">
          Built on College Board data from 250,000+ students.
        </p>

        <p className="sat-gpa-landing__answers-label">We&apos;ll answer:</p>

        <ul className="sat-gpa-landing__list">
          {ANSWERS.map((item) => (
            <li key={item}>
              <BrandSixPointStar size={13} className="sat-gpa-landing__star" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Link href={ctaHref} className="sat-gpa-landing__cta">
          <span>Get my answers</span>
          <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
        </Link>

        <p className="sat-gpa-landing__fine">Free • 2 minutes • No account needed</p>

        <div id="check" className="sr-only" aria-hidden="true" />
        </section>
      </div>
    </div>
  );
}
