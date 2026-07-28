import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { AmbientGlow } from '@/components/AmbientGlow';
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
  const { memories } = useMemories();
  const memory = memories[0] ?? null;
  const dateTapCount = useRef(0);
  const dateTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenMemory = () => {
    if (!memory) return;
    Haptics.selectionAsync().catch(() => {});
    router.push({ pathname: '/memories/[id]', params: { id: memory.id } });
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
          <Pressable onPress={handleOpenMemory}>
            <Card style={styles.memoryCard}>
              <Text style={styles.memoryLabel}>Today’s Memory</Text>
              <SafeImage
                style={styles.memoryPhoto}
                source={memory.photos?.[0]}
                placeholderLabel="Tap to add this memory's photo"
              />
              <View style={styles.memoryPromptRow}>
                <Text style={styles.memoryPrompt}>Do you remember this day?</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.gold} />
              </View>
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
});
