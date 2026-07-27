import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MemoryViewer } from '@/components/MemoryViewer';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { useMemories } from '@/hooks/useMemories';

export default function MemoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { memories, deleteMemory } = useMemories();
  const [deleting, setDeleting] = useState(false);

  const memory = memories.find((item) => item.id === id);

  const handleDelete = () => {
    Alert.alert('Delete this memory?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!memory) return;
          setDeleting(true);
          await deleteMemory(memory.id);
          router.back();
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
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.cream} />
      </Pressable>

      {memory.isUserAdded ? (
        <Pressable
          style={[styles.deleteButton, { top: insets.top + spacing.sm }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            handleDelete();
          }}
          disabled={deleting}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Delete this memory"
        >
          <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 10, 13, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 10, 13, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
