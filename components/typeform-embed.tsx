"use client";

import Script from "next/script";

type TypeformEmbedProps = {
  /** Full `form.typeform.com/to/…` URL or bare form id (e.g. `AbCdEf12`). */
  formUrlOrId: string;
  className?: string;
  minHeight?: number;
};

function resolveTypeformId(formUrlOrId: string): string | null {
  const trimmed = formUrlOrId.trim();
  if (!trimmed) return null;
  if (trimmed.includes("form.typeform.com/to/")) {
    const segment = trimmed.split("/to/")[1];
    return segment?.split("?")[0]?.split("#")[0] || null;
  }
  return trimmed;
}

export function TypeformEmbed({
  formUrlOrId,
  className = "",
  minHeight = 640
}: TypeformEmbedProps) {
  const formId = resolveTypeformId(formUrlOrId);
  if (!formId) return null;

  return (
    <>
      <div
        data-tf-widget={formId}
        data-tf-opacity="100"
        data-tf-iframe-props="title=Illuminairy mentor application"
        className={className}
        style={{ width: "100%", minHeight }}
      />
      <Script src="https://embed.typeform.com/next/embed.js" strategy="lazyOnload" />
    </>
  );
}
