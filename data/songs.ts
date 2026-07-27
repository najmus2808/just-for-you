import type { Song } from '@/types';

/**
 * "Our Songs" (SPEC.md Section 19). Titles/reasons are DEMO content so the
 * screen feels complete — add the actual audio files to
 * assets/audio/songs/ and set `audioAsset: require('@/assets/audio/songs/your-file.mp3')`
 * whenever ready; until then the player shows gracefully that the track
 * isn't loaded yet (SPEC.md Section 28) instead of crashing.
 */
export const SONGS: Song[] = [
  {
    id: 'song-001',
    title: 'Amar Bhitore Bahire',
    artist: 'Anusheh Anadil',
    reason: 'প্রথম যেদিন একসাথে গাড়িতে অনেকটা পথ গিয়েছিলাম, এই গানটাই বাজছিল।',
  },
  {
    id: 'song-002',
    title: 'Icchey Nodee',
    artist: 'Chandrabindoo',
    reason: 'তোমার সাথে প্রথম যেদিন ছাদে বসে গান শুনেছিলাম, এটাই ছিল।',
  },
  {
    id: 'song-003',
    title: 'Bondhu Tumi Shotru Tumi',
    artist: 'Shironamhin',
    reason: 'আমাদের ঝগড়ার পরে মিটমাটের থিম গান বলা যায় এটাকে।',
  },
];
