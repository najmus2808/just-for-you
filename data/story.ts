import type { TimelineEvent } from '@/types';

/**
 * Starter/demo entries for the relationship timeline (SPEC.md Section 12) —
 * shaped for an arranged marriage: one family-arranged meeting, then the
 * wedding, then getting to know each other for real. These seed into the
 * same editable store as any event added on-device (utils/storyStorage.ts),
 * so everything here is just a starting point, not a fixed script.
 */
export const STARTER_STORY_EVENTS: TimelineEvent[] = [
  {
    id: 'story-met',
    title: 'The Day We Met',
    date: '2023-08-12',
    description:
      'পরিবারের মাধ্যমে সেই একটা দিন। খুব বেশি কথা হয়নি, তবু বুঝেছিলাম, এই মানুষটার সাথে বাকি জীবনটা চলতে পারে।',
  },
  {
    id: 'story-wedding',
    title: 'Our Wedding',
    date: '2023-10-20',
    description: 'একটা দিনের দেখা থেকে সরাসরি বিয়ে — ভয়ও ছিল, তবে তার চেয়ে বেশি ছিল একটা অন্যরকম বিশ্বাস।',
    isMilestone: true,
  },
  {
    id: 'story-getting-to-know',
    title: 'Getting to Know Each Other',
    date: '2023-11-15',
    description: 'বিয়ের পরেই আসলে আমাদের গল্পটা শুরু হয়েছিল। একটু একটু করে তোমাকে চেনা, আর প্রতিদিন নতুন করে ভালো লাগা।',
  },
  {
    id: 'story-first-trip',
    title: 'Our First Trip',
    date: '2024-01-15',
    description: 'কক্সবাজারের সমুদ্রের সামনে দাঁড়িয়ে বুঝেছিলাম, ঘুরতে যাওয়া মানেই শুধু জায়গা না, তোমার পাশে থাকাটাই আসল।',
  },
];
