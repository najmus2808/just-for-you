import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FinalSurprise } from '@/components/FinalSurprise';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';
import { goBack } from '@/utils/navigation';

export default function FinalSurpriseScreen() {
  const { colors } = useTheme();
  const [playKey, setPlayKey] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <>
      <FinalSurprise
        key={playKey}
        onReplay={() => setPlayKey((k) => k + 1)}
        onEdit={() => router.push('/final-surprise/edit')}
      />
      <Pressable
        style={[styles.close, { top: insets.top + spacing.sm }]}
        onPress={() => goBack()}
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
