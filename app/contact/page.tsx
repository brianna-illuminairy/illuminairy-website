import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Email Illuminairy at ${site.supportEmail}.`
};

/**
 * Lightweight contact stub.
 *
 * The footer "Contact" link historically pointed at /contact and was 404ing.
 * This page renders a static fallback with a clickable mailto link, plus a
 * small client-side script that auto-opens the user's email client when JS
 * is available. Browsers that block the auto-open still see the link.
 */
export default function ContactPage() {
  const mailto = `mailto:${site.supportEmail}`;
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        Contact Illuminairy
      </h1>
      <p className="mt-4 text-base text-muted">
        Email{" "}
        <a
          href={mailto}
          className="font-medium text-primary underline underline-offset-4"
        >
          {site.supportEmail}
        </a>{" "}
        and we&apos;ll get back to you within one business day.
      </p>
      <a
        href={mailto}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Open email
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(function(){ try { window.location.href = ${JSON.stringify(mailto)}; } catch(e) {} }, 200);`
        }}
      />
    </main>
  );
}
