import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useLetters } from '@/hooks/useLetters';

/** Edit a letter's text — each paragraph on its own line, revealed one at a time when opened. */
export default function EditLetter() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { letters, updateLetter } = useLetters();
  const letter = letters.find((item) => item.id === id);

  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (prefilled || !letter) return;
    (async () => {
      setBody(letter.lines.join('\n\n'));
      setPrefilled(true);
    })();
  }, [letter, prefilled]);

  if (!letter) {
    return null;
  }

  const handleSave = async () => {
    const lines = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) return;

    setSaving(true);
    try {
      await updateLetter(letter.id, lines);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } catch {
      Alert.alert('Something went wrong', 'This letter could not be saved. Please try again.');
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

        <Text style={styles.title}>{letter.title}</Text>
        <Text style={styles.subtitle}>
          Each line (separated by a blank line) appears one at a time when this letter is opened.
        </Text>

        <TextInput
          style={styles.input}
          value={body}
          onChangeText={setBody}
          multiline
          placeholder="Write what you want her to read..."
          placeholderTextColor={colors.textMuted}
        />

        <Button
          label={saving ? 'Saving...' : 'Save Letter'}
          onPress={handleSave}
          disabled={saving || body.trim().length === 0}
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
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.md,
  },
  title: {
    fontFamily: fontFamily.serifSemiBold,
    fontSize: fontSize.xl,
    color: colors.gold,
  },
  subtitle: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    minHeight: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: fontFamily.banglaRegular,
    fontSize: fontSize.md,
    color: colors.cream,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
