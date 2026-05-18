"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui";
import {
  CONSULT_BOOKED_SESSION_KEY,
  qualificationIntake
} from "@/lib/sat-qualification";
import { site } from "@/lib/site";

export function GetStartedComplete() {
  const searchParams = useSearchParams();
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("booked") === "1";
    if (fromQuery) {
      sessionStorage.setItem(CONSULT_BOOKED_SESSION_KEY, "true");
    }
    const fromStorage =
      sessionStorage.getItem(CONSULT_BOOKED_SESSION_KEY) === "true";
    if (fromQuery || fromStorage) {
      queueMicrotask(() => setBooked(true));
    }
  }, [searchParams]);

  if (booked) {
    return (
      <section className="px-5 pb-16 pt-10 sm:px-8">
        <div className="mx-auto max-w-lg text-center">
          <Eyebrow tone="gold">{qualificationIntake.eyebrow}</Eyebrow>
          <h1 className="mt-4 font-serif text-[1.75rem] tracking-[-0.02em] text-ink">
            Your consultation is scheduled
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            We received your application and your meeting time. A parent or
            guardian should join the call — we&apos;ll use your answers so the
            conversation is useful, not a sales pitch.
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
            Check your email for the calendar invite. Need to reschedule? Use
            the link in that invite or email{" "}
            <a
              href={`mailto:${site.supportEmail}`}
              className="font-semibold text-gold-deep hover:underline"
            >
              {site.supportEmail}
            </a>
            .
          </p>
          <p className="mt-8 text-[13px] text-ink-soft">
            <Link href="/" className="font-semibold text-gold-deep hover:underline">
              Back to illuminairy.com
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pb-16 pt-10 sm:px-8">
      <div className="mx-auto max-w-lg text-center">
        <Eyebrow tone="gold">{qualificationIntake.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-serif text-[1.75rem] tracking-[-0.02em] text-ink">
          Application received
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          One more step: pick a time for your free consultation. We review every
          application before we meet.
        </p>
        <div className="mt-8">
          <Link
            href={qualificationIntake.schedulePath}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ink bg-ink px-6 text-[15px] font-semibold text-ivory"
          >
            Pick a consultation time
          </Link>
        </div>
      </div>
    </section>
  );
}
