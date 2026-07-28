import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

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

  const refresh = useCallback(async () => {
    const stored = await getItem<QuizQuestion[]>(STORAGE_KEY);
    setQuestions(stored ?? DEFAULT_QUESTIONS);
    setLoading(false);
  }, []);

  // The quiz screen stays mounted behind the edit screen, so it needs to
  // re-read from storage whenever navigation returns to it.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const updateQuestions = useCallback(async (next: QuizQuestion[]) => {
    setQuestions(next);
    await setItem(STORAGE_KEY, next);
  }, []);

  return { questions, loading, updateQuestions };
}
