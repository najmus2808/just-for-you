import type { Letter } from '@/types';

/**
 * The "Open When..." set (SPEC.md Section 14). Filled with DEMO letter
 * bodies so the experience feels complete end-to-end — replace the text
 * with your own real words whenever ready (SPEC.md Section 35.3).
 */
export const LETTERS: Letter[] = [
  {
    id: 'letter-miss-me',
    title: 'Open When You Miss Me',
    lines: [
      'যেদিন আমাকে খুব বেশি miss করবে, সেদিন এই চিঠিটা খুলবে...',
      'জেনে রেখো, দূরে থাকলেও তুমি আমার প্রতিদিনের ভাবনার একটা বড় অংশ। এই miss করাটাও আসলে ভালোবাসারই একটা রূপ।',
    ],
  },
  {
    id: 'letter-sad',
    title: 'Open When You Are Sad',
    lines: [
      'মন খারাপ? এই চিঠিটা তোমার জন্যই রাখা ছিল।',
      'মন খারাপ হওয়াটা দোষের কিছু না। শুধু মনে রেখো, এই খারাপ সময়টাও কেটে যাবে, আর আমি তোমার পাশে আছি, থাকব।',
    ],
  },
  {
    id: 'letter-angry',
    title: 'Open When You Are Angry With Me',
    lines: [
      'আমার উপর রাগ করে আছো? জানি, মাঝে মাঝে আমি ভুল করি।',
      'রাগ করাটাই স্বাভাবিক, তুমি তো পাথর না। শুধু এটুকু বলি, তোমাকে হারানোর ভয়টা আমার রাগের চেয়ে অনেক বড়।',
    ],
  },
  {
    id: 'letter-hug',
    title: 'Open When You Need a Hug',
    lines: [
      'একটা হাগ দরকার? আমি এখন পাশে নেই, কিন্তু এই কথাগুলো একটু হলেও কাছে থাকার মতো লাগুক।',
      'চোখ বন্ধ করে ভাবো, আমি তোমাকে জড়িয়ে ধরে আছি। এইটুকু কল্পনাও যদি একটু শান্তি দেয়, তাহলেই হলো।',
    ],
  },
  {
    id: 'letter-cant-sleep',
    title: "Open When You Can't Sleep",
    lines: [
      'ঘুম আসছে না? চলো, একটু গল্প করি।',
      'মনে আছে, প্রথম যেদিন সারারাত ফোনে কথা বলেছিলাম? সেদিনও ঘুম আসছিল না, শুধু তোমার গলার আওয়াজ শুনতে ইচ্ছে করছিল।',
    ],
  },
  {
    id: 'letter-alone',
    title: 'Open When You Feel Alone',
    lines: [
      'একা লাগছে? তুমি কখনোই একা নও।',
      'যতদূরেই থাকি না কেন, তুমি আমার মাথায়, আমার দোয়ায় সবসময় থাকো। এই একা লাগাটা সাময়িক, আমাদের বন্ধনটা না।',
    ],
  },
  {
    id: 'letter-how-much',
    title: 'Open When You Want to Know How Much I Love You',
    lines: [
      'কতটা ভালোবাসি জানতে চাও?',
      'এতটাই যে প্রতিদিন নতুন করে বলার মতো কথা খুঁজে পাই না, শুধু অনুভব করি। তুমি আমার সবচেয়ে ভালো decision.',
    ],
  },
];
