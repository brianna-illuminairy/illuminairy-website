import { YcSection } from "@/components/yc-section";
import { Eyebrow } from "@/components/ui";
import { homePlatform } from "@/lib/site";

export function YcProblem() {
  const problem = homePlatform.problem;

  return (
    <YcSection id="problem" className="bg-surface-elevated">
      <div className="mx-auto max-w-content">
        <Eyebrow>{problem.eyebrow}</Eyebrow>

        <p className="mt-4 max-w-3xl text-pretty text-lg font-medium leading-relaxed text-primary sm:text-xl">
          {problem.stakes}
        </p>

        <h2 className="mt-8 max-w-3xl text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          {problem.gap}
        </h2>

        <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-primary-muted sm:text-lg">
          {problem.demand}
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {problem.alternatives.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-primary-muted"
            >
              <p className="font-semibold text-primary">{item.title}</p>
              <p className="mt-1.5">{item.text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-pretty text-base leading-relaxed text-primary-muted sm:text-lg">
          {problem.stall}
        </p>

        <p className="mt-6 max-w-3xl rounded-lg border border-accent/30 bg-accent-soft/40 px-4 py-3 text-pretty text-base font-medium leading-relaxed text-primary">
          {problem.connect}
        </p>
      </div>
    </YcSection>
  );
}
