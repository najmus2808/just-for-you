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
import { useSecretLetter } from '@/hooks/useSecretLetter';
import type { SecretLetterContent } from '@/types';

const FIELDS: { key: keyof SecretLetterContent; label: string; multiline?: boolean }[] = [
  { key: 'discoveryLine', label: 'Discovery line (shown before unlocking)' },
  { key: 'opening', label: 'Opening line' },
  { key: 'body', label: 'The main message', multiline: true },
  { key: 'closingBangla', label: 'Closing line (Bangla)' },
  { key: 'closingEnglish', label: 'Closing line (English)' },
  { key: 'final', label: 'Final word' },
];

export default function EditSecretLetter() {
  const { content, updateContent } = useSecretLetter();
  const [draft, setDraft] = useState<SecretLetterContent>(content);
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (prefilled) return;
    (async () => {
      setDraft(content);
      setPrefilled(true);
    })();
  }, [content, prefilled]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContent(draft);
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

        <Text style={styles.title}>Edit Secret Letter</Text>

        {FIELDS.map((field) => (
          <View key={field.key}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={[styles.input, field.multiline && styles.multiline]}
              value={draft[field.key]}
              onChangeText={(value) => setDraft((current) => ({ ...current, [field.key]: value }))}
              placeholderTextColor={colors.textMuted}
              multiline={field.multiline}
            />
          </View>
        ))}

        <Button label={saving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={saving} style={styles.saveButton} />
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
    marginBottom: spacing.lg,
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
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
