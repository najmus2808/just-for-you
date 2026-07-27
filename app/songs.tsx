import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { MusicPlayer } from '@/components/MusicPlayer';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { SONGS } from '@/data/songs';

export default function Songs() {
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
