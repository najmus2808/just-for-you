import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AnimatedText } from '@/components/AnimatedText';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Letter } from '@/types';

type Props = {
  letter: Letter;
};

/** Line-by-line letter reveal — the envelope-opening gesture already happened on the card, so this shows the message straight away (SPEC.md Section 14). */
export function LetterViewer({ letter }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
