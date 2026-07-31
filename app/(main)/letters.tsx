import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { LetterCard } from '@/components/LetterCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useLetters } from '@/hooks/useLetters';

/** The "Open When..." experience (SPEC.md Section 14). */
export default function Letters() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { letters } = useLetters();

  return (
    <ScreenContainer>
      <FlatList
        data={letters}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Love Letters</Text>
            <Text style={styles.subtitle}>Open one whenever you need it.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <LetterCard letter={item} />
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxxl * 2,
    },
    header: {
      paddingTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.xxl,
      color: colors.gold,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    row: {
      gap: spacing.md,
    },
    cell: {
      flex: 1,
      marginBottom: spacing.md,
    },
  });
