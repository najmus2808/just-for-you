import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  count?: number;
};

type ParticleConfig = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

function Particle({ config }: { config: ParticleConfig }) {
  const progress = useSharedValue(0);

  progress.value = withDelay(
    config.delay,
    withRepeat(withTiming(1, { duration: config.duration, easing: Easing.out(Easing.quad) }), -1, false),
  );

  const style = useAnimatedStyle(() => {
    const rise = progress.value * -260;
    const fadeIn = Math.min(progress.value / 0.2, 1);
    const fadeOut = Math.min((1 - progress.value) / 0.3, 1);
    return {
      opacity: Math.min(fadeIn, fadeOut) * 0.5,
      transform: [{ translateY: rise }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          left: `${config.left}%`,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
        },
      ]}
    />
  );
}

/** Slow, faint upward-drifting motes — light in the dark, not confetti. */
export function FloatingParticles({ count = 10 }: Props) {
  const reducedMotion = useReducedMotion();
  // Lazy useState initializer, not useMemo — this is the one render-phase
  // spot React allows impure work (e.g. randomness) to run exactly once.
  const [particles] = useState<ParticleConfig[]>(() =>
    Array.from({ length: count }, (_, id) => ({
      id,
      left: 5 + Math.random() * 90,
      size: 3 + Math.random() * 4,
      duration: 5000 + Math.random() * 4000,
      delay: Math.random() * 4000,
    })),
  );

  if (reducedMotion) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Particle key={particle.id} config={particle} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  particle: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.gold,
  },
});
