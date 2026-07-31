import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MemoryViewer } from '@/components/MemoryViewer';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { useMemories } from '@/hooks/useMemories';
import { showAlert } from '@/utils/alert';
import { hexToRgba } from '@/utils/color';
import { goBack } from '@/utils/navigation';

export default function MemoryDetail() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { memories, deleteMemory } = useMemories();
  const [deleting, setDeleting] = useState(false);

  const memory = memories.find((item) => item.id === id);

  const handleDelete = () => {
    showAlert('Delete this memory?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!memory) return;
          setDeleting(true);
          await deleteMemory(memory.id);
          goBack();
        },
      },
    ]);
  };

  if (!memory) {
    return <PlaceholderScreen title="Memory not found" note="It may have been removed." />;
  }

  return (
    <ScreenContainer edges={['bottom']}>
      <MemoryViewer memory={memory} />

      <Pressable
        style={[styles.backButton, { top: insets.top + spacing.sm }]}
        onPress={() => goBack()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.cream} />
      </Pressable>

      {memory.isUserAdded ? (
        <View style={[styles.actionRow, { top: insets.top + spacing.sm }]}>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              router.push({ pathname: '/memories/add', params: { id: memory.id } });
            }}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Edit this memory"
          >
            <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              handleDelete();
            }}
            disabled={deleting}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Delete this memory"
          >
            <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backButton: {
      position: 'absolute',
      left: spacing.lg,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: hexToRgba(colors.midnight, 0.6),
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionRow: {
      position: 'absolute',
      right: spacing.lg,
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: hexToRgba(colors.midnight, 0.6),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
