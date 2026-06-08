'use client';

import { createContext, useContext, type ReactNode } from 'react';

type QFProgressValue = {
  index: number;
  total: number;
};

const QFProgressContext = createContext<QFProgressValue | null>(null);

export function QFProgressProvider({
  index,
  total,
  children,
}: QFProgressValue & { children: ReactNode }) {
  return (
    <QFProgressContext.Provider value={{ index, total }}>
      <div className="qf-funnel-step">{children}</div>
    </QFProgressContext.Provider>
  );
}

export function useQFProgress() {
  return useContext(QFProgressContext);
}
