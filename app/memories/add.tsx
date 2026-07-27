import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useMemories } from '@/hooks/useMemories';

/**
 * "Memory Vault → + Add Memory" — the only place a photo permission prompt
 * ever appears, and only when reached here (SPEC.md Section 36).
 */
export default function AddMemory() {
  const { addMemory } = useMemories();
  const [pickedUris, setPickedUris] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (!result.canceled) {
      setPickedUris((current) => [...current, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const removePhoto = (uri: string) => {
    setPickedUris((current) => current.filter((item) => item !== uri));
  };

  const canSave = pickedUris.length > 0 && title.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await addMemory({
        title,
        date: date.toISOString().slice(0, 10),
        location,
        caption,
        pickedUris,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } catch {
      Alert.alert('Something went wrong', 'This memory could not be saved. Please try again.');
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

        <Text style={styles.title}>Add a Memory</Text>
        <Text style={styles.subtitle}>Another chapter in our story.</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoRow}
          contentContainerStyle={styles.photoRowContent}
        >
          {pickedUris.map((uri) => (
            <View key={uri} style={styles.thumbWrapper}>
              <Image source={{ uri }} style={styles.thumb} />
              <Pressable
                style={styles.removeBadge}
                onPress={() => removePhoto(uri)}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
              >
                <Ionicons name="close" size={14} color={colors.background} />
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.addPhotoTile} onPress={handlePickPhotos}>
            <Ionicons name="images-outline" size={24} color={colors.gold} />
            <Text style={styles.addPhotoLabel}>
              {pickedUris.length ? 'Add more' : 'Select photos'}
            </Text>
          </Pressable>
        </ScrollView>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Our First Trip"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Date</Text>
        <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>{date.toDateString()}</Text>
        </Pressable>
        {showDatePicker ? (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(_event, selected) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
          />
        ) : null}

        <Text style={styles.label}>Location (optional)</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Cox's Bazar"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Your story</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={caption}
          onChangeText={setCaption}
          placeholder="What made this moment special?"
          placeholderTextColor={colors.textMuted}
          multiline
        />

        <Button
          label={saving ? 'Saving...' : 'Save Memory'}
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
  photoRow: {
    marginBottom: spacing.lg,
  },
  photoRowContent: {
    gap: spacing.sm,
  },
  thumbWrapper: {
    position: 'relative',
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoTile: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.gold,
    textAlign: 'center',
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
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.md,
    color: colors.cream,
  },
  inputText: {
    fontFamily: fontFamily.sansRegular,
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
