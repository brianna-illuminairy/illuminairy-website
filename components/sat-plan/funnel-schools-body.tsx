"use client";

type FunnelSchoolsBodyProps = {
  schools: string;
  onSchoolsChange: (value: string) => void;
};

export function FunnelSchoolsBody({ schools, onSchoolsChange }: FunnelSchoolsBodyProps) {
  return (
    <label className="sf-field" htmlFor="satplan-schools-input">
      <span className="sf-field__label">School names</span>
      <textarea
        id="satplan-schools-input"
        className="sf-textarea"
        rows={4}
        value={schools}
        placeholder="e.g. UGA, Georgia Tech, Emory…"
        onChange={(event) => onSchoolsChange(event.target.value)}
      />
    </label>
  );
}
