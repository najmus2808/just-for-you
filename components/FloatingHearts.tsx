import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/build/Ionicons';

import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  count?: number;
};

type HeartConfig = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  tone: 'pink' | 'gold' | 'cream';
};

function Heart({ config, colors }: { config: HeartConfig; colors: ThemeColors }) {
  const progress = useSharedValue(0);

  progress.value = withDelay(
    config.delay,
    withRepeat(
      withTiming(1, { duration: config.duration, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    ),
  );

  const sway = useSharedValue(0);
  sway.value = withDelay(
    config.delay,
    withRepeat(
      withSequence(
        withTiming(1, { duration: config.duration / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: config.duration / 2, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    ),
  );

  const style = useAnimatedStyle(() => {
    const rise = progress.value * -320;
    const fadeIn = Math.min(progress.value / 0.15, 1);
    const fadeOut = Math.min((1 - progress.value) / 0.3, 1);
    const wobble = (sway.value - 0.5) * config.drift;
    return {
      opacity: Math.min(fadeIn, fadeOut) * 0.85,
      transform: [
        { translateY: rise },
        { translateX: wobble },
        { scale: 0.8 + progress.value * 0.2 },
      ],
    };
  });

  const color =
    config.tone === 'pink'
      ? colors.pinkAccent
      : config.tone === 'gold'
        ? colors.gold
        : colors.cream;

  return (
    <Animated.View style={[styles.heart, style, { left: `${config.left}%` }]}>
      <Ionicons name="heart" size={config.size} color={color} />
    </Animated.View>
  );
}

/** Slow, drifting heart bubbles for the emotionally-charged beats — intro and Before You Go. */
export function FloatingHearts({ count = 14 }: Props) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const tones: HeartConfig['tone'][] = useMemo(() => ['pink', 'gold', 'cream'], []);
  // Lazy useState initializer — the one render-phase spot React allows
  // impure work (randomness) to run exactly once per mount.
  const [hearts] = useState<HeartConfig[]>(() =>
    Array.from({ length: count }, (_, id) => ({
      id,
      left: 4 + Math.random() * 88,
      size: 12 + Math.random() * 16,
      duration: 4500 + Math.random() * 4000,
      delay: Math.random() * 4500,
      drift: 12 + Math.random() * 24,
      tone: tones[id % tones.length],
    })),
  );

  if (reducedMotion) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {hearts.map((heart) => (
        <Heart key={heart.id} config={heart} colors={colors} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  heart: {
    position: 'absolute',
    bottom: 0,
  },
});
