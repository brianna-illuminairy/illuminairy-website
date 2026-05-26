type FunnelStudentNameBodyProps = {
  name: string;
  onNameChange: (value: string) => void;
};

export function FunnelStudentNameBody({ name, onNameChange }: FunnelStudentNameBodyProps) {
  return (
    <label className="sf-field" htmlFor="satplan-student-name">
      <span className="sf-field__label">First name</span>
      <input
        id="satplan-student-name"
        className="sf-input"
        type="text"
        autoComplete="given-name"
        value={name}
        maxLength={32}
        placeholder="Maya"
        onChange={(event) => onNameChange(event.target.value)}
      />
    </label>
  );
}
