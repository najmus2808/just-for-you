import { useMemo, type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  /** Subtle top-to-bottom gradient wash instead of a flat background. */
  gradient?: boolean;
  edges?: Edge[];
}>;

/**
 * Every screen's outer shell: dark background, safe-area aware, optional
 * gradient wash. Keeps the "entrance to a private world" feel consistent
 * instead of each screen picking its own background handling. Backed by
 * the active theme, so every screen re-colors when the user picks a new one.
 */
export function ScreenContainer({ children, style, gradient = false, edges }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const content: ReactNode = <View style={[styles.container, style]}>{children}</View>;

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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flexFill: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
  });
