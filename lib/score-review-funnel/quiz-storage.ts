const STORAGE_KEY = "qsr_snapshot";

export type StoredScoreReviewAnswers = Record<string, unknown>;

export type ScoreReviewSnapshot = {
  answers: StoredScoreReviewAnswers;
  lastStep: string | null;
  updatedAt: number;
};

export function readQuizSnapshotClient(): ScoreReviewSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ScoreReviewSnapshot;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persistQuizSnapshot(snapshot: ScoreReviewSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // storage full or private mode
  }
}

export function resolveHydratedQuizSnapshot(
  serverSnapshot?: ScoreReviewSnapshot | null
): ScoreReviewSnapshot | null {
  const client = readQuizSnapshotClient();
  if (!client && !serverSnapshot) return null;
  if (!client) return serverSnapshot ?? null;
  if (!serverSnapshot) return client;
  return client.updatedAt >= serverSnapshot.updatedAt ? client : serverSnapshot;
}

export function hasQuizProgress(snapshot: ScoreReviewSnapshot): boolean {
  const a = snapshot.answers;
  return Boolean(
    a.srGrade ||
      a.srRecentScore ||
      a.parentEmail ||
      a.parentName ||
      snapshot.lastStep
  );
}
