import { router } from 'expo-router';

import { CinematicIntro } from '@/components/CinematicIntro';

/** Lets the intro be watched again from More, without touching the first-launch flag. */
export default function ReplayIntro() {
  return <CinematicIntro onComplete={() => router.back()} />;
}
