import { useEffect, useState } from 'react';

import { APP_CONFIG } from '@/data/appConfig';
import { daysBetween, getNextAnniversary, parseConfigDate } from '@/utils/dateUtils';

export type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
};

/** Ticking countdown to the next anniversary (SPEC.md Section 17). `null` until the real date is set. */
export function useCountdown(): CountdownState | null {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const anniversary = parseConfigDate(APP_CONFIG.anniversaryDate);
  if (!anniversary) return null;

  const target = getNextAnniversary(anniversary, now);
  const isToday = daysBetween(now, target) === 0;
  const diffMs = Math.max(target.getTime() - now.getTime(), 0);

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isToday };
}
