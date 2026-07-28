import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SafeImage } from '@/components/SafeImage';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Memory } from '@/types';
import { formatShortDate } from '@/utils/dateUtils';

type Props = {
  memory: Memory;
  onPress: () => void;
  /** Alternates card tilt for an organic, hand-placed polaroid feel. */
  tilt?: 'left' | 'right';
};

export function MemoryCard({ memory, onPress, tilt = 'left' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open memory: ${memory.title}`}
      style={({ pressed }) => [
        styles.frame,
        tilt === 'left' ? styles.tiltLeft : styles.tiltRight,
        pressed && styles.pressed,
      ]}
    >
      <SafeImage
        source={memory.photos?.[0]}
        style={styles.photo}
        placeholderLabel={memory.photos?.length ? undefined : 'Add a photo'}
      />
      <View style={styles.caption}>
        <Text style={styles.title} numberOfLines={1}>
          {memory.title}
        </Text>
        <Text style={styles.date} numberOfLines={1}>
          {formatShortDate(memory.date)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.cream,
    padding: spacing.xs,
    paddingBottom: spacing.sm,
    borderRadius: radius.sm,
    ...shadows.card,
  },
  tiltLeft: {
    transform: [{ rotate: '-3deg' }],
  },
  tiltRight: {
    transform: [{ rotate: '2deg' }],
  },
  pressed: {
    opacity: 0.85,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 2,
  },
  caption: {
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    gap: 2,
  },
  title: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.sm,
    color: colors.background,
  },
  date: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.xs,
    color: 'rgba(11, 10, 13, 0.55)',
  },
});
