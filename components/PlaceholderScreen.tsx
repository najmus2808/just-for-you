import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';

type Props = {
  title: string;
  note: string;
};

/** Shared shell for tabs whose real experience lands in a later phase. */
export function PlaceholderScreen({ title, note }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScreenContainer gradient style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>{note}</Text>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing.sm,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.xl,
      color: colors.gold,
      textAlign: 'center',
    },
    note: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
