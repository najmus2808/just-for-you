import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FinalSurprise } from '@/components/FinalSurprise';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function FinalSurpriseScreen() {
  const [playKey, setPlayKey] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <>
      <FinalSurprise key={playKey} onReplay={() => setPlayKey((k) => k + 1)} />
      <Pressable
        style={[styles.close, { top: insets.top + spacing.sm }]}
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    right: spacing.lg,
  },
});
