export function IncludedRow({ label }: { label: string }) {
  return (
    <div className="row-item">
      <div className="label">{label}</div>
      <svg className="icon" viewBox="0 0 22 22" aria-hidden>
        <circle cx="11" cy="11" r="11" fill="#141414" />
        <path
          d="M6 11.5l3.5 3.5L16 8"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
