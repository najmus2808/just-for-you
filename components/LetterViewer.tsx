import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AnimatedText } from '@/components/AnimatedText';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Letter } from '@/types';

type Props = {
  letter: Letter;
};

/** Envelope-opening, line-by-line letter reveal (SPEC.md Section 14). */
export function LetterViewer({ letter }: Props) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setOpened(true);
  };

  if (!opened) {
    return (
      <Pressable style={styles.envelopeScreen} onPress={handleOpen}>
        <Animated.View exiting={FadeOut.duration(300)} style={styles.envelopeContent}>
          <Ionicons name="mail" size={64} color={colors.gold} />
          <Text style={styles.envelopeTitle}>{letter.title}</Text>
          <Text style={styles.envelopeHint}>Tap the envelope to open</Text>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.letterScreen} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.paper}>
        {letter.lines.map((line, index) => (
          <AnimatedText
            key={`${letter.id}-line-${index}`}
            text={line}
            mode="fade"
            delay={index * 900}
            style={styles.line}
          />
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  envelopeScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envelopeContent: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  envelopeTitle: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xl,
    color: colors.cream,
    textAlign: 'center',
  },
  envelopeHint: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  letterScreen: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  paper: {
    gap: spacing.md,
  },
  line: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * 1.7,
    color: colors.cream,
  },
});
