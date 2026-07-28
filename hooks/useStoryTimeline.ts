import { useCallback, useEffect, useState } from 'react';

import type { TimelineEvent } from '@/types';
import { parseConfigDate } from '@/utils/dateUtils';
import {
  addStoryEvent,
  deleteStoryEvent,
  getUserStoryEvents,
  type NewStoryEventInput,
  updateStoryEvent,
  updateStoryEventPhoto,
} from '@/utils/storyStorage';

function sortByDate(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => {
    const dateA = parseConfigDate(a.date)?.getTime() ?? Number.POSITIVE_INFINITY;
    const dateB = parseConfigDate(b.date)?.getTime() ?? Number.POSITIVE_INFINITY;
    return dateA - dateB;
  });
}

/** Every timeline event (starter + on-device additions), chronological, with a live "Today" entry appended. */
export function useStoryTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await getUserStoryEvents();
    setEvents(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getUserStoryEvents();
      if (!cancelled) {
        setEvents(stored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addEvent = useCallback(
    async (input: NewStoryEventInput) => {
      const event = await addStoryEvent(input);
      await refresh();
      return event;
    },
    [refresh],
  );

  const editEvent = useCallback(
    async (id: string, patch: Parameters<typeof updateStoryEvent>[1]) => {
      await updateStoryEvent(id, patch);
      await refresh();
    },
    [refresh],
  );

  const editEventPhoto = useCallback(
    async (id: string, pickedUri: string | null) => {
      await updateStoryEventPhoto(id, pickedUri);
      await refresh();
    },
    [refresh],
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      await deleteStoryEvent(id);
      await refresh();
    },
    [refresh],
  );

  const today: TimelineEvent = {
    id: 'story-today',
    title: 'Today',
    date: new Date().toISOString().slice(0, 10),
    description: 'আর গল্পটা এখনো চলছে...',
    hidePhotoSlot: true,
  };

  return {
    events: [...sortByDate(events), today],
    loading,
    refresh,
    addEvent,
    editEvent,
    editEventPhoto,
    deleteEvent,
  };
}
