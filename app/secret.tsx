import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { AnimatedText } from '@/components/AnimatedText';
import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecretReveal } from '@/components/SecretReveal';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useSecretLetter } from '@/hooks/useSecretLetter';
import { checkSecretUnlock } from '@/utils/secretUnlock';

type Stage = 'discovery' | 'unlock' | 'revealed';

export default function Secret() {
  const { content } = useSecretLetter();
  const [stage, setStage] = useState<Stage>('discovery');
  const [input, setInput] = useState('');
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const shake = useSharedValue(0);

  const goToUnlock = useCallback(() => setStage('unlock'), []);

  const handleSubmit = () => {
    if (checkSecretUnlock(input)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setStage('revealed');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    setWrongAttempt(true);
    shake.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-6, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  if (stage === 'revealed') {
    return <SecretReveal onEdit={() => router.push('/secret/edit')} />;
  }

  return (
    <ScreenContainer style={styles.container}>
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.backText}>Close</Text>
      </Pressable>

      {stage === 'discovery' ? (
        <View style={styles.center}>
          <AnimatedText
            key="discovery"
            text={content.discoveryLine}
            mode="fade"
            onRevealComplete={goToUnlock}
            style={styles.discoveryText}
          />
        </View>
      ) : (
        <View style={styles.center}>
          <Animated.View style={[styles.unlockBlock, shakeStyle]}>
            <Text style={styles.prompt}>একটা তারিখ মনে আছে?</Text>
            <TextInput
              value={input}
              onChangeText={(value) => {
                setInput(value);
                setWrongAttempt(false);
              }}
              placeholder="DD-MM-YYYY"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoFocus
            />
            {wrongAttempt ? <Text style={styles.wrongText}>আরেকবার ভাবো...</Text> : null}
            <Button label="Unlock" onPress={handleSubmit} style={styles.submitButton} />
          </Animated.View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    zIndex: 1,
  },
  backText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  discoveryText: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.xl,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  unlockBlock: {
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  prompt: {
    fontFamily: fontFamily.banglaSerifMedium,
    fontSize: fontSize.lg,
    color: colors.cream,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.md,
    color: colors.cream,
    textAlign: 'center',
  },
  wrongText: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.sm,
    color: colors.pinkAccent,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});
