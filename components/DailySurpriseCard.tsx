import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AnimatedText } from '@/components/AnimatedText';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useDailySurprise } from '@/hooks/useDailySurprise';

/** "Today's little reminder" teaser on Home (SPEC.md Section 16). */
export function DailySurpriseCard() {
  const message = useDailySurprise();
  const [revealed, setRevealed] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRevealed(true);
  };

  return (
    <Pressable onPress={handlePress} disabled={revealed}>
      <Card variant="glass" style={styles.card}>
        <Text style={styles.label}>Today’s little reminder ❤️</Text>
        {revealed ? (
          <AnimatedText key="daily-message" text={message} mode="fade" style={styles.message} />
        ) : (
          <Text style={styles.hint}>Tap to see it</Text>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: fontSize.xs,
    color: colors.pinkAccent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hint: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  message: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.6,
    color: colors.cream,
  },
});
