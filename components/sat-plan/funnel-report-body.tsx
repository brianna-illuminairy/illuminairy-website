import type { ReportPlanSection } from "@/lib/sat-plan-funnel/report-plan";

type FunnelReportBodyProps = {
  sections: ReportPlanSection[];
};

export function FunnelReportBody({ sections }: FunnelReportBodyProps) {
  return (
    <dl className="sf-report">
      {sections.map((section) => (
        <div key={section.title} className="sf-report__row">
          <dt className="sf-report__label">{section.title}</dt>
          <dd className="sf-report__value">{section.body}</dd>
        </div>
      ))}
    </dl>
  );
}
