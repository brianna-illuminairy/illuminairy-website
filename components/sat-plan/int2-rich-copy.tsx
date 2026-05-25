import type { Int2CopyPart } from "@/lib/sat-plan-funnel/int2-gpa-paradox-copy";

type Int2RichCopyProps = {
  parts: Int2CopyPart[];
  className?: string;
};

export function Int2RichCopy({ parts, className }: Int2RichCopyProps) {
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const classes = [
          part.accent ? "int2-gpa-paradox__accent" : "",
          part.italic ? "int2-gpa-paradox__italic" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const content = part.bold ? <strong>{part.text}</strong> : part.text;

        if (classes) {
          return (
            <span key={index} className={classes}>
              {content}
            </span>
          );
        }

        return <span key={index}>{content}</span>;
      })}
    </span>
  );
}
