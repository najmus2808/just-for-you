import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, type ViewToken } from 'react-native';

import { TimelineItem } from '@/components/TimelineItem';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { TimelineEvent } from '@/types';

type Props = {
  events: TimelineEvent[];
  onEditEvent?: (id: string) => void;
  onDeleteEvent?: (id: string) => void;
};

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 30 };

/** Scroll-revealed relationship timeline (SPEC.md Section 12). */
export function Timeline({ events, onEditEvent, onDeleteEvent }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setRevealedIds((current) => {
        let changed = false;
        const next = new Set(current);
        for (const viewToken of viewableItems) {
          const id = (viewToken.item as TimelineEvent | undefined)?.id;
          if (id && !next.has(id)) {
            next.add(id);
            changed = true;
          }
        }
        return changed ? next : current;
      });
    },
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: TimelineEvent; index: number }) => (
      <TimelineItem
        event={item}
        revealed={revealedIds.has(item.id)}
        isFirst={index === 0}
        isLast={index === events.length - 1}
        expanded={expandedId === item.id}
        onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
        onEdit={onEditEvent ? () => onEditEvent(item.id) : undefined}
        onDelete={onDeleteEvent ? () => onDeleteEvent(item.id) : undefined}
      />
    ),
    [revealedIds, expandedId, events.length, onEditEvent, onDeleteEvent],
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={VIEWABILITY_CONFIG}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Our Story</Text>
          <Text style={styles.subtitle}>
            Traveling back through everything that brought us here.
          </Text>
        </>
      }
    />
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxxl * 2,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.xxl,
      color: colors.gold,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
    },
  });
