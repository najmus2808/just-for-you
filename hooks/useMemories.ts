import { useCallback, useEffect, useState } from 'react';

import { STARTER_MEMORIES } from '@/data/memories';
import type { Memory } from '@/types';
import {
  addUserMemory,
  deleteUserMemory,
  getUserMemories,
  type NewMemoryInput,
  updateUserMemory,
} from '@/utils/memoryStorage';

/**
 * Combines the starter/demo memories with whatever the user has added
 * on-device. User memories come first (newest first) so a freshly added
 * memory — and Home's featured card — always reflects the latest one.
 */
export function useMemories() {
  const [userMemories, setUserMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await getUserMemories();
    setUserMemories(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getUserMemories();
      if (!cancelled) {
        setUserMemories(stored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const memories = [...userMemories, ...STARTER_MEMORIES];

  return { memories, loading, refresh, addMemory, deleteMemory, editMemory };
}
