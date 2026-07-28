import { useCallback } from 'react';
import { router } from 'expo-router';

import { CinematicIntro } from '@/components/CinematicIntro';

/** Root entry point — the cinematic intro plays on every fresh app open, then hands off to Home. */
export default function Index() {
  const handleIntroComplete = useCallback(() => {
    router.replace('/home');
  }, []);

  return <CinematicIntro onComplete={handleIntroComplete} />;
}
