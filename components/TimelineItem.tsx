import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Card } from '@/components/Card';
import { SafeImage } from '@/components/SafeImage';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { TimelineEvent } from '@/types';
import { formatShortDate } from '@/utils/dateUtils';

type Props = {
  event: TimelineEvent;
  revealed: boolean;
  isFirst: boolean;
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TimelineItem({
  event,
  revealed,
  isFirst,
  isLast,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

  const canManage = event.isUserAdded && (onEdit || onDelete);

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
            <View style={styles.headerRow}>
              <Text style={styles.date}>{formatShortDate(event.date)}</Text>
              {canManage ? (
                <View style={styles.actions}>
                  {onEdit ? (
                    <Pressable
                      onPress={onEdit}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Edit this moment"
                    >
                      <Ionicons name="pencil-outline" size={16} color={colors.textMuted} />
                    </Pressable>
                  ) : null}
                  {onDelete ? (
                    <Pressable
                      onPress={onDelete}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Delete this moment"
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </View>
            <Text style={styles.title}>{event.title}</Text>
            {event.hidePhotoSlot ? null : (
              <SafeImage
                source={event.photo}
                style={styles.photo}
                placeholderLabel="Add a photo for this moment"
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actions: {
      flexDirection: 'row',
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
