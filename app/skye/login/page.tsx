import { Suspense } from "react";
import SkyeLoginForm from "./login-form";

export default function SkyeLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-sm px-6 py-16 text-sm text-[#7C7666]">Loading…</main>
      }
    >
      <SkyeLoginForm />
    </Suspense>
  );
}
