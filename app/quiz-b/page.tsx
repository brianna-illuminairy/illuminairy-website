import { cookies } from "next/headers";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel-b/quiz-cookie";
import { handlePlanBuilderOAuthReturn } from "@/lib/quiz-funnel-b/oauth-return";
import { QuizClientRoot } from "./QuizClientRoot";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QuizBPage({ searchParams }: PageProps) {
  const params = await searchParams;
  await handlePlanBuilderOAuthReturn(params);

  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);
  return (
    <div className="qf-funnel-stage">
      <QuizClientRoot initialSnapshot={initialSnapshot} />
    </div>
  );
}
