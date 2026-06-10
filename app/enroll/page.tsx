import { Suspense } from "react";
import EnrollIntakePage from "./enroll-intake";

export const metadata = {
  title: "Enrollment intake",
  robots: { index: false, follow: false }
};

export default function EnrollPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-6 py-16 text-sm text-muted-foreground">
          Loading…
        </main>
      }
    >
      <EnrollIntakePage />
    </Suspense>
  );
}
