import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { DAILY_MESSAGES } from '@/data/surprises';

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function pickMessage(): string {
  const index = dayOfYear(new Date()) % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[index];
}

/**
 * A different message each day, derived from the local calendar date — no
 * backend, no stored schedule. Home is a tab screen that stays mounted for
 * the whole app session, so this re-picks on focus rather than memoizing
 * once — otherwise a session left open across midnight would keep showing
 * yesterday's message until the app fully restarted.
 */
export function useDailySurprise(): string {
  const [message, setMessage] = useState(pickMessage);

  useFocusEffect(
    useCallback(() => {
      setMessage(pickMessage());
    }, []),
  );

  return message;
}
