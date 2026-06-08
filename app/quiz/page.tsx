import { Suspense } from "react";
import { QuizProvider } from "./state";
import QuizRunner from "./QuizRunner";

export default function QuizPage() {
  return (
    <div className="qf-funnel-stage">
      <QuizProvider>
        <Suspense fallback={<div className="qf-page qf-page--skeleton" aria-hidden />}>
          <QuizRunner />
        </Suspense>
      </QuizProvider>
    </div>
  );
}
