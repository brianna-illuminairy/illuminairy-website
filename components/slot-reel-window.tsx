"use client";

type SlotReelWindowProps = {
  label: string;
  phrase: string;
  spinning: boolean;
  slotIn: boolean;
  won: boolean;
  size?: "sm" | "md";
};

export function SlotReelWindow({
  label,
  phrase,
  spinning,
  slotIn,
  won,
  size = "md"
}: SlotReelWindowProps) {
  const textClass =
    size === "sm"
      ? "text-sm font-semibold"
      : "text-base font-semibold sm:text-lg";

  return (
    <div
      className={[
        "slot-reel-column flex min-w-0 flex-1 flex-col",
        won ? "slot-reel-column--won" : ""
      ].join(" ")}
    >
      <span className="slot-reel-label">{label}</span>
      <div
        className={[
          "slot-reel-window mt-1.5",
          spinning ? "slot-reel-window--spinning" : "",
          slotIn ? "slot-reel-window--slot-in" : "",
          won ? "slot-reel-window--won" : ""
        ].join(" ")}
      >
        <span className="slot-reel-glow" aria-hidden />
        <span className={["slot-reel-phrase relative z-[1] block truncate px-2", textClass].join(" ")}>
          {phrase}
        </span>
        <span className="slot-reel-mask slot-reel-mask--top" aria-hidden />
        <span className="slot-reel-mask slot-reel-mask--bottom" aria-hidden />
      </div>
      {won && !spinning && (
        <span className="slot-reel-match-tag" aria-hidden="true">
          winner
        </span>
      )}
    </div>
  );
}
