import { useMemo, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedText } from '@/components/AnimatedText';
import { SafeImage } from '@/components/SafeImage';
import { ZoomableImageModal } from '@/components/ZoomableImageModal';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Memory, PhotoSource } from '@/types';
import { formatShortDate } from '@/utils/dateUtils';

type Props = {
  memory: Memory;
};

const { width } = Dimensions.get('window');
const PHOTO_SIZE = width - spacing.lg * 2;

/** Full-screen cinematic memory reveal (SPEC.md Section 13). */
export function MemoryViewer({ memory }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [zoomSource, setZoomSource] = useState<PhotoSource | undefined>(undefined);
  const photos: (PhotoSource | undefined)[] = memory.photos?.length ? memory.photos : [undefined];

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(_, index) => `${memory.id}-photo-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => item && setZoomSource(item)}
            disabled={!item}
            accessibilityRole={item ? 'button' : undefined}
            accessibilityLabel={item ? 'View full photo' : undefined}
          >
            <SafeImage
              source={item}
              style={styles.photo}
              placeholderLabel={item ? undefined : 'No photo yet — tap ✏️ to add one'}
            />
          </Pressable>
        )}
      />

      <View style={styles.details}>
        <Text style={styles.title}>{memory.title}</Text>
        <Text style={styles.meta}>
          {formatShortDate(memory.date)}
          {memory.location ? ` · ${memory.location}` : ''}
        </Text>

        <View style={styles.captionBlock}>
          <AnimatedText key="caption" text={memory.caption} mode="fade" style={styles.caption} />
        </View>
      </View>

      <ZoomableImageModal
        visible={Boolean(zoomSource)}
        source={zoomSource}
        onClose={() => setZoomSource(undefined)}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    caption: {
      fontFamily: fontFamily.banglaRegular,
      fontSize: fontSize.md,
      lineHeight: fontSize.md * 1.6,
      color: colors.cream,
      marginTop: spacing.xs,
    },
  });
