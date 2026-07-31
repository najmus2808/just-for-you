import { CinematicIntro } from '@/components/CinematicIntro';
import { goBack } from '@/utils/navigation';

/** Lets the intro be watched again from More, without touching the first-launch flag. */
export default function ReplayIntro() {
  return <CinematicIntro onComplete={() => goBack()} />;
}
