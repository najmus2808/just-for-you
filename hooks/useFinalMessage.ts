import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { FINAL_MESSAGE_BEATS as DEFAULT_BEATS } from '@/data/finalMessage';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:finalMessageOverride';

/** The Final Surprise's line-by-line message, editable from the phone (SPEC.md Section 22). */
export function useFinalMessage() {
  const [beats, setBeats] = useState<string[]>(DEFAULT_BEATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getItem<string[]>(STORAGE_KEY);
      if (!cancelled) {
        setBeats(stored ?? DEFAULT_BEATS);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    const stored = await getItem<string[]>(STORAGE_KEY);
    setBeats(stored ?? DEFAULT_BEATS);
    setLoading(false);
  }, []);

  // The Final Surprise screen stays mounted behind the edit screen, so it
  // needs to re-read from storage whenever navigation returns to it.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const updateBeats = useCallback(async (next: string[]) => {
    setBeats(next);
    await setItem(STORAGE_KEY, next);
  }, []);

  return { beats, loading, updateBeats };
}
