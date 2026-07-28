import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
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
import { useStoryTimeline } from '@/hooks/useStoryTimeline';

/** Doubles as "Add" and (with an `id` param) "Edit" for a single Our Story moment. */
export default function AddStoryEvent() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const { events, addEvent, editEvent, editEventPhoto } = useStoryTimeline();

  const [existingUri, setExistingUri] = useState<string | null>(null);
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [isMilestone, setIsMilestone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing || prefilled) return;
    const event = events.find((item) => item.id === id);
    if (!event) return;

    (async () => {
      setTitle(event.title);
      setDescription(event.description);
      setIsMilestone(Boolean(event.isMilestone));
      const parsedDate = new Date(`${event.date}T00:00:00`);
      setDate(Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
      if (event.photo && typeof event.photo === 'object' && 'uri' in event.photo && event.photo.uri) {
        setExistingUri(event.photo.uri);
      }
      setPrefilled(true);
    })();
  }, [isEditing, prefilled, events, id]);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPickedUri(result.assets[0].uri);
      setPhotoRemoved(false);
    }
  };

  const removePhoto = () => {
    setExistingUri(null);
    setPickedUri(null);
    setPhotoRemoved(true);
  };

  const canSave = title.trim().length > 0 && description.trim().length > 0 && !saving && prefilled;
  const displayUri = pickedUri ?? existingUri;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const dateString = date.toISOString().slice(0, 10);
      if (isEditing && id) {
        await editEvent(id, { title, date: dateString, description, isMilestone });
        if (pickedUri) {
          await editEventPhoto(id, pickedUri);
        } else if (photoRemoved) {
          await editEventPhoto(id, null);
        }
      } else {
        await addEvent({ title, date: dateString, description, isMilestone, pickedUri: pickedUri ?? undefined });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } catch {
      Alert.alert('Something went wrong', 'This moment could not be saved. Please try again.');
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

        <Text style={styles.title}>{isEditing ? 'Edit Moment' : 'Add a Moment'}</Text>
        <Text style={styles.subtitle}>
          {isEditing ? 'Update this part of our story.' : 'Another point on our timeline.'}
        </Text>

        {displayUri ? (
          <View style={styles.photoWrapper}>
            <Image source={{ uri: displayUri }} style={styles.photo} />
            <Pressable
              style={styles.removeBadge}
              onPress={removePhoto}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <Ionicons name="close" size={14} color={colors.background} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.addPhotoTile} onPress={handlePickPhoto}>
            <Ionicons name="image-outline" size={24} color={colors.gold} />
            <Text style={styles.addPhotoLabel}>Select a photo</Text>
          </Pressable>
        )}
        {displayUri ? (
          <Pressable onPress={handlePickPhoto}>
            <Text style={styles.changePhoto}>Change photo</Text>
          </Pressable>
        ) : null}

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. The Day We Met"
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

        <Text style={styles.label}>Your story</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="What happened, and what did it mean?"
          placeholderTextColor={colors.textMuted}
          multiline
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Mark as a milestone ✨</Text>
          <Switch
            value={isMilestone}
            onValueChange={setIsMilestone}
            trackColor={{ false: colors.surface, true: colors.gold }}
            thumbColor={colors.cream}
          />
        </View>

        <Button
          label={saving ? 'Saving...' : isEditing ? 'Update Moment' : 'Save Moment'}
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
  photoWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  photo: {
    width: 140,
    height: 140,
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
    width: 140,
    height: 140,
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
  changePhoto: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  switchLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    color: colors.cream,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
