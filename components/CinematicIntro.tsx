import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AmbientGlow } from '@/components/AmbientGlow';
import { AnimatedText } from '@/components/AnimatedText';
import { FloatingParticles } from '@/components/FloatingParticles';
import { SafeImage } from '@/components/SafeImage';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { APP_CONFIG } from '@/data/appConfig';

type TextBeat = {
  kind: 'text';
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  mode?: 'fade' | 'sequence';
  hold: number;
  hapticOnEnter?: boolean;
};

type PhotoBeat = {
  kind: 'photo';
  id: string;
  caption: string;
  hold: number;
  hapticOnEnter?: boolean;
};

type Beat = TextBeat | PhotoBeat;

type Props = {
  onComplete: () => void;
};

/**
 * The full first-launch sequence from SPEC.md Section 9 (Scenes 1-3) with
 * the Bangla/English mix from Section 35.2. Fully automatic — each beat
 * fades in, holds, fades out, then the next one mounts — but tapping
 * anywhere skips straight to the next beat for anyone who doesn't want to
 * wait out the pacing.
 */
export function CinematicIntro({ onComplete }: Props) {
  const beats = useMemo<Beat[]>(
    () => [
      {
        kind: 'text',
        id: 's1-1',
        text: 'I made something for you...',
        fontFamily: fontFamily.sansRegular,
        fontSize: fontSize.lg,
        color: colors.textSecondary,
        hold: 1600,
      },
      {
        kind: 'text',
        id: 's1-2',
        text: "Something I couldn't buy...",
        fontFamily: fontFamily.sansRegular,
        fontSize: fontSize.lg,
        color: colors.textSecondary,
        hold: 1600,
      },
      {
        kind: 'text',
        id: 's1-3',
        text: 'Something I had to create...',
        fontFamily: fontFamily.sansRegular,
        fontSize: fontSize.lg,
        color: colors.textSecondary,
        hold: 1600,
      },
      {
        kind: 'text',
        id: 's1-4',
        text: 'শুধু তোমার জন্য। ❤️',
        fontFamily: fontFamily.banglaSerifMedium,
        fontSize: fontSize.xl,
        color: colors.pinkAccent,
        hold: 2000,
        hapticOnEnter: true,
      },
      {
        kind: 'text',
        id: 's2-1',
        text: `${APP_CONFIG.wifeName}...`,
        fontFamily: fontFamily.script,
        fontSize: fontSize.display,
        color: colors.gold,
        hold: 1900,
      },
      {
        kind: 'text',
        id: 's2-2',
        text: 'Welcome to a little world...',
        fontFamily: fontFamily.serifSemiBold,
        fontSize: fontSize.xl,
        color: colors.cream,
        hold: 1700,
      },
      {
        kind: 'text',
        id: 's2-3',
        text: '...that belongs only to us.',
        fontFamily: fontFamily.serifSemiBold,
        fontSize: fontSize.xl,
        color: colors.cream,
        hold: 2100,
        hapticOnEnter: true,
      },
      {
        kind: 'photo',
        id: 's3-photo',
        caption: 'Our story.',
        hold: 2600,
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        onComplete();
        return current;
      }
      return next;
    });
  }, [beats.length, onComplete]);

  const beat = beats[index];

  useEffect(() => {
    if (beat?.hapticOnEnter) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [beat]);

  useEffect(() => () => clearTimer(), []);

  const handleRevealComplete = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(advance, beat?.hold ?? 1500);
  }, [advance, beat]);

  if (!beat) {
    return null;
  }

  return (
    <Pressable style={styles.container} onPress={advance}>
      <AmbientGlow />
      <FloatingParticles count={8} />

      <View style={styles.center}>
        {beat.kind === 'text' ? (
          <AnimatedText
            key={beat.id}
            text={beat.text}
            mode={beat.mode ?? 'fade'}
            onRevealComplete={handleRevealComplete}
            style={{
              fontFamily: beat.fontFamily,
              fontSize: beat.fontSize,
              color: beat.color,
              textAlign: 'center',
            }}
          />
        ) : (
          <View key={beat.id} style={styles.photoScene}>
            <SafeImage style={styles.photo} />
            <AnimatedText
              text={beat.caption}
              mode="fade"
              delay={500}
              onRevealComplete={handleRevealComplete}
              style={styles.caption}
            />
          </View>
        )}
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
  photoScene: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  photo: {
    width: 240,
    height: 300,
    borderRadius: 16,
  },
  caption: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xl,
    color: colors.cream,
    textAlign: 'center',
  },
});
