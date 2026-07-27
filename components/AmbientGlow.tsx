import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  color?: string;
  size?: number;
};

/**
 * A single soft, breathing blob of color used behind content to suggest
 * warmth/light without a real blur library. "Subtle ambient animation"
 * (SPEC.md Section 9) — deliberately slow and low-contrast, not decoration
 * that competes with foreground text.
 */
export function AmbientGlow({ color = 'rgba(216, 178, 106, 0.16)', size = 420 }: Props) {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  pulse.value = reducedMotion
    ? 0.5
    : withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }), -1, true);

  const style = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.value * 0.5,
    transform: [{ scale: 0.9 + pulse.value * 0.15 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glow,
        style,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: '35%',
    left: '50%',
  },
});
