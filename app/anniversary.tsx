import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedText } from '@/components/AnimatedText';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { Countdown } from '@/components/Countdown';
import { SafeImage } from '@/components/SafeImage';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useCountdown } from '@/hooks/useCountdown';
import { useMemories } from '@/hooks/useMemories';

/** Countdown to the next anniversary, or the celebration itself (SPEC.md Section 17). */
export default function Anniversary() {
  const countdown = useCountdown();
  const { memories } = useMemories();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!countdown?.isToday || memories.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex((current) => (current + 1) % memories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [countdown?.isToday, memories.length]);

  return (
    <ScreenContainer gradient style={styles.container}>
      <Pressable
        style={styles.back}
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
      </Pressable>

      {!countdown ? (
        <View style={styles.center}>
          <Text style={styles.placeholder}>TODO — set the anniversary date in appConfig</Text>
        </View>
      ) : countdown.isToday ? (
        <View style={styles.center}>
          <ConfettiBurst />
          <AnimatedText key="today" text="Today is our day." mode="fade" style={styles.today} />
          <AnimatedText
            key="today-bn"
            text="প্রতিটা বছর তোমার সাথে আরেকটু বেশি ভালোবাসা।"
            mode="fade"
            delay={500}
            style={styles.todayBangla}
          />
          {memories[slideIndex] ? (
            <SafeImage
              source={memories[slideIndex].photos?.[0]}
              style={styles.slidePhoto}
              placeholderLabel="TODO — add photos to remember this by"
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.heading}>Until our next special day...</Text>
          <Countdown countdown={countdown} />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    zIndex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  placeholder: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  heading: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xl,
    color: colors.cream,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  today: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize.display,
    color: colors.gold,
    textAlign: 'center',
  },
  todayBangla: {
    fontFamily: fontFamily.banglaSerifMedium,
    fontSize: fontSize.lg,
    color: colors.pinkAccent,
    textAlign: 'center',
  },
  slidePhoto: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginTop: spacing.lg,
  },
});
