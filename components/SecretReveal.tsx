import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { AmbientGlow } from '@/components/AmbientGlow';
import { AnimatedText } from '@/components/AnimatedText';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useSecretLetter } from '@/hooks/useSecretLetter';

type Beat = { id: string; text: string; style: object; hold: number };

type Props = {
  onEdit: () => void;
};

/** Post-unlock reveal of the Secret Letter (SPEC.md Section 15). */
export function SecretReveal({ onEdit }: Props) {
  const { content } = useSecretLetter();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulse = useSharedValue(0);

  const beats = useMemo<Beat[]>(
    () => [
      {
        id: 'opening',
        text: content.opening,
        style: { fontFamily: fontFamily.banglaSerifMedium, fontSize: fontSize.lg, color: colors.cream },
        hold: 2200,
      },
      {
        id: 'body',
        text: content.body,
        style: { fontFamily: fontFamily.banglaRegular, fontSize: fontSize.md, color: colors.textSecondary },
        hold: 2600,
      },
      {
        id: 'closing-bn',
        text: content.closingBangla,
        style: { fontFamily: fontFamily.banglaSerifMedium, fontSize: fontSize.lg, color: colors.pinkAccent },
        hold: 2600,
      },
      {
        id: 'closing-en',
        text: content.closingEnglish,
        style: { fontFamily: fontFamily.serifSemiBold, fontSize: fontSize.xl, color: colors.cream },
        hold: 2000,
      },
    ],
    [content],
  );

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
      if (next >= beats.length) {
        setDone(true);
        return current;
      }
      return next;
    });
  }, [beats.length]);

  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    if (done) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true);
    }
  }, [done, pulse]);

  const beat = beats[index];

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
          <View style={styles.doneBlock}>
            <Animated.Text style={[styles.text, styles.final, finalStyle]}>{content.final}</Animated.Text>
            <Pressable onPress={onEdit} hitSlop={12}>
              <Text style={styles.editLink}>Edit this letter</Text>
            </Pressable>
          </View>
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
  doneBlock: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  editLink: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
