import Image from "next/image";
import Link from "next/link";
import { HeroWaitlistSlotShell } from "@/components/hero-waitlist-slot-shell";
import { Eyebrow } from "@/components/ui";
import { homePlatform, mentorApplyLink, site } from "@/lib/site";

export function YcHero() {
  const founderLine = homePlatform.credentials;
  const sublead = homePlatform.hero.sublead;

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="relative mx-auto grid max-w-content gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Eyebrow>{homePlatform.hero.eyebrow}</Eyebrow>

          <div className="mt-4">
            <HeroWaitlistSlotShell />
          </div>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-muted sm:text-lg">
            {homePlatform.hero.lead}
          </p>

          {sublead && (
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-primary-muted">
              {sublead}
            </p>
          )}

          <p className="mt-6 text-sm text-primary-muted">{founderLine}</p>

          <p className="mt-4 text-sm text-primary-muted">
            Mentors:{" "}
            <Link href={mentorApplyLink} className="font-medium text-accent hover:underline">
              apply here
            </Link>
            {" · "}
            {site.tagline}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-card">
          <Image
            src="/images/brianna-zajicek-founder.png"
            alt="Brianna Zajicek, founder of Illuminairy"
            width={560}
            height={700}
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="aspect-[4/5] w-full object-cover object-[center_18%]"
          />
        </div>
      </div>
    </section>
  );
}
