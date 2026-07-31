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
import { usePlaces } from '@/hooks/usePlaces';
import type { Place } from '@/types';
import { showAlert } from '@/utils/alert';
import { goBack } from '@/utils/navigation';

/** The places we've been together — a simple, numbered, editable list. */
export default function Places() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { places, loading, deletePlace } = usePlaces();

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/places/add');
  };

  const handleDelete = (place: Place) => {
    showAlert(`Remove ${place.name}?`, 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          deletePlace(place.id);
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
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Places We&apos;ve Been</Text>
            <Text style={styles.subtitle}>
              {loading ? 'Loading...' : "Every place we've gone together, since the wedding."}
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Ionicons name="map-outline" size={32} color={colors.textMuted} />
              <Text style={styles.emptyText}>No places yet — tap + to add your first one.</Text>
            </View>
          )
        }
        renderItem={({ item, index }) => (
          <Card style={styles.placeCard}>
            <View style={styles.placeRow}>
              <Text style={styles.placeNumber}>{index + 1}.</Text>
              <View style={styles.placeText}>
                <Text style={styles.placeName}>{item.name}</Text>
                {item.note ? <Text style={styles.placeNote}>{item.note}</Text> : null}
              </View>
              <Pressable
                onPress={() => handleDelete(item)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.name}`}
              >
                <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </Card>
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={handleAdd}
        accessibilityRole="button"
        accessibilityLabel="Add place"
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
    placeCard: {
      padding: spacing.md,
    },
    placeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    placeNumber: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.md,
      color: colors.pinkAccent,
      minWidth: 24,
    },
    placeText: {
      flex: 1,
      gap: 2,
    },
    placeName: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.md,
      color: colors.cream,
    },
    placeNote: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
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
