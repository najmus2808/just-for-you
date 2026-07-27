import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Gates purely decorative motion (ambient glow, floating particles,
 * confetti) — not the content-carrying reveal animations, which are how
 * the pacing communicates meaning (SPEC.md Section 27).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
