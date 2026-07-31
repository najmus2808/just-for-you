import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

type Props = {
  source?: ImageSource | number;
  style?: ViewStyle;
  /** Shown in the placeholder when there's no source yet, or it fails to load. */
  placeholderLabel?: string;
  contentFit?: 'cover' | 'contain';
};

/**
 * A photo that can't crash the app just because the real asset isn't there
 * yet. Most of this project's photo slots are still TODO placeholders
 * (SPEC.md Section 28 / Personal Content Strategy) — this renders a tasteful
 * stand-in instead of a broken image icon or a red-box error.
 */
export function SafeImage({ source, style, placeholderLabel, contentFit = 'cover' }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <LinearGradient
        colors={[colors.surface, colors.midnight]}
        style={[styles.placeholder, style]}
      >
        <Text style={styles.glyph}>❤</Text>
        {placeholderLabel ? <Text style={styles.label}>{placeholderLabel}</Text> : null}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.imageWrapper, style]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        transition={400}
        onError={() => setFailed(true)}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    imageWrapper: {
      overflow: 'hidden',
    },
    placeholder: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      gap: spacing.xs,
      overflow: 'hidden',
    },
    glyph: {
      fontSize: 28,
      color: colors.pinkAccent,
      opacity: 0.6,
    },
    label: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
    },
  });
