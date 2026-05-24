"use client";

import Link from "next/link";
import { painVoiceQuotes, type PainVoiceQuote } from "@/lib/pain-voice-quotes";

function QuoteCard({ quote }: { quote: PainVoiceQuote }) {
  return (
    <figure className="pain-quote-card">
      <figcaption className="pain-quote-theme">
        <span>{quote.theme}</span>
        <span className="pain-quote-frequency">{quote.frequency}</span>
      </figcaption>
      <blockquote className="pain-quote-text">&ldquo;{quote.text}&rdquo;</blockquote>
      <Link
        href={quote.url}
        target="_blank"
        rel="noopener noreferrer"
        className="pain-quote-source"
      >
        {quote.source} ↗
      </Link>
    </figure>
  );
}

function MarqueeRow({
  quotes,
  direction
}: {
  quotes: readonly PainVoiceQuote[];
  direction: "left" | "right";
}) {
  const track = [...quotes, ...quotes];

  return (
    <div className="pain-marquee-row" aria-hidden={false}>
      <div
        className={[
          "pain-marquee-track",
          direction === "right" ? "pain-marquee-track--reverse" : ""
        ].join(" ")}
      >
        {track.map((quote, i) => (
          <QuoteCard key={`${quote.id}-${i}`} quote={quote} />
        ))}
      </div>
    </div>
  );
}

export function PainQuoteMarquee() {
  const rowA = painVoiceQuotes.filter((_, i) => i % 2 === 0);
  const rowB = painVoiceQuotes.filter((_, i) => i % 2 === 1);

  return (
    <div className="pain-marquee" aria-label="Scrolling quotes from customer research">
      <MarqueeRow quotes={rowA} direction="left" />
      <MarqueeRow quotes={rowB} direction="right" />
    </div>
  );
}
