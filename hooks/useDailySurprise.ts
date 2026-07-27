import { useMemo } from 'react';

import { DAILY_MESSAGES } from '@/data/surprises';

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** A different message each day, derived from the local calendar date — no backend, no stored schedule. */
export function useDailySurprise(): string {
  return useMemo(() => {
    const index = dayOfYear(new Date()) % DAILY_MESSAGES.length;
    return DAILY_MESSAGES[index];
  }, []);
}
