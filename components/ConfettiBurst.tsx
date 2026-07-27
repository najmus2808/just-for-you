import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const PIECE_COLORS = [colors.gold, colors.pinkAccent, colors.cream, colors.burgundy];
const PIECE_COUNT = 24;

type PieceConfig = {
  id: number;
  left: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
};

function Piece({ config }: { config: PieceConfig }) {
  const progress = useSharedValue(0);
  progress.value = withDelay(
    config.delay,
    withTiming(1, { duration: config.duration, easing: Easing.out(Easing.quad) }),
  );

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateY: progress.value * 500 },
      { rotate: `${progress.value * config.rotation}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        style,
        {
          left: `${config.left}%`,
          backgroundColor: config.color,
          width: config.size,
          height: config.size * 1.6,
        },
      ]}
    />
  );
}

/** A one-time confetti burst for the anniversary-day celebration (SPEC.md Section 17). */
export function ConfettiBurst() {
  const reducedMotion = useReducedMotion();
  const [pieces] = useState<PieceConfig[]>(() =>
    Array.from({ length: PIECE_COUNT }, (_, id) => ({
      id,
      left: Math.random() * 100,
      color: PIECE_COLORS[id % PIECE_COLORS.length],
      size: 6 + Math.random() * 6,
      delay: Math.random() * 400,
      duration: 2200 + Math.random() * 800,
      rotation: 180 + Math.random() * 360,
    })),
  );

  if (reducedMotion) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <Piece key={piece.id} config={piece} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  piece: {
    position: 'absolute',
    top: -20,
    borderRadius: 2,
  },
});
