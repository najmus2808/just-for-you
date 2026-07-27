import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Card } from '@/components/Card';
import { SafeImage } from '@/components/SafeImage';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { TimelineEvent } from '@/types';

type Props = {
  event: TimelineEvent;
  revealed: boolean;
  isFirst: boolean;
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
};

export function TimelineItem({ event, revealed, isFirst, isLast, expanded, onToggle }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (revealed) {
      progress.value = withTiming(1, { duration: 500 });
      if (event.isMilestone) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }
  }, [revealed, event.isMilestone, progress]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 16 }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.4 + progress.value * 0.6 }],
  }));

  const hasDate = !event.date.startsWith('TODO_');

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        {!isFirst && <Animated.View style={[styles.line, lineStyle]} />}
        <Animated.View style={[styles.dot, event.isMilestone && styles.dotMilestone, dotStyle]} />
        {!isLast && <Animated.View style={[styles.line, lineStyle]} />}
      </View>

      <Animated.View style={[styles.cardWrapper, cardStyle]}>
        <Pressable onPress={onToggle} disabled={!event.secretNote}>
          <Card style={styles.card}>
            <Text style={styles.date}>{hasDate ? event.date : 'Date coming soon'}</Text>
            <Text style={styles.title}>{event.title}</Text>
            {event.hidePhotoSlot ? null : (
              <SafeImage
                source={event.photo}
                style={styles.photo}
                placeholderLabel="TODO — add a photo for this moment"
              />
            )}
            <Text style={styles.description}>{event.description}</Text>
            {expanded && event.secretNote ? (
              <Text style={styles.secretNote}>{event.secretNote}</Text>
            ) : null}
          </Card>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const RAIL_WIDTH = 28;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rail: {
    width: RAIL_WIDTH,
    alignItems: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gold,
  },
  dotMilestone: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.pinkAccent,
  },
  cardWrapper: {
    flex: 1,
    paddingBottom: spacing.lg,
    paddingLeft: spacing.sm,
  },
  card: {
    gap: spacing.sm,
  },
  date: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.lg,
    color: colors.gold,
  },
  photo: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
  },
  description: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.6,
    color: colors.textSecondary,
  },
  secretNote: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.6,
    color: colors.pinkAccent,
    fontStyle: 'italic',
  },
});
