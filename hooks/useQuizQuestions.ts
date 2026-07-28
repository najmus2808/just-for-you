import { useCallback, useEffect, useState } from 'react';

import { QUIZ_QUESTIONS as DEFAULT_QUESTIONS } from '@/data/quiz';
import type { QuizQuestion } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:quizOverride';

/** Quiz questions, editable from the phone (SPEC.md Section 20). */
export function useQuizQuestions() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUESTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getItem<QuizQuestion[]>(STORAGE_KEY);
      if (!cancelled) {
        setQuestions(stored ?? DEFAULT_QUESTIONS);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateQuestions = useCallback(async (next: QuizQuestion[]) => {
    setQuestions(next);
    await setItem(STORAGE_KEY, next);
  }, []);

  return { questions, loading, updateQuestions };
}
