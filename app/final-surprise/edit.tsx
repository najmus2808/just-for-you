import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useFinalMessage } from '@/hooks/useFinalMessage';

/** Edit the Final Surprise's line-by-line closing message (SPEC.md Section 22). */
export default function EditFinalMessage() {
  const { beats, updateBeats } = useFinalMessage();
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (prefilled) return;
    setBody(beats.join('\n'));
    setPrefilled(true);
  }, [beats, prefilled]);

  const handleSave = async () => {
    const lines = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) return;

    setSaving(true);
    try {
      await updateBeats(lines);
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

        <Text style={styles.title}>Edit Final Surprise</Text>
        <Text style={styles.subtitle}>
          One line per beat — each appears on its own, in order, at the very end of the app.
        </Text>

        <TextInput
          style={styles.input}
          value={body}
          onChangeText={setBody}
          multiline
          placeholder="Before you go..."
          placeholderTextColor={colors.textMuted}
        />

        <Button
          label={saving ? 'Saving...' : 'Save'}
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
    fontSize: fontSize.xxl,
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
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.md,
    color: colors.cream,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
