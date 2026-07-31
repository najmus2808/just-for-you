import { useCallback, useEffect, useState } from 'react';

import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:introPhoto';

/** The single "Our story." photo shown mid-intro — editable right from the intro itself. */
export function useIntroPhoto() {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getItem<string>(STORAGE_KEY);
      if (!cancelled) {
        setUri(stored ?? null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateUri = useCallback(async (next: string) => {
    setUri(next);
    await setItem(STORAGE_KEY, next);
  }, []);

  return { uri, updateUri };
}
