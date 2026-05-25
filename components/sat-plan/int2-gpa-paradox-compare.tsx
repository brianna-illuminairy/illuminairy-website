import type { Int2CompareCard } from "@/lib/sat-plan-funnel/int2-gpa-paradox-copy";

type Int2GpaParadoxCompareProps = {
  school: Int2CompareCard;
  sat: Int2CompareCard;
};

export function Int2GpaParadoxCompare({ school, sat }: Int2GpaParadoxCompareProps) {
  return (
    <div
      className="int2-gpa-compare quiz-step-trust-graphic"
      role="img"
      aria-label="In school rewards depth; on the SAT rewards speed."
    >
      <div className="int2-gpa-compare__grid">
        <CompareCard card={school} variant="school" />
        <CompareCard card={sat} variant="sat" />
      </div>
    </div>
  );
}

function CompareCard({
  card,
  variant,
}: {
  card: Int2CompareCard;
  variant: "school" | "sat";
}) {
  return (
    <article className={`int2-gpa-compare__card int2-gpa-compare__card--${variant}`}>
      <p className="int2-gpa-compare__context">{card.contextLabel}</p>
      <p className="int2-gpa-compare__reward">{card.rewardHeading}</p>
      <ul className="int2-gpa-compare__habits">
        {card.habits.map((habit) => (
          <li key={habit}>{habit}</li>
        ))}
      </ul>
    </article>
  );
}
