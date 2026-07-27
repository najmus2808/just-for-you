import { Easing } from 'react-native-reanimated';

/**
 * Shared timing tokens so pacing stays consistent across every screen.
 * "Every animation should have a purpose" (SPEC.md Section 6) — reach for
 * these instead of picking new numbers per component.
 */
export const duration = {
  fast: 200,
  base: 350,
  slow: 600,
  cinematic: 1000,
} as const;

export const easing = {
  standard: Easing.out(Easing.cubic),
  emphasized: Easing.bezier(0.16, 1, 0.3, 1),
  linear: Easing.linear,
} as const;
