import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { CountdownState } from '@/hooks/useCountdown';

type UnitProps = {
  value: number;
  label: string;
};

function Unit({ value, label }: UnitProps) {
  const scale = useSharedValue(1);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current !== value) {
      previous.current = value;
      scale.value = withSequence(withTiming(1.12, { duration: 120 }), withTiming(1, { duration: 160 }));
    }
  }, [value, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.unit}>
      <Animated.Text style={[styles.value, style]}>{value.toString().padStart(2, '0')}</Animated.Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

type Props = {
  countdown: CountdownState;
};

/** Elegant animated countdown to the next anniversary (SPEC.md Section 17). */
export function Countdown({ countdown }: Props) {
  return (
    <View style={styles.row}>
      <Unit value={countdown.days} label="Days" />
      <Unit value={countdown.hours} label="Hours" />
      <Unit value={countdown.minutes} label="Min" />
      <Unit value={countdown.seconds} label="Sec" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unit: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minWidth: 64,
  },
  value: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize.xxl,
    color: colors.gold,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
});
