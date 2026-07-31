import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { STARTER_MEMORIES } from '@/data/memories';
import type { Memory } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:userMemories';
const SEEDED_KEY = 'jfy:memoriesSeeded';

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
 * the memory is saved (SPEC.md Section 36). `expo-file-system` is a no-op
 * stub on web (no real filesystem to copy into), so there the picked URI
 * — a blob: URL — is used as-is; it won't survive a page refresh, but
 * that's an inherent browser limitation, not something worth crashing over.
 */
async function persistPickedPhoto(
  pickedUri: string,
  memoryId: string,
  suffix: string | number,
): Promise<string> {
  if (Platform.OS === 'web') {
    return pickedUri;
  }
  const source = new File(pickedUri);
  const extension = source.extension || '.jpg';
  const destination = new File(getMemoriesDirectory(), `${memoryId}-${suffix}${extension}`);
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

/**
 * The starter/demo memories (data/memories.ts) are copied into the same
 * editable store as any real memory, the first time the app runs — after
 * this, there's no separate "static, unmanageable" tier. Everything is
 * editable and deletable from the Memory Vault itself.
 */
async function ensureSeeded(): Promise<void> {
  const alreadySeeded = await getItem<boolean>(SEEDED_KEY);
  if (alreadySeeded) return;

  const stored = (await getItem<Memory[]>(STORAGE_KEY)) ?? [];
  const seeded = STARTER_MEMORIES.map((memory) => ({ ...memory, isUserAdded: true }));
  await setItem(STORAGE_KEY, [...stored, ...seeded]);
  await setItem(SEEDED_KEY, true);
}

export async function getUserMemories(): Promise<Memory[]> {
  await ensureSeeded();
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

  if (Platform.OS !== 'web' && target?.photos) {
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

/**
 * Replaces a memory's photo set: `keepUris` are already-persisted photos to
 * retain (in the desired order), `newPickedUris` are fresh image-picker
 * URIs to persist and append. Any previously-persisted photo not in
 * `keepUris` gets deleted from disk.
 */
export async function updateMemoryPhotos(
  id: string,
  keepUris: string[],
  newPickedUris: string[],
): Promise<void> {
  const existing = await getUserMemories();
  const memory = existing.find((item) => item.id === id);
  if (!memory) return;

  const keptSet = new Set(keepUris);
  if (Platform.OS !== 'web' && memory.photos) {
    for (const photo of memory.photos) {
      if (typeof photo === 'object' && 'uri' in photo && photo.uri && !keptSet.has(photo.uri)) {
        try {
          new File(photo.uri).delete();
        } catch {
          // Already gone — nothing to clean up.
        }
      }
    }
  }

  const newUris = await Promise.all(
    newPickedUris.map((uri, index) => persistPickedPhoto(uri, id, `${Date.now()}-${index}`)),
  );

  const nextPhotos = [...keepUris, ...newUris].map((uri) => ({ uri }));
  const next = existing.map((item) => (item.id === id ? { ...item, photos: nextPhotos } : item));
  await saveUserMemories(next);
}
