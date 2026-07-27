import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { AmbientGlow } from '@/components/AmbientGlow';
import { AnimatedText } from '@/components/AnimatedText';
import { Card } from '@/components/Card';
import { DailySurpriseCard } from '@/components/DailySurpriseCard';
import { SafeImage } from '@/components/SafeImage';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { APP_CONFIG } from '@/data/appConfig';
import { useMemories } from '@/hooks/useMemories';
import { formatDisplayDate, getGreeting } from '@/utils/dateUtils';

/** The entrance to a private world, not a dashboard (SPEC.md Section 10). */
export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const { memories } = useMemories();
  const memory = memories[0] ?? null;
  const dateTapCount = useRef(0);
  const dateTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(expanded ? '180deg' : '0deg', { duration: 250 }) }],
  }));

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpanded((current) => !current);
  };

  // A quiet nod to "tap the date multiple times" (SPEC.md Section 21) — five
  // taps within 1.5s slips through to the Secret Letter with no visible hint.
  const handleDateTap = () => {
    dateTapCount.current += 1;
    if (dateTapTimer.current) clearTimeout(dateTapTimer.current);
    dateTapTimer.current = setTimeout(() => {
      dateTapCount.current = 0;
    }, 1500);

    if (dateTapCount.current >= 5) {
      dateTapCount.current = 0;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.push('/secret');
    }
  };

  return (
    <ScreenContainer gradient>
      <AmbientGlow size={360} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleDateTap}>
          <Text style={styles.date}>{formatDisplayDate()}</Text>
        </Pressable>
        <Text style={styles.greeting}>
          {getGreeting()}, {APP_CONFIG.wifeName} ❤️
        </Text>
        <Text style={styles.subline}>There are still so many things I want to tell you.</Text>

        <DailySurpriseCard />

        {memory ? (
          <Pressable onPress={handleToggle}>
            <Card style={styles.memoryCard}>
              <Text style={styles.memoryLabel}>Today’s Memory</Text>
              <SafeImage
                style={styles.memoryPhoto}
                source={memory.photos?.[0]}
                placeholderLabel="TODO — add this memory's photo"
              />
              <View style={styles.memoryPromptRow}>
                <Text style={styles.memoryPrompt}>Do you remember this day?</Text>
                <Animated.View style={chevronStyle}>
                  <Ionicons name="chevron-down" size={18} color={colors.gold} />
                </Animated.View>
              </View>
              {expanded ? (
                <AnimatedText
                  key={`${memory.id}-caption`}
                  text={memory.caption}
                  mode="fade"
                  style={styles.memoryCaption}
                />
              ) : null}
            </Card>
          </Pressable>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.sm,
  },
  date: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greeting: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xxl,
    color: colors.gold,
    marginTop: spacing.xs,
  },
  subline: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  memoryCard: {
    gap: spacing.md,
  },
  memoryLabel: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: fontSize.xs,
    color: colors.pinkAccent,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  memoryPhoto: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  memoryPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memoryPrompt: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.md,
    color: colors.cream,
  },
  memoryCaption: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.6,
    color: colors.textSecondary,
  },
});
