import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { AmbientGlow } from '@/components/AmbientGlow';
import { AnimatedText } from '@/components/AnimatedText';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { SECRET_LETTER } from '@/data/secret';

type Beat = { id: string; text: string; style: object; hold: number };

const BEATS: Beat[] = [
  {
    id: 'opening',
    text: SECRET_LETTER.opening,
    style: { fontFamily: fontFamily.banglaSerifMedium, fontSize: fontSize.lg, color: colors.cream },
    hold: 2200,
  },
  {
    id: 'body',
    text: SECRET_LETTER.body,
    style: { fontFamily: fontFamily.banglaRegular, fontSize: fontSize.md, color: colors.textSecondary },
    hold: 2600,
  },
  {
    id: 'closing-bn',
    text: SECRET_LETTER.closingBangla,
    style: { fontFamily: fontFamily.banglaSerifMedium, fontSize: fontSize.lg, color: colors.pinkAccent },
    hold: 2600,
  },
  {
    id: 'closing-en',
    text: SECRET_LETTER.closingEnglish,
    style: { fontFamily: fontFamily.serifSemiBold, fontSize: fontSize.xl, color: colors.cream },
    hold: 2000,
  },
];

/** Post-unlock reveal of the Secret Letter (SPEC.md Section 15). */
export function SecretReveal() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulse = useSharedValue(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const advance = useCallback(() => {
    clearTimer();
    setIndex((current) => {
      const next = current + 1;
      if (next >= BEATS.length) {
        setDone(true);
        return current;
      }
      return next;
    });
  }, []);

  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    if (done) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true);
    }
  }, [done, pulse]);

  const beat = BEATS[index];

  const handleRevealComplete = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(advance, beat?.hold ?? 1800);
  }, [advance, beat]);

  const finalStyle = useAnimatedStyle(() => ({
    opacity: 0.85 + pulse.value * 0.15,
    transform: [{ scale: 1 + pulse.value * 0.04 }],
  }));

  return (
    <Pressable style={styles.container} onPress={done ? undefined : advance}>
      <AmbientGlow color="rgba(231, 169, 180, 0.18)" />
      <View style={styles.center}>
        {!done && beat ? (
          <AnimatedText
            key={beat.id}
            text={beat.text}
            mode="fade"
            onRevealComplete={handleRevealComplete}
            style={[styles.text, beat.style]}
          />
        ) : null}
        {done ? (
          <Animated.Text style={[styles.text, styles.final, finalStyle]}>
            {SECRET_LETTER.final}
          </Animated.Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  text: {
    textAlign: 'center',
  },
  final: {
    fontFamily: fontFamily.script,
    fontSize: fontSize.display,
    color: colors.gold,
  },
});
