import { Suspense } from "react";
import { QuizProvider } from "./state";
import QuizRunner from "./QuizRunner";

export default function QuizPage() {
  return (
    <QuizProvider>
      <Suspense fallback={<div className="qf-page" style={{ minHeight: "100dvh" }} />}>
        <QuizRunner />
      </Suspense>
    </QuizProvider>
  );
}
