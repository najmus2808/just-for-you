import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { fontFamily, fontSize } from '@/constants/typography';
import { subscribeToAlerts, type AlertButton, type AlertRequest } from '@/utils/alert';
import { hexToRgba } from '@/utils/color';

/** Renders whatever `showAlert()` requests — one instance, mounted once at the app root. */
export function AlertHost() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [request, setRequest] = useState<AlertRequest | null>(null);
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);

  useEffect(() => subscribeToAlerts(setRequest), []);

  const handlePress = (button: AlertButton) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRequest(null);
    button.onPress?.();
  };

  const popIn = () => {
    scale.value = withTiming(1, { duration: 220 });
    opacity.value = withTiming(1, { duration: 180 });
  };

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const isStacked = (request?.buttons.length ?? 0) > 2;

  return (
    <Modal
      visible={Boolean(request)}
      transparent
      animationType="fade"
      onRequestClose={() => setRequest(null)}
      onShow={popIn}
    >
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, cardStyle]}>
          {request ? (
            <>
              <Text style={styles.title}>{request.title}</Text>
              {request.message ? <Text style={styles.message}>{request.message}</Text> : null}
              <View style={[styles.buttonRow, isStacked && styles.buttonColumn]}>
                {request.buttons.map((button, index) => (
                  <Pressable
                    key={`${button.text}-${index}`}
                    onPress={() => handlePress(button)}
                    style={({ pressed }) => [
                      styles.button,
                      index > 0 && (isStacked ? styles.dividerTop : styles.dividerLeft),
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        button.style === 'cancel' && styles.cancelText,
                        button.style === 'destructive' && styles.destructiveText,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: hexToRgba(colors.background, 0.72),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    card: {
      width: '100%',
      maxWidth: 340,
      borderRadius: radius.lg,
      backgroundColor: colors.backgroundElevated,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
      paddingTop: spacing.lg,
      ...shadows.floating,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.lg,
      color: colors.gold,
      textAlign: 'center',
      paddingHorizontal: spacing.lg,
    },
    message: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      lineHeight: fontSize.sm * 1.5,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
      paddingHorizontal: spacing.lg,
    },
    buttonRow: {
      flexDirection: 'row',
      marginTop: spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    buttonColumn: {
      flexDirection: 'column',
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dividerLeft: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: colors.border,
    },
    dividerTop: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    buttonPressed: {
      backgroundColor: hexToRgba(colors.cream, 0.06),
    },
    buttonText: {
      fontFamily: fontFamily.sansSemiBold,
      fontSize: fontSize.md,
      color: colors.gold,
    },
    cancelText: {
      fontFamily: fontFamily.sansMedium,
      color: colors.textSecondary,
    },
    destructiveText: {
      color: colors.error,
    },
  });
