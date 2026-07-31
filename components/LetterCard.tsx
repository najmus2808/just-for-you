import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Letter } from '@/types';

type Props = {
  letter: Letter;
};

const FLIP_DURATION = 450;

/** One tap flips the card, then opens the letter once the flip finishes playing — no second tap needed (SPEC.md Section 14). */
export function LetterCard({ letter }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const flip = useSharedValue(0);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = () => {
    if (openTimerRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    flip.value = withTiming(1, { duration: FLIP_DURATION });
    openTimerRef.current = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      router.push({ pathname: '/letters/[id]', params: { id: letter.id } });
    }, FLIP_DURATION);
  };

  // The letters screen stays mounted underneath the detail screen, so the
  // flip survives the round trip. Reset it whenever this card regains focus
  // so it shows the title face again instead of the envelope, ready for next time.
  useFocusEffect(
    useCallback(() => {
      return () => {
        flip.value = 0;
        if (openTimerRef.current) {
          clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
        }
      };
    }, [flip]),
  );

  useEffect(
    () => () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    },
    [],
  );

  const frontStyle = useAnimatedStyle(() => ({
    opacity: flip.value < 0.5 ? 1 : 0,
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const backStyle = useAnimatedStyle(() => ({
    opacity: flip.value >= 0.5 ? 1 : 0,
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
  }));

  return (
    <Pressable
      onPress={handlePress}
      style={styles.wrapper}
      accessibilityRole="button"
      accessibilityLabel={`Open letter: ${letter.title}`}
    >
      <Animated.View style={[styles.face, frontStyle]}>
        <Ionicons name="heart-outline" size={22} color={colors.pinkAccent} />
        <Text style={styles.title}>{letter.title}</Text>
      </Animated.View>
      <Animated.View style={[styles.face, styles.backFace, backStyle]}>
        <Ionicons name="mail" size={30} color={colors.gold} />
        <Text style={styles.openHint}>Tap to open</Text>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      height: 120,
    },
    face: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
      gap: spacing.xs,
      ...shadows.soft,
    },
    backFace: {
      backgroundColor: colors.midnight,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.sm,
      color: colors.cream,
      textAlign: 'center',
    },
    openHint: {
      fontFamily: fontFamily.sansMedium,
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
  });
