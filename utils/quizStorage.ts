import { QUIZ_QUESTIONS as DEFAULT_QUESTIONS } from '@/data/quiz';
import type { Quiz } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:quizzes';
const SEEDED_KEY = 'jfy:quizzesSeeded';

/**
 * The original single quiz (data/quiz.ts) becomes the first entry in the
 * same editable, multi-quiz store, the first time this runs — mirrors how
 * memories/story seed their starter content (utils/memoryStorage.ts).
 */
async function ensureSeeded(): Promise<void> {
  const alreadySeeded = await getItem<boolean>(SEEDED_KEY);
  if (alreadySeeded) return;

  const stored = (await getItem<Quiz[]>(STORAGE_KEY)) ?? [];
  const starterQuiz: Quiz = {
    id: 'quiz-starter',
    title: 'How Well Do You Know Us?',
    questions: DEFAULT_QUESTIONS,
    createdAt: new Date().toISOString(),
  };
  await setItem(STORAGE_KEY, [starterQuiz, ...stored]);
  await setItem(SEEDED_KEY, true);
}

export async function getQuizzes(): Promise<Quiz[]> {
  await ensureSeeded();
  const stored = await getItem<Quiz[]>(STORAGE_KEY);
  return stored ?? [];
}

async function saveQuizzes(quizzes: Quiz[]): Promise<void> {
  await setItem(STORAGE_KEY, quizzes);
}

export async function addQuiz(title: string): Promise<Quiz> {
  const quiz: Quiz = {
    id: `quiz-${Date.now()}`,
    title: title.trim() || 'New Quiz',
    questions: [],
    createdAt: new Date().toISOString(),
  };
  const existing = await getQuizzes();
  await saveQuizzes([quiz, ...existing]);
  return quiz;
}

export async function deleteQuiz(id: string): Promise<void> {
  const existing = await getQuizzes();
  await saveQuizzes(existing.filter((quiz) => quiz.id !== id));
}

export async function updateQuiz(
  id: string,
  patch: Partial<Pick<Quiz, 'title' | 'questions'>>,
): Promise<void> {
  const existing = await getQuizzes();
  const next = existing.map((quiz) => (quiz.id === id ? { ...quiz, ...patch } : quiz));
  await saveQuizzes(next);
}
