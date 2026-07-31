import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useQuizzes } from '@/hooks/useQuizzes';
import type { QuizQuestion } from '@/types';
import { showAlert } from '@/utils/alert';
import { goBack } from '@/utils/navigation';

function blankQuestion(): QuizQuestion {
  return {
    id: `question-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
  };
}

/** Doubles as "New Quiz" and (with an `id` param) "Edit Quiz" — same form either way. */
export default function EditQuiz() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const { quizzes, addQuiz, updateQuiz, deleteQuiz } = useQuizzes();

  const [title, setTitle] = useState('');
  const [draft, setDraft] = useState<QuizQuestion[]>([]);
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing || prefilled) return;
    const quiz = quizzes.find((item) => item.id === id);
    if (!quiz) return;

    (async () => {
      setTitle(quiz.title);
      setDraft(quiz.questions);
      setPrefilled(true);
    })();
  }, [isEditing, prefilled, quizzes, id]);

  const updateQuestionText = (questionId: string, text: string) => {
    setDraft((current) => current.map((q) => (q.id === questionId ? { ...q, question: text } : q)));
  };

  const updateOptionText = (questionId: string, optionIndex: number, text: string) => {
    setDraft((current) =>
      current.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((option, i) => (i === optionIndex ? text : option)) }
          : q,
      ),
    );
  };

  const setCorrectIndex = (questionId: string, optionIndex: number) => {
    Haptics.selectionAsync().catch(() => {});
    setDraft((current) =>
      current.map((q) => (q.id === questionId ? { ...q, correctIndex: optionIndex } : q)),
    );
  };

  const handleAddQuestion = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setDraft((current) => [...current, blankQuestion()]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setDraft((current) => current.filter((q) => q.id !== questionId));
  };

  const handleDeleteQuiz = () => {
    if (!id) return;
    showAlert('Delete this quiz?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteQuiz(id);
          goBack();
        },
      },
    ]);
  };

  const hasTitle = title.trim().length > 0;
  const questionsValid = draft.every(
    (q) => q.question.trim().length > 0 && q.options.every((o) => o.trim().length > 0),
  );
  const canSave = hasTitle && questionsValid && !saving && prefilled;

  const missingHint = !hasTitle
    ? 'Give the quiz a title to save.'
    : !questionsValid
      ? 'Fill in every question and its options, or remove the empty one.'
      : null;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      if (isEditing && id) {
        await updateQuiz(id, { title, questions: draft });
      } else {
        const quiz = await addQuiz(title);
        await updateQuiz(quiz.id, { questions: draft });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      goBack();
    } catch {
      showAlert('Something went wrong', 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer gradient>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
          {isEditing ? (
            <Pressable
              onPress={handleDeleteQuiz}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Delete quiz"
            >
              <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.title}>{isEditing ? 'Edit Quiz' : 'New Quiz'}</Text>
        <Text style={styles.subtitle}>
          Add as many questions as you like, and tap the checkmark next to each correct answer.
        </Text>

        <Text style={styles.label}>Quiz title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. How Well Do You Know Us?"
          placeholderTextColor={colors.textMuted}
        />

        {draft.map((q, qIndex) => (
          <Card key={q.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>Question {qIndex + 1}</Text>
              <Pressable
                onPress={() => handleRemoveQuestion(q.id)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={`Remove question ${qIndex + 1}`}
              >
                <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              value={q.question}
              onChangeText={(text) => updateQuestionText(q.id, text)}
              placeholder="Type the question"
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
                    {isCorrect ? (
                      <Ionicons name="checkmark" size={16} color={colors.background} />
                    ) : null}
                  </Pressable>
                  <TextInput
                    style={[styles.input, styles.optionInput]}
                    value={option}
                    onChangeText={(text) => updateOptionText(q.id, optionIndex, text)}
                    placeholder={`Option ${optionIndex + 1}`}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              );
            })}
          </Card>
        ))}

        <Pressable
          style={styles.addQuestionRow}
          onPress={handleAddQuestion}
          accessibilityRole="button"
          accessibilityLabel="Add question"
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.gold} />
          <Text style={styles.addQuestionLabel}>Add Question</Text>
        </Pressable>

        <Button
          label={saving ? 'Saving...' : 'Save Quiz'}
          onPress={handleSave}
          disabled={!canSave}
          style={styles.saveButton}
        />
        {missingHint ? <Text style={styles.hint}>{missingHint}</Text> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxxl * 2,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      marginBottom: spacing.lg,
    },
    card: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontFamily: fontFamily.sansSemiBold,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: spacing.xs,
      marginTop: spacing.md,
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
    addQuestionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      justifyContent: 'center',
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      marginTop: spacing.sm,
    },
    addQuestionLabel: {
      fontFamily: fontFamily.sansSemiBold,
      fontSize: fontSize.sm,
      color: colors.gold,
    },
    saveButton: {
      marginTop: spacing.xl,
    },
    hint: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });
