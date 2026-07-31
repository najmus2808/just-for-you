import type { ImageSource } from 'expo-image';

export interface AppConfig {
  wifeName: string;
  husbandName: string;
  /** 'YYYY-MM-DD', or a TODO_ placeholder until the real date is known. */
  relationshipStartDate: string;
  /** 'YYYY-MM-DD', or a TODO_ placeholder until the real date is known. */
  anniversaryDate: string;
}

/**
 * `number` — a `require('../assets/...')` result, for bundled/demo photos.
 * `ImageSource` (`{ uri: 'file://...' }`) — a real photo the user added on
 * their own device via the Memory Vault picker (SPEC.md Section 36); never
 * bundled into the APK. Leaving this undefined renders SafeImage's
 * placeholder.
 */
export type PhotoSource = ImageSource | number;

export interface TimelineEvent {
  id: string;
  /** Short English title, e.g. "Our First Trip" (SPEC.md Section 35.4). */
  title: string;
  /** 'YYYY-MM-DD', or a TODO_ placeholder until the real date is known. */
  date: string;
  photo?: PhotoSource;
  /** Personal description, primarily Bangla (SPEC.md Section 35.4). */
  description: string;
  /** Extra reveal-on-tap content — engagement/wedding-scale moments get a stronger haptic. */
  isMilestone?: boolean;
  /** Optional bonus paragraph revealed on tap, alongside `description`. */
  secretNote?: string;
  /** The live "Today" entry has no photo slot to fill in — hide it rather than showing a TODO placeholder. */
  hidePhotoSlot?: boolean;
  /** Present on every event except the computed, non-editable "Today" entry. */
  isUserAdded?: boolean;
  createdAt?: string;
}

export interface Letter {
  id: string;
  /** English card title, e.g. "Open When You Miss Me" (SPEC.md Section 35.5). */
  title: string;
  /** Revealed one at a time; primarily Bangla (SPEC.md Section 35.5). */
  lines: string[];
}

export interface QuizQuestion {
  id: string;
  /** Primarily Bangla (SPEC.md Section 35.8). */
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  /** e.g. "How Well Do You Know Us?" — each quiz has its own title. */
  title: string;
  questions: QuizQuestion[];
  createdAt?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  /** Why this song matters, primarily Bangla (SPEC.md Section 35). */
  reason: string;
  /** A `require('../assets/audio/songs/...')` result. Undefined until the real file is added. */
  audioAsset?: number;
}

export interface SecretLetterContent {
  discoveryLine: string;
  opening: string;
  body: string;
  closingBangla: string;
  closingEnglish: string;
  final: string;
}

export interface Memory {
  id: string;
  /** Short English title, e.g. "Our First Trip" (SPEC.md Section 35.4). */
  title: string;
  /** 'YYYY-MM-DD', or a TODO_ placeholder until the real date is known. */
  date: string;
  location?: string;
  /** One or more photos (the Add Memory picker supports multi-select). Empty/undefined renders SafeImage's placeholder. */
  photos?: PhotoSource[];
  /** Personal caption, primarily Bangla (SPEC.md Section 35.4). */
  caption: string;
  /** Present only on memories the user added on-device via the picker. */
  isUserAdded?: boolean;
  createdAt?: string;
}

export interface Place {
  id: string;
  /** Name of the place, e.g. "Cox's Bazar". */
  name: string;
  /** Optional note about the trip — when, or what made it special. */
  note?: string;
  createdAt: string;
}
