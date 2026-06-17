"use client";

import { useSyncExternalStore } from "react";

type SohaPdfViewerProps = {
  src: string;
  title: string;
  openLabel: string;
};

function canEmbedPdfInline() {
  if (typeof navigator === "undefined") {
    return true;
  }

  const ua = navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  return !isIos;
}

function subscribeToPdfEmbedPreference() {
  return () => {};
}

export function SohaPdfViewer({ src, title, openLabel }: SohaPdfViewerProps) {
  const embedInline = useSyncExternalStore(
    subscribeToPdfEmbedPreference,
    canEmbedPdfInline,
    () => true
  );

  return (
    <div className="danielle-portal__pdf-viewer">
      <div className="danielle-portal__pdf-actions">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="danielle-portal__pdf-open"
        >
          {openLabel}
        </a>
        {!embedInline ? (
          <p className="danielle-portal__pdf-hint">
            On iPhone and iPad, use the button above to open the PDF. In-page preview is not
            supported in mobile Safari.
          </p>
        ) : null}
      </div>
      {embedInline ? (
        <iframe src={src} title={title} className="danielle-portal__pdf-frame" />
      ) : null}
    </div>
  );
}
