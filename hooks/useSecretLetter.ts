import { useCallback, useEffect, useState } from 'react';

import { SECRET_LETTER as DEFAULT_SECRET_LETTER } from '@/data/secret';
import type { SecretLetterContent } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:secretLetterOverride';

/** The Secret Letter's content, editable from the phone once unlocked (SPEC.md Section 15). */
export function useSecretLetter() {
  const [content, setContent] = useState<SecretLetterContent>(DEFAULT_SECRET_LETTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getItem<SecretLetterContent>(STORAGE_KEY);
      if (!cancelled) {
        setContent(stored ?? DEFAULT_SECRET_LETTER);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateContent = useCallback(async (next: SecretLetterContent) => {
    setContent(next);
    await setItem(STORAGE_KEY, next);
  }, []);

  return { content, loading, updateContent };
}
