import { useEffect, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import type { ThemeColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/spacing';
import { fontFamily, fontSize } from '@/constants/typography';
import type { Song } from '@/types';

type Props = {
  song: Song;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

/** A minimal, beautiful offline player — one per song (SPEC.md Section 19). */
export function MusicPlayer({ song }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const player = useAudioPlayer(song.audioAsset ?? null);
  const status = useAudioPlayerStatus(player);
  const spin = useSharedValue(0);

  // `status` updates continuously while playing (to drive the progress bar),
  // which re-renders this component many times a second. Re-assigning
  // withRepeat() on every one of those renders restarted the spin from
  // scratch each time, so it stuttered instead of rotating smoothly — keying
  // this off `status.playing` alone means it only (re)starts when playback
  // actually toggles.
  useEffect(() => {
    if (status.playing) {
      spin.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false);
    } else {
      spin.value = withTiming(spin.value, { duration: 0 });
    }
  }, [status.playing, spin]);

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Animated.View style={[styles.disc, discStyle]}>
          <Ionicons name="musical-notes" size={22} color={colors.gold} />
        </Animated.View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <Button
          label={status.playing ? 'Pause' : 'Play'}
          onPress={handleToggle}
          variant="ghost"
          disabled={!status.isLoaded}
          style={styles.playButton}
        />
      </View>

      {status.isLoaded ? (
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 1) * 100}%` }]} />
          </View>
          <Text style={styles.time}>
            {formatTime(status.currentTime)} / {formatTime(status.duration)}
          </Text>
        </View>
      ) : (
        <Text style={styles.notLoaded}>Audio coming soon</Text>
      )}

      <Text style={styles.reason}>{song.reason}</Text>
    </Card>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    disc: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.midnight,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    info: {
      flex: 1,
    },
    title: {
      fontFamily: fontFamily.serifSemiBold,
      fontSize: fontSize.md,
      color: colors.cream,
    },
    artist: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    playButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    progressTrack: {
      flex: 1,
      height: 3,
      borderRadius: radius.pill,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.gold,
    },
    time: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    notLoaded: {
      fontFamily: fontFamily.sansRegular,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
    reason: {
      fontFamily: fontFamily.banglaRegular,
      fontSize: fontSize.sm,
      lineHeight: fontSize.sm * 1.6,
      color: colors.textSecondary,
    },
  });
