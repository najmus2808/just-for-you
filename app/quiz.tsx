import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { AnimatedText } from '@/components/AnimatedText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useQuizQuestions } from '@/hooks/useQuizQuestions';

function resultMessage(score: number, total: number): string {
  const ratio = score / total;
  if (ratio === 1) return 'তুমি আমাদের গল্পটা মুখস্থ করে ফেলেছ। ❤️';
  if (ratio >= 0.6) return 'বেশ ভালোই জানো আমাদের কথা।';
  return 'চলো, আরেকবার আমাদের গল্পটা একসাথে মনে করি।';
}

export default function Quiz() {
  const { questions } = useQuizQuestions();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === question.correctIndex;
    Haptics.notificationAsync(
      isCorrect ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    ).catch(() => {});
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <ScreenContainer gradient style={styles.center}>
        <Text style={styles.resultTitle}>You scored {score}/{questions.length}</Text>
        <AnimatedText
          key="result"
          text={resultMessage(score, questions.length)}
          mode="fade"
          style={styles.resultMessage}
        />
        <Button label="Try Again" onPress={handleRestart} style={styles.actionButton} />
        <Button label="Back" variant="ghost" onPress={() => router.back()} style={styles.actionButton} />
      </ScreenContainer>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <ScreenContainer gradient style={styles.container}>
      <Pressable
        style={styles.editButton}
        onPress={() => router.push('/quiz/edit')}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Edit quiz questions"
      >
        <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
      </Pressable>
      <Pressable
        style={styles.close}
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close quiz"
      >
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>

      <Text style={styles.progress}>
        Question {index + 1} of {questions.length}
      </Text>
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrectOption = optionIndex === question.correctIndex;
          const showFeedback = selected !== null;
          return (
            <Pressable
              key={option + optionIndex}
              onPress={() => handleSelect(optionIndex)}
              disabled={selected !== null}
              accessibilityRole="button"
              accessibilityLabel={option}
            >
              <Card
                variant="glass"
                style={[
                  styles.option,
                  showFeedback && isCorrectOption && styles.optionCorrect,
                  showFeedback && isSelected && !isCorrectOption && styles.optionWrong,
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Card>
            </Pressable>
          );
        })}
      </View>

      {selected !== null ? (
        <View style={styles.feedbackBlock}>
          <Text style={styles.feedback}>
            {selected === question.correctIndex
              ? 'You know us too well. ❤️'
              : 'আবার চেষ্টা করো, বউ! 😄'}
          </Text>
          <Button label={isLast ? 'See Result' : 'Next'} onPress={handleNext} style={styles.nextButton} />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  close: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    zIndex: 1,
  },
  editButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    zIndex: 1,
  },
  progress: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  question: {
    fontFamily: fontFamily.banglaSerifMedium,
    fontSize: fontSize.xl,
    color: colors.cream,
    marginBottom: spacing.lg,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  optionCorrect: {
    borderColor: colors.success,
    borderWidth: 1,
  },
  optionWrong: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  optionText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    color: colors.cream,
  },
  feedbackBlock: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  feedback: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    color: colors.pinkAccent,
    textAlign: 'center',
  },
  nextButton: {
    alignSelf: 'stretch',
  },
  resultTitle: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xxl,
    color: colors.gold,
    textAlign: 'center',
  },
  resultMessage: {
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    color: colors.cream,
    textAlign: 'center',
  },
  actionButton: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
});
