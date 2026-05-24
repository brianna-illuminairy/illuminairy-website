import { KidProblemIcon } from "@/components/sat-plan/kid-problem-icons";

/** Reuse INT13 tile art — same six blocker categories. */
const WRONG_TILE_ICON_ID: Record<string, string> = {
  wrong_cat_time: "kid_block_time",
  wrong_cat_focus: "kid_block_focus",
  wrong_cat_anxiety: "kid_block_anxiety",
  wrong_cat_math: "kid_block_math",
  wrong_cat_reading: "kid_block_reading",
  wrong_cat_prep: "kid_block_prep"
};

export function WrongReasonIcon({ id }: { id: string }) {
  const kidId = WRONG_TILE_ICON_ID[id];
  if (!kidId) return null;
  return <KidProblemIcon id={kidId} />;
}
