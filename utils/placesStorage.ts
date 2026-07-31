import type { Place } from '@/types';
import { getItem, setItem } from '@/utils/storage';

const STORAGE_KEY = 'jfy:places';

export async function getPlaces(): Promise<Place[]> {
  const stored = await getItem<Place[]>(STORAGE_KEY);
  return stored ?? [];
}

export async function addPlace(name: string, note?: string): Promise<Place> {
  const place: Place = {
    id: `place-${Date.now()}`,
    name: name.trim(),
    note: note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  const existing = await getPlaces();
  await setItem(STORAGE_KEY, [place, ...existing]);
  return place;
}

export async function deletePlace(id: string): Promise<void> {
  const existing = await getPlaces();
  await setItem(
    STORAGE_KEY,
    existing.filter((place) => place.id !== id),
  );
}
