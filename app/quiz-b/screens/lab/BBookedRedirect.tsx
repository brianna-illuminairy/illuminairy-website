'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QFScreen } from '@/app/quiz/components/QFShell';

export function BBookedRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/portal');
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <QFScreen showBack={false} showProgress={false}>
      <div className="gap-22">
        <p className="qf-meta" style={{ color: 'var(--qf-forest)' }}>
          Lesson booked
        </p>
        <h1 className="qf-h1">Taking you to your portal…</h1>
        <p className="qf-lead">Check your email for the calendar invite and lesson details.</p>
      </div>
    </QFScreen>
  );
}
