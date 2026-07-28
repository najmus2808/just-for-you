import { useCallback, useEffect, useState } from 'react';

import { LETTERS as DEFAULT_LETTERS } from '@/data/letters';
import type { Letter } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:lettersOverride';

/** Letters, editable from the phone (SPEC.md Section 14) — falls back to the built-in set until edited. */
export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>(DEFAULT_LETTERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getItem<Letter[]>(STORAGE_KEY);
      if (!cancelled) {
        setLetters(stored ?? DEFAULT_LETTERS);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateLetter = useCallback(
    async (id: string, lines: string[]) => {
      const next = letters.map((letter) => (letter.id === id ? { ...letter, lines } : letter));
      setLetters(next);
      await setItem(STORAGE_KEY, next);
    },
    [letters],
  );

  return { letters, loading, updateLetter };
}
