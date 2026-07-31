import { useEffect, useMemo, useState } from 'react';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnimatedText } from '@/components/AnimatedText';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { Countdown } from '@/components/Countdown';
import { MarriedForCounter } from '@/components/MarriedForCounter';
import { SafeImage } from '@/components/SafeImage';
import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { APP_CONFIG } from '@/data/appConfig';
import { useCountdown } from '@/hooks/useCountdown';
import { useElapsedTime } from '@/hooks/useElapsedTime';
import { useMemories } from '@/hooks/useMemories';
import { formatShortDate } from '@/utils/dateUtils';
import { goBack } from '@/utils/navigation';

/** Live "married for" duration, countdown to the next anniversary, or the celebration itself (SPEC.md Section 17). */
export default function Anniversary() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const countdown = useCountdown();
  const elapsed = useElapsedTime();
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
        onPress={() => goBack()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
      </Pressable>

      {!countdown || !elapsed ? (
        <View style={styles.center}>
          <Text style={styles.placeholder}>Our anniversary date hasn&apos;t been set yet.</Text>
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
          <Text style={styles.dateLabel}>{formatShortDate(APP_CONFIG.anniversaryDate)}</Text>
          {memories[slideIndex] ? (
            <SafeImage
              source={memories[slideIndex].photos?.[0]}
              style={styles.slidePhoto}
              placeholderLabel="Add photos in Memories to see them here"
            />
          ) : null}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>We&apos;ve been married for...</Text>
          <MarriedForCounter elapsed={elapsed} />
          <Text style={styles.dateLabel}>Since {formatShortDate(APP_CONFIG.anniversaryDate)}</Text>

          <Text style={styles.secondaryHeading}>Until our next special day...</Text>
          <Countdown countdown={countdown} />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    scroll: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl,
      gap: spacing.md,
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
      color: colors.gold,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    dateLabel: {
      fontFamily: fontFamily.sansMedium,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      textAlign: 'center',
    },
    secondaryHeading: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
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
