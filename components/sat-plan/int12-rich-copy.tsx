import type { Int12CopyPart } from "@/lib/sat-plan-funnel/int12-sat-changed-copy";

type Int12RichCopyProps = {
  parts: Int12CopyPart[];
  className?: string;
};

export function Int12RichCopy({ parts, className }: Int12RichCopyProps) {
  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.bold ? (
          <strong key={index}>{part.text}</strong>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </span>
  );
}
