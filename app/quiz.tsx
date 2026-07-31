import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { Card } from '@/components/Card';
import { ScreenContainer } from '@/components/ScreenContainer';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { fontFamily, fontSize } from '@/constants/typography';
import { useQuizzes } from '@/hooks/useQuizzes';
import type { Quiz } from '@/types';
import { showAlert } from '@/utils/alert';
import { goBack } from '@/utils/navigation';

/** "How Well Do You Know Us?" — a library of quizzes, each with its own set of questions. */
export default function QuizLibrary() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { quizzes, loading, deleteQuiz } = useQuizzes();

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/quiz/edit');
  };

  const handleOpen = (quiz: Quiz) => {
    Haptics.selectionAsync().catch(() => {});
    if (quiz.questions.length > 0) {
      router.push({ pathname: '/quiz/[id]', params: { id: quiz.id } });
    } else {
      router.push({ pathname: '/quiz/edit', params: { id: quiz.id } });
    }
  };

  const handleEdit = (quiz: Quiz) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push({ pathname: '/quiz/edit', params: { id: quiz.id } });
  };

  const handleDelete = (quiz: Quiz) => {
    showAlert(`Delete "${quiz.title}"?`, 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          deleteQuiz(quiz.id);
        },
      },
    ]);
  };

  return (
    <ScreenContainer gradient style={styles.container}>
      <Pressable
        style={styles.back}
        onPress={() => goBack()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
      </Pressable>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>How Well Do You Know Us?</Text>
            <Text style={styles.subtitle}>
              {loading ? 'Loading...' : 'Pick a quiz, or make a new one.'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Ionicons name="help-circle-outline" size={32} color={colors.textMuted} />
              <Text style={styles.emptyText}>No quizzes yet — tap + to make your first one.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => handleOpen(item)}>
            <Card style={styles.quizCard}>
              <View style={styles.quizRow}>
                <View style={styles.quizText}>
                  <Text style={styles.quizTitle}>{item.title}</Text>
                  <Text style={styles.quizCount}>
                    {item.questions.length === 0
                      ? 'No questions yet'
                      : `${item.questions.length} question${item.questions.length === 1 ? '' : 's'}`}
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleEdit(item)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.title}`}
                >
                  <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.title}`}
                  style={styles.trashButton}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
            </Card>
          </Pressable>
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={handleAdd}
        accessibilityRole="button"
        accessibilityLabel="Add quiz"
      >
        <Ionicons name="add" size={26} color={colors.background} />
      </Pressable>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    back: {
      position: 'absolute',
      top: spacing.xl,
      left: spacing.lg,
      zIndex: 1,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxxl * 2,
      gap: spacing.sm,
    },
    header: {
      paddingTop: spacing.xxxl,
      marginBottom: spacing.lg,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.xxl,
      color: colors.gold,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    empty: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingTop: spacing.xxl,
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textMuted,
      textAlign: 'center',
    },
    quizCard: {
      padding: spacing.md,
    },
    quizRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    quizText: {
      flex: 1,
      gap: 2,
    },
    quizTitle: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.md,
      color: colors.cream,
    },
    quizCount: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    trashButton: {
      marginLeft: spacing.xs,
    },
    fab: {
      position: 'absolute',
      right: spacing.lg,
      bottom: spacing.xxxl,
      width: 56,
      height: 56,
      borderRadius: radius.pill,
      backgroundColor: colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.floating,
    },
  });
