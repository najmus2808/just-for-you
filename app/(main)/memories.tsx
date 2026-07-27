import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { MemoryCard } from '@/components/MemoryCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { fontFamily, fontSize } from '@/constants/typography';
import { useMemories } from '@/hooks/useMemories';
import type { Memory } from '@/types';

/** A private memory vault, not a stock photo grid (SPEC.md Section 13). */
export default function Memories() {
  const { memories, loading } = useMemories();

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/memories/add');
  };

  const handleOpen = (memory: Memory) => {
    Haptics.selectionAsync().catch(() => {});
    router.push({ pathname: '/memories/[id]', params: { id: memory.id } });
  };

  return (
    <ScreenContainer style={styles.container}>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Memories</Text>
            <Text style={styles.subtitle}>
              {loading ? 'Opening the vault...' : 'Every chapter, kept somewhere safe.'}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.cell}>
            <MemoryCard
              memory={item}
              tilt={index % 2 === 0 ? 'left' : 'right'}
              onPress={() => handleOpen(item)}
            />
          </View>
        )}
      />
      <Pressable
        style={styles.fab}
        onPress={handleAdd}
        accessibilityRole="button"
        accessibilityLabel="Add memory"
      >
        <Ionicons name="add" size={26} color={colors.background} />
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    marginBottom: spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xxxl,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floating,
  },
});
