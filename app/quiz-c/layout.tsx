import type { Metadata } from 'next';
import { funnelFontClassName } from '@/lib/funnel-fonts';
import '../quiz-funnel.css';
import '../quiz-globals.css';
import '../funnel-responsive.css';
import { QFFunnelLegal } from '../quiz/components/QFFunnelLegal';

export const metadata: Metadata = {
  title: 'June SAT Score Review · Illuminairy',
  description:
    'Book a free June SAT Score Review with an SAT expert. Review the score report, see missed skills, and map the fastest path before the next test.',
  robots: { index: false, follow: true },
};

export default function QuizCLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`qf-funnel-root ${funnelFontClassName}`}>
      <div className="qf-funnel-column">
        <div className="qf-funnel-fill">{children}</div>
        <QFFunnelLegal />
      </div>
    </div>
  );
}
