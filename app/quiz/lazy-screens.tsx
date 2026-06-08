import dynamic from 'next/dynamic';

export const QFI2Compute = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFI2Compute })),
  { loading: () => null }
);
export const QFIGPAGap = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFIGPAGap })),
  { loading: () => null }
);
export const QFV1Projection = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFV1Projection })),
  { loading: () => null }
);
export const QFIDiagnosis = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFIDiagnosis })),
  { loading: () => null }
);
export const QFISteps = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFISteps })),
  { loading: () => null }
);
export const QFIComparePrep = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFIComparePrep })),
  { loading: () => null }
);
export const QFIDoubtsInsight = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFIDoubtsInsight })),
  { loading: () => null }
);
export const QFIHopeScreen = dynamic(
  () => import('./screens/Interstitials').then((m) => ({ default: m.QFIHopeScreen })),
  { loading: () => null }
);

export const QFSPlanReveal = dynamic(
  () => import('./screens/Results').then((m) => ({ default: m.QFSPlanReveal })),
  { loading: () => null }
);

export const QFS4PlanHandoff = dynamic(
  () => import('./screens/Finale').then((m) => ({ default: m.QFS4PlanHandoff })),
  { loading: () => null }
);
export const QFS5Approved = dynamic(
  () => import('./screens/Finale').then((m) => ({ default: m.QFS5Approved })),
  { loading: () => null }
);
export const QFS9ThankYou = dynamic(
  () => import('./screens/Finale').then((m) => ({ default: m.QFS9ThankYou })),
  { loading: () => null }
);
