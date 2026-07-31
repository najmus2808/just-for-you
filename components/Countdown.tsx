import { StyleSheet, View } from 'react-native';

import { CountdownUnit } from '@/components/CountdownUnit';
import { spacing } from '@/constants/spacing';
import type { CountdownState } from '@/hooks/useCountdown';

type Props = {
  countdown: CountdownState;
};

/** Elegant animated countdown to the next anniversary (SPEC.md Section 17). */
export function Countdown({ countdown }: Props) {
  return (
    <View style={styles.row}>
      <CountdownUnit value={countdown.days} label="Days" />
      <CountdownUnit value={countdown.hours} label="Hours" />
      <CountdownUnit value={countdown.minutes} label="Min" />
      <CountdownUnit value={countdown.seconds} label="Sec" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
