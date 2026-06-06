import { Suspense } from "react";
import AdminLoginForm from "./login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-sm px-6 py-16 text-sm text-muted-foreground">
          Loading…
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
