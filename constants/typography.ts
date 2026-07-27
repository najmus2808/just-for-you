/**
 * Font tokens loaded by hooks/useAppFonts.ts. Split by language because the
 * app deliberately mixes English (UI, cinematic phrases) and Bangla
 * (personal, emotional content) per SPEC.md Section 35 — the right family
 * depends on which language a given string is actually written in, not on
 * the screen it appears on.
 */
export const fontFamily = {
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  sansRegular: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  script: 'GreatVibes_400Regular',

  banglaRegular: 'HindSiliguri_400Regular',
  banglaMedium: 'HindSiliguri_500Medium',
  banglaSemiBold: 'HindSiliguri_600SemiBold',
  banglaSerifMedium: 'NotoSerifBengali_500Medium',
  banglaSerifSemiBold: 'NotoSerifBengali_600SemiBold',
  banglaSerifBold: 'NotoSerifBengali_700Bold',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 34,
  display: 44,
} as const;

export const lineHeight = {
  tight: 1.15,
  normal: 1.4,
  relaxed: 1.7,
} as const;
