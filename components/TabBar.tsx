// Subpath import — the barrel `@expo/vector-icons` re-exports all 19 icon
// families and Metro bundles every referenced .ttf regardless, even for
// icon sets never rendered. This pulls in only Ionicons' font file.
import { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';

const ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  home: { active: 'home', inactive: 'home-outline' },
  story: { active: 'book', inactive: 'book-outline' },
  memories: { active: 'images', inactive: 'images-outline' },
  letters: { active: 'mail', inactive: 'mail-outline' },
  more: { active: 'ellipsis-horizontal-circle', inactive: 'ellipsis-horizontal-circle-outline' },
};

const LABELS: Record<string, string> = {
  home: 'Home',
  story: 'Our Story',
  memories: 'Memories',
  letters: 'Letters',
  more: 'More',
};

/**
 * A floating glass pill instead of a stock Material bottom bar — small
 * detail, but a flat OS-default tab bar is exactly the "generic app" feel
 * SPEC.md Section 6 warns against.
 */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + spacing.sm }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const icons = ICONS[route.name];
          const label = LABELS[route.name] ?? options.title ?? route.name;

          const onPress = () => {
            Haptics.selectionAsync().catch(() => {});
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              label={label}
              iconName={icons ? (isFocused ? icons.active : icons.inactive) : undefined}
              focused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  label,
  iconName,
  focused,
  onPress,
}: {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0.55, { duration: 200 }),
    transform: [{ scale: withTiming(focused ? 1 : 0.94, { duration: 200 }) }],
  }));

  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
    >
      <Animated.View style={[styles.itemInner, animatedStyle]}>
        {iconName ? (
          <Ionicons
            name={iconName}
            size={20}
            color={focused ? colors.gold : colors.textSecondary}
          />
        ) : null}
        <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      alignItems: 'center',
    },
    bar: {
      flexDirection: 'row',
      backgroundColor: hexToRgba(colors.midnight, 0.92),
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
      width: '100%',
    },
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemInner: {
      alignItems: 'center',
      gap: 2,
    },
    label: {
      fontFamily: fontFamily.sansMedium,
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    labelFocused: {
      color: colors.gold,
    },
  });
