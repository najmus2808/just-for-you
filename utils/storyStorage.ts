import { Directory, File, Paths } from 'expo-file-system';

import { STARTER_STORY_EVENTS } from '@/data/story';
import type { TimelineEvent } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:userStoryEvents';
const SEEDED_KEY = 'jfy:storySeeded';

function getStoryPhotosDirectory(): Directory {
  const directory = new Directory(Paths.document, 'story');
  if (!directory.exists) {
    directory.create({ intermediates: true });
  }
  return directory;
}

async function persistPickedPhoto(pickedUri: string, eventId: string): Promise<string> {
  const source = new File(pickedUri);
  const extension = source.extension || '.jpg';
  const destination = new File(getStoryPhotosDirectory(), `${eventId}-${Date.now()}${extension}`);
  await source.copy(destination);
  return destination.uri;
}

export type NewStoryEventInput = {
  title: string;
  date: string;
  description: string;
  isMilestone?: boolean;
  pickedUri?: string;
};

/** Seeds the starter timeline into the same editable store on first run, just like Memory Vault (SPEC.md Section 36). */
async function ensureSeeded(): Promise<void> {
  const alreadySeeded = await getItem<boolean>(SEEDED_KEY);
  if (alreadySeeded) return;

  const stored = (await getItem<TimelineEvent[]>(STORAGE_KEY)) ?? [];
  const seeded = STARTER_STORY_EVENTS.map((event) => ({ ...event, isUserAdded: true }));
  await setItem(STORAGE_KEY, [...stored, ...seeded]);
  await setItem(SEEDED_KEY, true);
}

export async function getUserStoryEvents(): Promise<TimelineEvent[]> {
  await ensureSeeded();
  const stored = await getItem<TimelineEvent[]>(STORAGE_KEY);
  return stored ?? [];
}

async function saveStoryEvents(events: TimelineEvent[]): Promise<void> {
  await setItem(STORAGE_KEY, events);
}

export async function addStoryEvent(input: NewStoryEventInput): Promise<TimelineEvent> {
  const id = `user-story-${Date.now()}`;
  const photoUri = input.pickedUri ? await persistPickedPhoto(input.pickedUri, id) : undefined;

  const event: TimelineEvent = {
    id,
    title: input.title.trim() || 'A Moment',
    date: input.date,
    description: input.description.trim(),
    isMilestone: input.isMilestone,
    photo: photoUri ? { uri: photoUri } : undefined,
    isUserAdded: true,
    createdAt: new Date().toISOString(),
  };

  const existing = await getUserStoryEvents();
  await saveStoryEvents([...existing, event]);
  return event;
}

export async function updateStoryEvent(
  id: string,
  patch: Partial<Pick<TimelineEvent, 'title' | 'date' | 'description' | 'isMilestone'>>,
): Promise<void> {
  const existing = await getUserStoryEvents();
  const next = existing.map((event) => (event.id === id ? { ...event, ...patch } : event));
  await saveStoryEvents(next);
}

/** Replaces (or clears, with `pickedUri: null`) an event's single photo. */
export async function updateStoryEventPhoto(id: string, pickedUri: string | null): Promise<void> {
  const existing = await getUserStoryEvents();
  const event = existing.find((item) => item.id === id);
  if (!event) return;

  if (event.photo && typeof event.photo === 'object' && 'uri' in event.photo && event.photo.uri) {
    try {
      new File(event.photo.uri).delete();
    } catch {
      // Already gone — nothing to clean up.
    }
  }

  const photo = pickedUri ? { uri: await persistPickedPhoto(pickedUri, id) } : undefined;
  const next = existing.map((item) => (item.id === id ? { ...item, photo } : item));
  await saveStoryEvents(next);
}

export async function deleteStoryEvent(id: string): Promise<void> {
  const existing = await getUserStoryEvents();
  const target = existing.find((event) => event.id === id);
  const remaining = existing.filter((event) => event.id !== id);
  await saveStoryEvents(remaining);

  if (target?.photo && typeof target.photo === 'object' && 'uri' in target.photo && target.photo.uri) {
    try {
      new File(target.photo.uri).delete();
    } catch {
      // Already gone — nothing to clean up.
    }
  }
}
