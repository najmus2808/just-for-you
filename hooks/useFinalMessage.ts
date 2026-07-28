import { useCallback, useEffect, useState } from 'react';

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

  const updateBeats = useCallback(async (next: string[]) => {
    setBeats(next);
    await setItem(STORAGE_KEY, next);
  }, []);

  return { beats, loading, updateBeats };
}
