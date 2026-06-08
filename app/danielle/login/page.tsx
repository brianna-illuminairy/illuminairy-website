import { Suspense } from "react";
import DanielleLoginForm from "./login-form";

export default function DanielleLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-sm px-6 py-16 text-sm text-[#7C7666]">
          Loading…
        </main>
      }
    >
      <DanielleLoginForm />
    </Suspense>
  );
}
