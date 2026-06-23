'use client';

import { useState } from 'react';
import Image from 'next/image';
import { QFScreen } from '@/app/quiz/components/QFShell';

type Props = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
};

export function BPostDevice({ value, onSelect, onBack }: Props) {
  const [toastOpen, setToastOpen] = useState(true);

  return (
    <QFScreen stepIdx={21} onBack={onBack} showProgress={false} showBack={false}>
      {toastOpen ? (
        <div className="qfb-booked-toast" role="status">
          <span className="qfb-booked-toast__icon" aria-hidden="true">
            ✓
          </span>
          <p className="qfb-booked-toast__text">
            You&apos;ve successfully booked your free SAT lesson
          </p>
          <button
            type="button"
            className="qfb-booked-toast__close"
            aria-label="Dismiss"
            onClick={() => setToastOpen(false)}
          >
            ×
          </button>
        </div>
      ) : null}

      <div className="qfb-post-device">
        <article className="qfb-post-device__card qf-card">
          <figure className="qfb-post-device__figure">
            <Image
              src="/photos/tutor-student-session-aayan.png"
              alt="A live one-on-one Illuminairy tutoring session: a tutor and student solving a problem together on a shared whiteboard."
              width={1024}
              height={576}
              sizes="(min-width: 480px) 420px, 92vw"
              priority
            />
          </figure>

          <div className="qfb-post-device__copy">
            <h1 className="qfb-post-device__title">
              For the best experience, use a computer or tablet ✨
            </h1>
            <p className="qfb-post-device__lead">
              A larger screen helps your child fully engage with personalized, interactive tasks
              during the lesson
            </p>

            <div className="qfb-post-device__actions">
              <button
                type="button"
                className={
                  value === 'computer-tablet'
                    ? 'qfb-post-device__btn qfb-post-device__btn--primary qfb-post-device__btn--selected'
                    : 'qfb-post-device__btn qfb-post-device__btn--primary'
                }
                onClick={() => onSelect('computer-tablet')}
              >
                We&apos;ll use a computer or tablet
              </button>
              <button
                type="button"
                className={
                  value === 'phone'
                    ? 'qfb-post-device__btn qfb-post-device__btn--secondary qfb-post-device__btn--selected'
                    : 'qfb-post-device__btn qfb-post-device__btn--secondary'
                }
                onClick={() => onSelect('phone')}
              >
                We only have a phone
              </button>
            </div>
          </div>
        </article>
      </div>
    </QFScreen>
  );
}
