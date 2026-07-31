import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { themeList } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { goBack } from '@/utils/navigation';

/** Lets the user pick a theme for the whole app — persists via ThemeContext/AsyncStorage. */
export default function ThemeScreen() {
  const { themeId, colors, setThemeId } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSelect = (id: typeof themeId) => {
    if (id === themeId) return;
    Haptics.selectionAsync().catch(() => {});
    setThemeId(id);
  };

  return (
    <ScreenContainer gradient>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Text style={styles.title}>Theme</Text>
        <Text style={styles.subtitle}>
          Pick the look that feels right — it applies everywhere, instantly.
        </Text>

        <View style={styles.list}>
          {themeList.map((theme) => {
            const selected = theme.id === themeId;
            return (
              <Pressable
                key={theme.id}
                onPress={() => handleSelect(theme.id)}
                style={({ pressed }) => [
                  styles.card,
                  selected && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <View style={styles.swatchRow}>
                  {theme.swatch.map((hex, i) => (
                    <View
                      key={i}
                      style={[
                        styles.swatch,
                        { backgroundColor: hex },
                        i === 0 && styles.swatchFirst,
                      ]}
                    />
                  ))}
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.cardLabel}>{theme.label}</Text>
                  <Text style={styles.cardDescription}>{theme.description}</Text>
                </View>

                <Ionicons
                  name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={selected ? colors.cream : colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingTop: spacing.md,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.xxl,
      color: colors.gold,
      marginTop: spacing.sm,
    },
    subtitle: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    list: {
      gap: spacing.sm,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'transparent',
    },
    cardSelected: {
      borderColor: colors.pinkAccent,
      backgroundColor: colors.backgroundElevated,
    },
    cardPressed: {
      opacity: 0.85,
    },
    swatchRow: {
      flexDirection: 'row',
    },
    swatch: {
      width: 16,
      height: 32,
      marginLeft: -8,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.background,
    },
    swatchFirst: {
      marginLeft: 0,
    },
    cardText: {
      flex: 1,
      gap: 2,
    },
    cardLabel: {
      fontFamily: fontFamily.sansSemiBold,
      fontSize: fontSize.md,
      color: colors.cream,
    },
    cardDescription: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
  });
