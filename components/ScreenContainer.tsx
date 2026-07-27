import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  /** Subtle top-to-bottom gradient wash instead of a flat background. */
  gradient?: boolean;
  edges?: Edge[];
}>;

/**
 * Every screen's outer shell: dark background, safe-area aware, optional
 * gradient wash. Keeps the "entrance to a private world" feel consistent
 * instead of each screen picking its own background handling.
 */
export function ScreenContainer({ children, style, gradient = false, edges }: Props) {
  const content = (
    <View style={[styles.container, style]}>{children}</View>
  );

  if (!gradient) {
    return (
      <SafeAreaView style={styles.flexFill} edges={edges}>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.midnight, colors.background]}
      style={styles.flexFill}
    >
      <SafeAreaView style={styles.flexFill} edges={edges}>
        {content}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
});
