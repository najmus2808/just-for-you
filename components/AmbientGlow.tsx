import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { hexToRgba } from '@/utils/color';

type Props = {
  color?: string;
  size?: number;
  /** Adds a soft ring + twinkling stars around the glow — for moments that deserve more polish. */
  sparkle?: boolean;
};

type StarConfig = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

function Star({
  config,
  color,
  reducedMotion,
}: {
  config: StarConfig;
  color: string;
  reducedMotion: boolean;
}) {
  const twinkle = useSharedValue(reducedMotion ? 0.6 : 0);

  if (!reducedMotion) {
    twinkle.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, { duration: config.duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }

  const style = useAnimatedStyle(() => ({
    opacity: 0.25 + twinkle.value * 0.65,
    transform: [
      { translateX: config.x - config.size / 2 },
      { translateY: config.y - config.size / 2 },
      { scale: 0.7 + twinkle.value * 0.5 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.star,
        style,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

/**
 * A single soft, breathing blob of color used behind content to suggest
 * warmth/light without a real blur library. "Subtle ambient animation"
 * (SPEC.md Section 9) — deliberately slow and low-contrast, not decoration
 * that competes with foreground text. Defaults to the active theme's accent
 * when no explicit `color` is passed, so it re-tints when the theme changes.
 * `sparkle` dresses it up further with a ring and twinkling stars, for the
 * handful of moments (the intro's "little world" beat) that want more magic.
 */
export function AmbientGlow({ color, size = 420, sparkle = false }: Props) {
  const { colors } = useTheme();
  const glowColor = color ?? hexToRgba(colors.pinkAccent, 0.16);
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  pulse.value = reducedMotion
    ? 0.5
    : withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }), -1, true);

  const style = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.value * 0.5,
    transform: [{ scale: 0.9 + pulse.value * 0.15 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + pulse.value * 0.35,
    transform: [{ scale: 1.1 + pulse.value * 0.06 }],
  }));

  const ringSize = size * 0.58;

  // Lazy initializer — the one render-phase spot React allows randomness to
  // run exactly once per mount, same pattern as FloatingHearts/ConfettiBurst.
  const [stars] = useState<StarConfig[]>(() =>
    sparkle
      ? Array.from({ length: 7 }, (_, id) => {
          const angle = (360 / 7) * id + Math.random() * 24;
          const distance = size * 0.34 + Math.random() * size * 0.16;
          const rad = (angle * Math.PI) / 180;
          return {
            id,
            x: Math.cos(rad) * distance,
            y: Math.sin(rad) * distance,
            size: 3 + Math.random() * 3.5,
            delay: Math.random() * 2200,
            duration: 1500 + Math.random() * 1300,
          };
        })
      : [],
  );

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          style,
          {
            backgroundColor: glowColor,
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -size / 2,
            marginTop: -size / 2,
          },
        ]}
      />
      {sparkle ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            ringStyle,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderColor: hexToRgba(colors.cream, 0.45),
              marginLeft: -ringSize / 2,
              marginTop: -ringSize / 2,
            },
          ]}
        />
      ) : null}
      {stars.map((star) => (
        <Star key={star.id} config={star} color={colors.cream} reducedMotion={reducedMotion} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: '35%',
    left: '50%',
  },
  ring: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    borderWidth: StyleSheet.hairlineWidth,
  },
  star: {
    position: 'absolute',
    top: '35%',
    left: '50%',
  },
});
