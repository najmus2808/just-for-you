import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Memory } from '@/types';
import {
  addUserMemory,
  deleteUserMemory,
  getUserMemories,
  type NewMemoryInput,
  updateMemoryPhotos,
  updateUserMemory,
} from '@/utils/memoryStorage';

/**
 * All memories — the starter/demo set gets seeded into the same store on
 * first run (utils/memoryStorage.ts), so everything here is equally
 * editable/deletable. Newest first, so a freshly added memory — and Home's
 * featured card — always reflects the latest one.
 */
export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await getUserMemories();
    setMemories(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getUserMemories();
      if (!cancelled) {
        setMemories(stored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Screens like Home and the Memory Vault list stay mounted while an edit
  // screen is pushed on top — without this, coming back after Save would
  // still show the pre-edit state until the app fully restarted.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const addMemory = useCallback(
    async (input: NewMemoryInput) => {
      const memory = await addUserMemory(input);
      await refresh();
      return memory;
    },
    [refresh],
  );

  const deleteMemory = useCallback(
    async (id: string) => {
      await deleteUserMemory(id);
      await refresh();
    },
    [refresh],
  );

  const editMemory = useCallback(
    async (id: string, patch: Parameters<typeof updateUserMemory>[1]) => {
      await updateUserMemory(id, patch);
      await refresh();
    },
    [refresh],
  );

  const editMemoryPhotos = useCallback(
    async (id: string, keepUris: string[], newPickedUris: string[]) => {
      await updateMemoryPhotos(id, keepUris, newPickedUris);
      await refresh();
    },
    [refresh],
  );

  return { memories, loading, refresh, addMemory, deleteMemory, editMemory, editMemoryPhotos };
}
