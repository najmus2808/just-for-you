import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useQuizQuestions } from '@/hooks/useQuizQuestions';
import type { QuizQuestion } from '@/types';

export default function EditQuiz() {
  const { questions, updateQuestions } = useQuizQuestions();
  const [draft, setDraft] = useState<QuizQuestion[]>(questions);
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (prefilled) return;
    setDraft(questions);
    setPrefilled(true);
  }, [questions, prefilled]);

  const updateQuestionText = (id: string, text: string) => {
    setDraft((current) => current.map((q) => (q.id === id ? { ...q, question: text } : q)));
  };

  const updateOptionText = (id: string, optionIndex: number, text: string) => {
    setDraft((current) =>
      current.map((q) =>
        q.id === id
          ? { ...q, options: q.options.map((option, i) => (i === optionIndex ? text : option)) }
          : q,
      ),
    );
  };

  const setCorrectIndex = (id: string, optionIndex: number) => {
    Haptics.selectionAsync().catch(() => {});
    setDraft((current) => current.map((q) => (q.id === id ? { ...q, correctIndex: optionIndex } : q)));
  };

  const canSave =
    !saving && draft.every((q) => q.question.trim().length > 0 && q.options.every((o) => o.trim().length > 0));

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await updateQuestions(draft);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } catch {
      Alert.alert('Something went wrong', 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer gradient>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Text style={styles.title}>Edit Quiz</Text>
        <Text style={styles.subtitle}>Tap the checkmark next to the correct answer for each question.</Text>

        {draft.map((q, qIndex) => (
          <Card key={q.id} style={styles.card}>
            <Text style={styles.label}>Question {qIndex + 1}</Text>
            <TextInput
              style={styles.input}
              value={q.question}
              onChangeText={(text) => updateQuestionText(q.id, text)}
              placeholderTextColor={colors.textMuted}
              multiline
            />
            {q.options.map((option, optionIndex) => {
              const isCorrect = q.correctIndex === optionIndex;
              return (
                <View key={optionIndex} style={styles.optionRow}>
                  <Pressable
                    onPress={() => setCorrectIndex(q.id, optionIndex)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={isCorrect ? 'Correct answer' : 'Mark as correct answer'}
                    style={[styles.correctToggle, isCorrect && styles.correctToggleActive]}
                  >
                    {isCorrect ? <Ionicons name="checkmark" size={16} color={colors.background} /> : null}
                  </Pressable>
                  <TextInput
                    style={[styles.input, styles.optionInput]}
                    value={option}
                    onChangeText={(text) => updateOptionText(q.id, optionIndex, text)}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              );
            })}
          </Card>
        ))}

        <Button
          label={saving ? 'Saving...' : 'Save Quiz'}
          onPress={handleSave}
          disabled={!canSave}
          style={styles.saveButton}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
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
  },
  subtitle: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  card: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    color: colors.cream,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionInput: {
    flex: 1,
  },
  correctToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctToggleActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
