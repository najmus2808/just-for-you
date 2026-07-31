import { StyleSheet, View } from 'react-native';

import { CountdownUnit } from '@/components/CountdownUnit';
import { spacing } from '@/constants/spacing';
import type { ElapsedDuration } from '@/utils/dateUtils';

type Props = {
  elapsed: ElapsedDuration;
};

/** Live "married for" duration — years, months, days, hours, minutes, seconds, ticking in real time. */
export function MarriedForCounter({ elapsed }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <CountdownUnit value={elapsed.years} label="Years" />
        <CountdownUnit value={elapsed.months} label="Months" />
        <CountdownUnit value={elapsed.days} label="Days" />
      </View>
      <View style={styles.row}>
        <CountdownUnit value={elapsed.hours} label="Hours" />
        <CountdownUnit value={elapsed.minutes} label="Min" />
        <CountdownUnit value={elapsed.seconds} label="Sec" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
