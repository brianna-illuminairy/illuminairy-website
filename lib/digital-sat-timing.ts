/** Digital SAT timing — for parent guides; verify against College Board if format changes. */

/** Total testing time (Reading & Writing + Math), excluding breaks. */
export const digitalSatTestingMinutes = 134;

export const digitalSatTestingLabel = "two hours and fourteen minutes";

/** Common in-class test lengths (single subject, one sitting). */
export const typicalClassTestMinutes = [30, 40, 50] as const;

/** SAT testing time ÷ a class-period length (e.g. 3.4× a 40-minute test). */
export function satLengthMultipleOf(classMinutes: number): number {
  return Math.round((digitalSatTestingMinutes / classMinutes) * 10) / 10;
}
