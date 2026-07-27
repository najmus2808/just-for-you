import { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

import { CinematicIntro } from '@/components/CinematicIntro';
import { colors } from '@/constants/colors';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';

/**
 * Root entry point. First launch: play the cinematic intro, then remember
 * it's been seen so later opens go straight to Home instead of replaying
 * the surprise every time.
 */
export default function Index() {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const seen = await getItem<boolean>(STORAGE_KEYS.hasSeenIntro);
      if (cancelled) return;
      if (seen) {
        router.replace('/home');
      } else {
        setShowIntro(true);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleIntroComplete = useCallback(() => {
    void setItem(STORAGE_KEYS.hasSeenIntro, true);
    router.replace('/home');
  }, []);

  if (!ready || !showIntro) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return <CinematicIntro onComplete={handleIntroComplete} />;
}
