import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Letter } from '@/types';

type Props = {
  letter: Letter;
};

/** Tap flips the card to reveal an envelope; tapping the envelope opens the letter (SPEC.md Section 14). */
export function LetterCard({ letter }: Props) {
  const [flipped, setFlipped] = useState(false);
  const flip = useSharedValue(0);

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    flip.value = withTiming(1, { duration: 450 });
    setFlipped(true);
  };

  const handleOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push({ pathname: '/letters/[id]', params: { id: letter.id } });
  };

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
    <Pressable onPress={flipped ? handleOpen : handleFlip} style={styles.wrapper}>
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

const styles = StyleSheet.create({
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
