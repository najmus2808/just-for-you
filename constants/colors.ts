/**
 * Core palette — "luxury romantic cinematic" direction from SPEC.md Section 7.
 * Deep dark base, warm gold/cream accents, burgundy warmth, restrained pink.
 * Phase 1 builds the full design system (shadows, gradients, component tokens)
 * on top of these.
 */
export const colors = {
  background: '#0B0A0D',
  backgroundElevated: '#16131A',
  surface: '#1E1A24',
  midnight: '#181420',
  burgundy: '#5C1A2B',
  deepRed: '#7A1F2B',
  gold: '#D8B26A',
  cream: '#F3E9DA',
  pinkAccent: '#E7A9B4',

  textPrimary: '#F3E9DA',
  textSecondary: 'rgba(243, 233, 218, 0.65)',
  textMuted: 'rgba(243, 233, 218, 0.4)',

  border: 'rgba(216, 178, 106, 0.18)',
  overlay: 'rgba(0, 0, 0, 0.55)',

  success: '#7FAE8C',
  error: '#C4676F',
} as const;

export type ColorToken = keyof typeof colors;
