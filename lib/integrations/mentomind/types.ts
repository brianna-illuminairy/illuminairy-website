export type MentoMindJobType =
  | "create_student"
  | "download_reports"
  | "assign_practice"
  | "sync_progress";

export type MentoMindStudentInput = {
  firstName: string;
  lastName: string;
  email: string;
  parentEmail?: string;
};

export interface MentoMindAdapter {
  createFreeStudent(input: MentoMindStudentInput): Promise<{ ok: boolean; externalId?: string }>;
  downloadDiagnosticReports(
    externalStudentId: string
  ): Promise<{ ok: boolean; tabularPath?: string; pdfPath?: string }>;
  assignPractice(
    externalStudentId: string,
    topic: string
  ): Promise<{ ok: boolean }>;
  fetchProgress(
    externalStudentId: string
  ): Promise<{ ok: boolean; completionPct?: number }>;
}

/** Stub until Playwright worker is configured — queues jobs for manual follow-up. */
export const browserMentoMindAdapter: MentoMindAdapter = {
  async createFreeStudent() {
    return { ok: false };
  },
  async downloadDiagnosticReports() {
    return { ok: false };
  },
  async assignPractice() {
    return { ok: false };
  },
  async fetchProgress() {
    return { ok: false };
  }
};
