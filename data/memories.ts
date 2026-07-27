import type { Memory } from '@/types';

/**
 * Starter/demo entries — never real personal photos (SPEC.md Section 36).
 * Filled with DEMO captions so the vault feels complete; the photos stay
 * as SafeImage's placeholder until real ones are added via Memory Vault →
 * "+ Add Memory" (or by editing these captions directly with real memories).
 */
export const STARTER_MEMORIES: Memory[] = [
  {
    id: 'memory-001',
    title: 'Where It Started',
    date: '2023-08-12',
    location: 'পারিবারিকভাবে প্রথম দেখা',
    caption: 'সেই দিনটার কথা এখনো মনে পড়ে। খুব বেশি কথা হয়নি, তবু কেমন একটা নিশ্চিন্ত অনুভূতি হয়েছিল।',
  },
  {
    id: 'memory-002',
    title: 'Our First Trip',
    date: '2024-01-15',
    location: 'কক্সবাজার',
    caption: 'সমুদ্রের পাড়ে হাঁটতে হাঁটতে তুমি বলেছিলে, এই মুহূর্তটা যেন থেমে থাকে। আমারও ঠিক তাই মনে হয়েছিল।',
  },
  {
    id: 'memory-003',
    title: 'The Wedding Day',
    date: '2023-10-20',
    location: 'কমিউনিটি সেন্টার, ধানমন্ডি',
    caption: 'সবাই তখন ব্যস্ত ছবি তোলায়, আর আমি শুধু তোমার হাসিটা দেখছিলাম।',
  },
];
