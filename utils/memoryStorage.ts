import { Directory, File, Paths } from 'expo-file-system';

import type { Memory } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:userMemories';

function getMemoriesDirectory(): Directory {
  const directory = new Directory(Paths.document, 'memories');
  if (!directory.exists) {
    directory.create({ intermediates: true });
  }
  return directory;
}

/**
 * Image-picker URIs aren't guaranteed to survive an app/device restart, so
 * every picked photo is copied into the app's own document storage before
 * the memory is saved (SPEC.md Section 36).
 */
async function persistPickedPhoto(pickedUri: string, memoryId: string, index: number): Promise<string> {
  const source = new File(pickedUri);
  const extension = source.extension || '.jpg';
  const destination = new File(getMemoriesDirectory(), `${memoryId}-${index}${extension}`);
  await source.copy(destination);
  return destination.uri;
}

export type NewMemoryInput = {
  title: string;
  date: string;
  location?: string;
  caption: string;
  pickedUris: string[];
};

export async function getUserMemories(): Promise<Memory[]> {
  const stored = await getItem<Memory[]>(STORAGE_KEY);
  return stored ?? [];
}

async function saveUserMemories(memories: Memory[]): Promise<void> {
  await setItem(STORAGE_KEY, memories);
}

export async function addUserMemory(input: NewMemoryInput): Promise<Memory> {
  const id = `user-memory-${Date.now()}`;
  const photoUris = await Promise.all(
    input.pickedUris.map((uri, index) => persistPickedPhoto(uri, id, index)),
  );

  const memory: Memory = {
    id,
    title: input.title.trim() || 'A Memory',
    date: input.date,
    location: input.location?.trim() || undefined,
    caption: input.caption.trim(),
    photos: photoUris.map((uri) => ({ uri })),
    isUserAdded: true,
    createdAt: new Date().toISOString(),
  };

  const existing = await getUserMemories();
  await saveUserMemories([memory, ...existing]);
  return memory;
}

export async function deleteUserMemory(id: string): Promise<void> {
  const existing = await getUserMemories();
  const target = existing.find((memory) => memory.id === id);
  const remaining = existing.filter((memory) => memory.id !== id);
  await saveUserMemories(remaining);

  if (target?.photos) {
    for (const photo of target.photos) {
      if (typeof photo === 'object' && 'uri' in photo && photo.uri) {
        try {
          new File(photo.uri).delete();
        } catch {
          // Already gone — nothing to clean up.
        }
      }
    }
  }
}

export async function updateUserMemory(
  id: string,
  patch: Partial<Pick<Memory, 'title' | 'date' | 'location' | 'caption'>>,
): Promise<void> {
  const existing = await getUserMemories();
  const next = existing.map((memory) => (memory.id === id ? { ...memory, ...patch } : memory));
  await saveUserMemories(next);
}
