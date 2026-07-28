import { Alert, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { ScreenContainer } from '@/components/ScreenContainer';
import { Timeline } from '@/components/Timeline';
import { colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { useStoryTimeline } from '@/hooks/useStoryTimeline';

export default function Story() {
  const { events, deleteEvent } = useStoryTimeline();

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/story/add');
  };

  const handleEdit = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push({ pathname: '/story/add', params: { id } });
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Alert.alert('Delete this moment?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(id) },
    ]);
  };

  return (
    <ScreenContainer style={styles.container}>
      <Timeline events={events} onEditEvent={handleEdit} onDeleteEvent={handleDelete} />
      <Pressable
        style={styles.fab}
        onPress={handleAdd}
        accessibilityRole="button"
        accessibilityLabel="Add a moment"
      >
        <Ionicons name="add" size={26} color={colors.background} />
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
