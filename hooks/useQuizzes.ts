import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Quiz } from '@/types';
import {
  addQuiz as addQuizToStorage,
  deleteQuiz as deleteQuizFromStorage,
  getQuizzes,
  updateQuiz as updateQuizInStorage,
} from '@/utils/quizStorage';

/** All quizzes — each with its own title and any number of questions. */
export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await getQuizzes();
    setQuizzes(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getQuizzes();
      if (!cancelled) {
        setQuizzes(stored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const addQuiz = useCallback(
    async (title: string) => {
      const quiz = await addQuizToStorage(title);
      await refresh();
      return quiz;
    },
    [refresh],
  );

  const deleteQuiz = useCallback(
    async (id: string) => {
      await deleteQuizFromStorage(id);
      await refresh();
    },
    [refresh],
  );

  const updateQuiz = useCallback(
    async (id: string, patch: Partial<Pick<Quiz, 'title' | 'questions'>>) => {
      await updateQuizInStorage(id, patch);
      await refresh();
    },
    [refresh],
  );

  return { quizzes, loading, addQuiz, deleteQuiz, updateQuiz };
}
