import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Place } from '@/types';
import {
  addPlace as addPlaceToStorage,
  deletePlace as deletePlaceFromStorage,
  getPlaces,
} from '@/utils/placesStorage';

/** Places visited together — a simple, editable add/delete list (no starter set). */
export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await getPlaces();
    setPlaces(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getPlaces();
      if (!cancelled) {
        setPlaces(stored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const addPlace = useCallback(
    async (name: string, note?: string) => {
      await addPlaceToStorage(name, note);
      await refresh();
    },
    [refresh],
  );

  const deletePlace = useCallback(
    async (id: string) => {
      await deletePlaceFromStorage(id);
      await refresh();
    },
    [refresh],
  );

  return { places, loading, addPlace, deletePlace };
}
