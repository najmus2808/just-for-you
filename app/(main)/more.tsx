import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  soon?: boolean;
  featured?: boolean;
};

export default function More() {
  const rows: Row[] = [
    {
      icon: 'sparkles-outline',
      label: 'Replay the Intro',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        router.push('/replay-intro');
      },
    },
    {
      icon: 'ellipsis-horizontal-circle-outline',
      label: '...',
      onPress: () => {
        Haptics.selectionAsync().catch(() => {});
        router.push('/secret');
      },
    },
    {
      icon: 'musical-notes-outline',
      label: 'Our Songs',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        router.push('/songs');
      },
    },
    { icon: 'map-outline', label: 'Places', soon: true },
    {
      icon: 'help-circle-outline',
      label: 'How Well Do You Know Us?',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        router.push('/quiz');
      },
    },
    {
      icon: 'heart-circle-outline',
      label: 'Anniversary Countdown',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        router.push('/anniversary');
      },
    },
    {
      icon: 'gift-outline',
      label: 'Before You Go...',
      featured: true,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        router.push('/final-surprise');
      },
    },
  ];

  return (
    <ScreenContainer gradient style={styles.container}>
      <Text style={styles.title}>More</Text>
      <View style={styles.list}>
        {rows.map((row) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            disabled={!row.onPress}
            style={({ pressed }) => [
              styles.row,
              row.featured && styles.rowFeatured,
              pressed && row.onPress && styles.rowPressed,
              row.soon && styles.rowDisabled,
            ]}
          >
            <Ionicons name={row.icon} size={20} color={row.soon ? colors.textMuted : colors.gold} />
            <Text style={[styles.label, row.soon && styles.labelDisabled]}>{row.label}</Text>
            {row.soon ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Soon</Text>
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            )}
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xxl,
    color: colors.gold,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  rowFeatured: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gold,
    backgroundColor: 'rgba(216, 178, 106, 0.08)',
  },
  rowPressed: {
    opacity: 0.8,
  },
  rowDisabled: {
    opacity: 0.55,
  },
  label: {
    flex: 1,
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    color: colors.cream,
  },
  labelDisabled: {
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  badgeText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
