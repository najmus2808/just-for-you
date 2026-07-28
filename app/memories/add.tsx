import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import { useMemories } from '@/hooks/useMemories';

/**
 * Doubles as "Add Memory" (SPEC.md Section 36) and, when opened with an
 * `id` param, "Edit Memory" — same form, same photo picker, same premium
 * feel either way.
 */
export default function AddMemory() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const { memories, addMemory, editMemory, editMemoryPhotos } = useMemories();

  const [existingUris, setExistingUris] = useState<string[]>([]);
  const [pickedUris, setPickedUris] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing || prefilled) return;
    const memory = memories.find((item) => item.id === id);
    if (!memory) return;

    (async () => {
      setTitle(memory.title);
      setLocation(memory.location ?? '');
      setCaption(memory.caption);
      const parsedDate = new Date(`${memory.date}T00:00:00`);
      setDate(Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
      setExistingUris(
        (memory.photos ?? [])
          .filter((photo): photo is { uri: string } => typeof photo === 'object' && 'uri' in photo)
          .map((photo) => photo.uri),
      );
      setPrefilled(true);
    })();
  }, [isEditing, prefilled, memories, id]);

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

  const removeExistingPhoto = (uri: string) => {
    setExistingUris((current) => current.filter((item) => item !== uri));
  };

  const removePickedPhoto = (uri: string) => {
    setPickedUris((current) => current.filter((item) => item !== uri));
  };

  const totalPhotoCount = existingUris.length + pickedUris.length;
  const hasTitle = title.trim().length > 0;
  const hasPhoto = totalPhotoCount > 0;
  const canSave = hasPhoto && hasTitle && !saving && prefilled;

  const missingHint = !hasTitle && !hasPhoto
    ? 'Add a title and at least one photo to save.'
    : !hasTitle
      ? 'Add a title to save.'
      : !hasPhoto
        ? 'Add at least one photo to save.'
        : null;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const dateString = date.toISOString().slice(0, 10);
      if (isEditing && id) {
        await editMemory(id, { title, date: dateString, location, caption });
        await editMemoryPhotos(id, existingUris, pickedUris);
      } else {
        await addMemory({ title, date: dateString, location, caption, pickedUris });
      }
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
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

        <Text style={styles.title}>{isEditing ? 'Edit Memory' : 'Add a Memory'}</Text>
        <Text style={styles.subtitle}>
          {isEditing ? 'Update this chapter.' : 'Another chapter in our story.'}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoRow}
          contentContainerStyle={styles.photoRowContent}
        >
          {existingUris.map((uri) => (
            <View key={uri} style={styles.thumbWrapper}>
              <Image source={{ uri }} style={styles.thumb} />
              <Pressable
                style={styles.removeBadge}
                onPress={() => removeExistingPhoto(uri)}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
              >
                <Ionicons name="close" size={14} color={colors.background} />
              </Pressable>
            </View>
          ))}
          {pickedUris.map((uri) => (
            <View key={uri} style={styles.thumbWrapper}>
              <Image source={{ uri }} style={styles.thumb} />
              <Pressable
                style={styles.removeBadge}
                onPress={() => removePickedPhoto(uri)}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
              >
                <Ionicons name="close" size={14} color={colors.background} />
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.addPhotoTile} onPress={handlePickPhotos}>
            <Ionicons name="images-outline" size={24} color={colors.gold} />
            <Text style={styles.addPhotoLabel}>{totalPhotoCount ? 'Add more' : 'Select photos'}</Text>
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
        <Pressable
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
          accessibilityRole="button"
          accessibilityLabel={`Date: ${date.toDateString()}. Tap to change.`}
        >
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
          label={saving ? 'Saving...' : isEditing ? 'Update Memory' : 'Save Memory'}
          onPress={handleSave}
          disabled={!canSave}
          style={styles.saveButton}
        />
        {missingHint ? <Text style={styles.hint}>{missingHint}</Text> : null}
      </ScrollView>
      </KeyboardAvoidingView>
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
  hint: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
