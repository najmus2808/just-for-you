import { useEffect, useState } from 'react';

import { APP_CONFIG } from '@/data/appConfig';
import { getElapsedDuration, parseConfigDate, type ElapsedDuration } from '@/utils/dateUtils';

/** Live-ticking "married for" duration since the anniversary date. `null` until the real date is set. */
export function useElapsedTime(): ElapsedDuration | null {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const anniversary = parseConfigDate(APP_CONFIG.anniversaryDate);
  if (!anniversary) return null;

  return getElapsedDuration(anniversary, now);
}
