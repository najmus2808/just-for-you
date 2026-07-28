import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { AmbientGlow } from '@/components/AmbientGlow';
import { AnimatedText } from '@/components/AnimatedText';
import { FloatingParticles } from '@/components/FloatingParticles';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useFinalMessage } from '@/hooks/useFinalMessage';

type Beat = {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  hold: number;
};

const isBangla = (text: string) => /[ঀ-৿]/.test(text);

function buildBeats(lines: string[]): Beat[] {
  return lines.map((text, index) => {
    const isLast = index === lines.length - 1;
    const isPenultimate = index === lines.length - 2;
    const bangla = isBangla(text);

    if (isLast || isPenultimate) {
      return {
        text,
        fontFamily: bangla ? fontFamily.banglaSerifSemiBold : fontFamily.script,
        fontSize: bangla ? fontSize.xxl : fontSize.display,
        color: colors.gold,
        hold: 2600,
      };
    }

    return {
      text,
      fontFamily: bangla ? fontFamily.banglaSerifMedium : fontFamily.sansRegular,
      fontSize: fontSize.lg,
      color: colors.cream,
      hold: 2000,
    };
  });
}

type Props = {
  onReplay: () => void;
  onEdit: () => void;
};

/** The emotional climax of the app (SPEC.md Section 22). */
export function FinalSurprise({ onReplay, onEdit }: Props) {
  const { beats: lines } = useFinalMessage();
  const beats = useMemo(() => buildBeats(lines), [lines]);
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
      pulse.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
    }
  }, [done, pulse]);

  const beat = beats[index];

  const handleRevealComplete = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(advance, beat?.hold ?? 2000);
  }, [advance, beat]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.85 + pulse.value * 0.15,
    transform: [{ scale: 1 + pulse.value * 0.03 }],
  }));

  return (
    <Pressable style={styles.container} onPress={done ? undefined : advance}>
      <AmbientGlow color="rgba(216, 178, 106, 0.2)" />
      <FloatingParticles count={12} />

      <View style={styles.center}>
        {!done && beat ? (
          <AnimatedText
            key={index}
            text={beat.text}
            mode="fade"
            onRevealComplete={handleRevealComplete}
            style={{
              fontFamily: beat.fontFamily,
              fontSize: beat.fontSize,
              color: beat.color,
              textAlign: 'center',
            }}
          />
        ) : null}

        {done && beats.length > 0 ? (
          <View style={styles.doneBlock}>
            <Animated.Text style={[styles.doneText, glowStyle]}>
              {beats[beats.length - 1].text}
            </Animated.Text>
            <View style={styles.linkRow}>
              <Pressable onPress={onReplay} hitSlop={12}>
                <Text style={styles.linkText}>Replay</Text>
              </Pressable>
              <Pressable onPress={onEdit} hitSlop={12}>
                <Text style={styles.linkText}>Edit</Text>
              </Pressable>
            </View>
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
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  doneBlock: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  doneText: {
    fontFamily: fontFamily.banglaSerifSemiBold,
    fontSize: fontSize.xxl,
    color: colors.gold,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  linkText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
