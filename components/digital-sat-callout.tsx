import { digitalSat } from "@/lib/site";
import { Eyebrow } from "@/components/ui";

export function DigitalSatCallout() {
  return (
    <section className="bg-ivory-200/40 px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-line bg-ivory p-9 sm:p-11">
          <Eyebrow tone="gold">{digitalSat.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-[clamp(1.75rem,1.1rem+2.4vw,3rem)] font-light leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.25rem]">
            {digitalSat.title}
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] font-medium italic leading-[1.7] text-ink">
            &ldquo;{digitalSat.metaphor}&rdquo;
          </p>

          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {digitalSat.points.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-line bg-ivory-200/60 p-5 text-[14.5px] leading-[1.65] text-ink-soft"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
