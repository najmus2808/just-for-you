import { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { MusicPlayer } from '@/components/MusicPlayer';
import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { SONGS } from '@/data/songs';
import { goBack } from '@/utils/navigation';

export default function Songs() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
      <FlatList
        data={SONGS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Our Songs</Text>
            <Text style={styles.subtitle}>The soundtrack to us.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <MusicPlayer song={item} />
          </View>
        )}
      />
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
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxxl * 2,
    },
    header: {
      paddingTop: spacing.xxxl,
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
    cell: {
      marginBottom: spacing.md,
    },
  });
