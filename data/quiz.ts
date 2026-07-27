import type { QuizQuestion } from '@/types';

/**
 * "How Well Do You Know Us?" (SPEC.md Section 20). Filled with DEMO
 * options so the quiz feels complete — replace the options with real
 * answers whenever ready, and keep `correctIndex` (0-based) matching.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-first-met',
    question: 'আমাদের প্রথম দেখা কীভাবে হয়েছিল?',
    options: ['পরিবারের মাধ্যমে', 'কলেজে', 'কাজের সূত্রে', 'বন্ধুর মাধ্যমে'],
    correctIndex: 0,
  },
  {
    id: 'quiz-first-trip',
    question: 'আমাদের প্রথম ভ্রমণ কোথায় ছিল?',
    options: ['কক্সবাজার', 'সিলেট', 'সুন্দরবন', 'বান্দরবান'],
    correctIndex: 0,
  },
  {
    id: 'quiz-favourite-food',
    question: 'আমি কোন খাবারটা সবচেয়ে বেশি ভালোবাসি?',
    options: ['বিরিয়ানি', 'পিৎজা', 'ইলিশ মাছ', 'চাইনিজ'],
    correctIndex: 0,
  },
  {
    id: 'quiz-always-say',
    question: 'আমি সবসময় কোন কথাটা বলি?',
    options: ['"ভাত খেয়েছ?"', '"কি করছ?"', '"আজকে দিনটা কেমন গেল?"', '"তাড়াতাড়ি আসো"'],
    correctIndex: 0,
  },
  {
    id: 'quiz-favourite-memory',
    question: 'তোমার সাথে আমার প্রিয় স্মৃতি কোনটা?',
    options: ['কক্সবাজারের সমুদ্রতীরে হাঁটা', 'বিয়ের দিন', 'প্রথম দেখা', 'ঘরে বসে আড্ডা'],
    correctIndex: 0,
  },
];
