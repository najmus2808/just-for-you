import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';

type Props = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** 'elevated' for standalone cards (memory, letter); 'glass' for overlays on photos/gradients. */
  variant?: 'elevated' | 'glass';
}>;

export function Card({ children, onPress, style, variant = 'elevated' }: Props) {
  const cardStyle = [
    styles.base,
    variant === 'elevated' ? styles.elevated : styles.glass,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  elevated: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  glass: {
    backgroundColor: 'rgba(30, 26, 36, 0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
});
