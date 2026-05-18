import { acceleratorModel } from "@/lib/site";
import { SectionHeader } from "@/components/ui";

export function AcceleratorModel() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={acceleratorModel.eyebrow}
          title={acceleratorModel.title}
          text={acceleratorModel.intro}
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {acceleratorModel.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-line bg-ivory-50 p-6 shadow-editorial"
            >
              <span className="text-[2rem] font-light leading-none tracking-[-0.04em] text-gold-deep/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[1rem] font-semibold tracking-[-0.015em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
