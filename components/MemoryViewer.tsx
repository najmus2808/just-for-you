import { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

import { AnimatedText } from '@/components/AnimatedText';
import { SafeImage } from '@/components/SafeImage';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Memory, PhotoSource } from '@/types';

type Props = {
  memory: Memory;
};

const { width } = Dimensions.get('window');
const PHOTO_SIZE = width - spacing.lg * 2;

/** Full-screen cinematic memory reveal (SPEC.md Section 13). */
export function MemoryViewer({ memory }: Props) {
  const [stage, setStage] = useState(0);
  const photos: (PhotoSource | undefined)[] = memory.photos?.length ? memory.photos : [undefined];
  const hasDate = !memory.date.startsWith('TODO_');

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(_, index) => `${memory.id}-photo-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <SafeImage
            source={item}
            style={styles.photo}
            placeholderLabel={memory.isUserAdded ? undefined : 'TODO — add a photo'}
          />
        )}
      />

      <View style={styles.details}>
        <Text style={styles.title}>{memory.title}</Text>
        <Text style={styles.meta}>
          {hasDate ? memory.date : 'Date coming soon'}
          {memory.location ? ` · ${memory.location}` : ''}
        </Text>

        <View style={styles.captionBlock}>
          <AnimatedText
            key="frame-1"
            text="I don't remember everything about that day."
            mode="fade"
            onRevealComplete={() => setStage((s) => Math.max(s, 1))}
            style={styles.framingLine}
          />
          {stage >= 1 ? (
            <AnimatedText
              key="frame-2"
              text="But I remember how happy I was because you were there."
              mode="fade"
              delay={200}
              onRevealComplete={() => setStage((s) => Math.max(s, 2))}
              style={styles.framingLine}
            />
          ) : null}
          {stage >= 2 ? (
            <AnimatedText
              key="caption"
              text={memory.caption}
              mode="fade"
              delay={300}
              style={styles.caption}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  details: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xl,
    color: colors.gold,
  },
  meta: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  captionBlock: {
    gap: spacing.sm,
  },
  framingLine: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  caption: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.6,
    color: colors.cream,
    marginTop: spacing.xs,
  },
});
