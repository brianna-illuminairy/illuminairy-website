import { redirect } from "next/navigation";

export const metadata = {
  title: "Enrollment confirmed",
  robots: { index: false, follow: false }
};

export default async function EnrollSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  if (params.session_id) {
    redirect(`/enroll?session_id=${encodeURIComponent(params.session_id)}`);
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl font-semibold">Payment received</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Check your email for the intake link, or contact support@illuminairy.com if you
        need help.
      </p>
    </main>
  );
}
