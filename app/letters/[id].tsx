import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LetterViewer } from '@/components/LetterViewer';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { LETTERS } from '@/data/letters';

export default function LetterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const letter = LETTERS.find((item) => item.id === id);

  if (!letter) {
    return <PlaceholderScreen title="Letter not found" note="It may have been removed." />;
  }

  return (
    <ScreenContainer gradient>
      <LetterViewer letter={letter} />
      <Pressable
        style={[styles.backButton, { top: insets.top + spacing.sm }]}
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.cream} />
      </Pressable>
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
});
