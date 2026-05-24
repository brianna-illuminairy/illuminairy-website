"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlotReelWindow } from "@/components/slot-reel-window";
import { runSlotSpinAnimation, useSlotSpin } from "@/hooks/use-slot-spin";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  getHeroMismatchPool,
  getHeroOutcomes,
  getHeroVertical,
  heroOutcomePrefix,
  heroVerticals,
  parseHeroVerticalParam,
  type HeroVerticalId
} from "@/lib/hero-search-outcomes";
import { subscribeToKlaviyo } from "@/lib/klaviyo-client";
import { homePlatform, site } from "@/lib/site";

const STORAGE_KEY = "illuminairy-hero-vertical";
const VERTICAL_LABELS = heroVerticals.map((v) => v.label);

function readStoredVertical(): HeroVerticalId | null {
  if (typeof window === "undefined") return null;
  try {
    return parseHeroVerticalParam(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function verticalIndex(id: HeroVerticalId): number {
  return Math.max(0, heroVerticals.findIndex((v) => v.id === id));
}

export function HeroWaitlistSlot() {
  const searchParams = useSearchParams();
  const [verticalId, setVerticalId] = useState<HeroVerticalId>(() => {
    const fromUrl = parseHeroVerticalParam(searchParams.get("vertical"));
    if (fromUrl) return fromUrl;
    return readStoredVertical() ?? "general";
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [locked, setLocked] = useState(false);
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const welcomeSpun = useRef(false);
  const busyRef = useRef(false);
  const outcomeRunIdRef = useRef(0);

  const animate = !prefersReducedMotion;
  const outcomes = useMemo(() => getHeroOutcomes(verticalId), [verticalId]);
  const outcomeMismatch = useMemo(() => getHeroMismatchPool(verticalId), [verticalId]);
  const verticalMismatch = useMemo(
    () => VERTICAL_LABELS.filter((l) => l !== getHeroVertical(verticalId).label),
    [verticalId]
  );

  const verticalSpin = useSlotSpin(VERTICAL_LABELS, verticalMismatch, animate);
  const outcomeSpin = useSlotSpin(outcomes, outcomeMismatch, animate);

  const verticalIdx = verticalIndex(verticalId);
  const isSpinning = verticalSpin.spinning || outcomeSpin.spinning;
  const isJackpot = locked && !isSpinning && verticalSpin.won && outcomeSpin.won;
  const canSubmit =
    locked && !isSpinning && submitStatus !== "loading" && submitStatus !== "success";

  const persistVertical = useCallback((id: HeroVerticalId) => {
    setVerticalId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const runFullSpin = useCallback(
    async (targetVerticalId: HeroVerticalId) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setLocked(false);
      setSubmitMessage("");

      const idx = verticalIndex(targetVerticalId);
      const nextOutcomes = getHeroOutcomes(targetVerticalId);
      const nextMismatch = getHeroMismatchPool(targetVerticalId);

      verticalSpin.cancel();
      outcomeSpin.cancel();
      outcomeRunIdRef.current += 1;

      await verticalSpin.spinToIndex(idx);
      persistVertical(targetVerticalId);

      await runSlotSpinAnimation({
        items: nextOutcomes,
        targetIndex: 0,
        mismatchPool: nextMismatch,
        animate,
        runIdRef: outcomeRunIdRef,
        onUpdate: outcomeSpin.applySpinState
      });

      setLocked(true);
    },
    [animate, outcomeSpin, persistVertical, verticalSpin]
  );

  const runFullSpinSafe = useCallback(
    async (targetVerticalId: HeroVerticalId) => {
      try {
        await runFullSpin(targetVerticalId);
      } finally {
        busyRef.current = false;
      }
    },
    [runFullSpin]
  );

  const spinRandom = useCallback(() => {
    const idx = Math.floor(Math.random() * heroVerticals.length);
    const id = heroVerticals[idx]?.id ?? "general";
    void runFullSpinSafe(id);
  }, [runFullSpinSafe]);

  const nudgeVertical = useCallback(
    (delta: number) => {
      const next =
        heroVerticals[(verticalIdx + delta + heroVerticals.length) % heroVerticals.length];
      if (next) void runFullSpinSafe(next.id);
    },
    [runFullSpinSafe, verticalIdx]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    verticalSpin.resetDisplay(getHeroVertical(verticalId).label);
    outcomeSpin.resetDisplay(outcomes[0] ?? "");
  }, [verticalId, outcomes, verticalSpin, outcomeSpin]);

  useEffect(() => {
    if (welcomeSpun.current) return;
    welcomeSpun.current = true;
    const initial = readStoredVertical() ?? parseHeroVerticalParam(searchParams.get("vertical")) ?? "general";
    const t = window.setTimeout(() => {
      void runFullSpinSafe(initial);
    }, 600);
    return () => clearTimeout(t);
  }, [runFullSpinSafe, searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitStatus("loading");
    setSubmitMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return;

    const vertical = getHeroVertical(verticalId);
    const properties: Record<string, string> = {
      waitlist_vertical: verticalId,
      waitlist_vertical_label: vertical.label,
      waitlist_outcome: outcomeSpin.phrase
    };

    try {
      await subscribeToKlaviyo({
        email: email.trim(),
        customSource: "illuminairy.com hero slot waitlist",
        properties,
        listId: site.platformWaitlistListId || undefined
      });

      captureAnalytics(AnalyticsEvents.platformWaitlistSubmitted, {
        waitlist_vertical: verticalId,
        waitlist_outcome: outcomeSpin.phrase
      });

      setSubmitStatus("success");
      setEmail("");
      setSubmitMessage(homePlatform.waitlist.successMessage);
    } catch {
      setSubmitStatus("error");
      setSubmitMessage(
        "Something went wrong. Email support@illuminairy.com and we will add you."
      );
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-balance text-[clamp(1.65rem,1rem+3.2vw,3rem)] font-bold leading-[1.12] tracking-tight text-primary">
        <span className="sr-only">{homePlatform.hero.title}</span>
        <span className="block text-primary sm:inline">{heroOutcomePrefix} </span>
        <span className="text-accent" aria-live="polite">
          {outcomeSpin.phrase}
        </span>
      </h1>

      <div
        id="waitlist"
        className={[
          "hero-slot-cabinet mt-6 scroll-mt-24",
          isJackpot ? "hero-slot-cabinet--winner" : ""
        ].join(" ")}
        aria-labelledby="waitlist-cabinet-title"
      >
        <p id="waitlist-cabinet-title" className="hero-slot-cabinet-title">
          {homePlatform.waitlist.slotTitle}
        </p>
        <p className="mt-1 text-sm text-primary-muted">{homePlatform.waitlist.slotSubcopy}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SlotReelWindow
            label="Industry"
            phrase={verticalSpin.phrase}
            spinning={verticalSpin.spinning}
            slotIn={verticalSpin.slotIn}
            won={locked && verticalSpin.won}
            size="sm"
          />
          <SlotReelWindow
            label="Your outcome"
            phrase={outcomeSpin.phrase}
            spinning={outcomeSpin.spinning}
            slotIn={outcomeSpin.slotIn}
            won={locked && outcomeSpin.won}
            size="sm"
          />
        </div>

        {isJackpot && (
          <p className="hero-slot-jackpot-banner" role="status">
            Jackpot — that&apos;s your match
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => nudgeVertical(-1)}
            disabled={isSpinning || submitStatus === "success"}
            className="hero-slot-lever"
            aria-label="Previous industry"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={spinRandom}
            disabled={isSpinning || submitStatus === "success"}
            className="hero-slot-spin-btn"
          >
            {isSpinning ? "Spinning…" : "Spin"}
          </button>
          <button
            type="button"
            onClick={() => nudgeVertical(1)}
            disabled={isSpinning || submitStatus === "success"}
            className="hero-slot-lever"
            aria-label="Next industry"
          >
            ▼
          </button>
        </div>

        {isJackpot && submitStatus !== "success" && (
          <p className="mt-3 text-center text-xs font-medium text-accent">
            {getHeroVertical(verticalId).label} · {outcomeSpin.phrase}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <input type="hidden" name="waitlist_vertical" value={verticalId} />
          <input type="hidden" name="waitlist_outcome" value={outcomeSpin.phrase} />

          <label htmlFor="hero-waitlist-email" className="sr-only">
            Email
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="hero-waitlist-email"
              type="email"
              name="email"
              required
              value={email}
              disabled={!canSubmit}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                locked
                  ? "you@example.com"
                  : "Spin to unlock — then enter your email"
              }
              className="hero-slot-email"
            />
            <button type="submit" disabled={!canSubmit} className="hero-slot-submit">
              {submitStatus === "loading"
                ? "Locking in…"
                : submitStatus === "success"
                  ? "You're in"
                  : homePlatform.waitlist.slotCta}
            </button>
          </div>
        </form>

        {submitMessage && (
          <p
            className={`mt-3 text-center text-sm ${
              submitStatus === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-primary-muted"
            }`}
            role={submitStatus === "error" ? "alert" : "status"}
          >
            {submitMessage}
          </p>
        )}
      </div>
    </div>
  );
}
