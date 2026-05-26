import { site } from "@/lib/site";

type FunnelBookBodyProps = {
  embedSrc: string;
  intro: string;
  agenda: string[];
  footnote: string;
};

export function FunnelBookBody({ embedSrc, intro, agenda, footnote }: FunnelBookBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      <p className="quiz-step-copy">{intro}</p>
      <ul className="promises">
        {agenda.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <iframe title="Schedule SAT Score Review" src={embedSrc} width="100%" height="420" />
      <p className="quiz-step-footnote">
        {footnote}{" "}
        <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer">
          Open scheduling
        </a>
      </p>
    </div>
  );
}
