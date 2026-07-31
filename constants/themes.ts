/**
 * Theme system — same token shape as the original SPEC.md Section 7 palette
 * (constants/colors.ts), but selectable at runtime via ThemeContext. Every
 * theme below defines the exact same keys so every existing consumer keeps
 * working no matter which one is active.
 */
export type ThemeColors = {
  background: string;
  backgroundElevated: string;
  surface: string;
  midnight: string;
  burgundy: string;
  deepRed: string;
  gold: string;
  cream: string;
  pinkAccent: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  border: string;
  overlay: string;

  success: string;
  error: string;
};

export type ThemeId =
  'pinkRomance' | 'roseGold' | 'wineCream' | 'midnightElegance' | 'blushMinimal';

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  description: string;
  /** Small swatch trio for the picker UI: [background, primary accent, secondary accent]. */
  swatch: [string, string, string];
  colors: ThemeColors;
};

export const DEFAULT_THEME_ID: ThemeId = 'pinkRomance';

export const themes: Record<ThemeId, ThemeDefinition> = {
  pinkRomance: {
    id: 'pinkRomance',
    label: 'Pink Romance',
    description: 'Pure monochrome pink — every tone, from deep magenta to blush, nothing else.',
    swatch: ['#A30F47', '#FF7FB8', '#FFEFF6'],
    colors: {
      background: '#A30F47',
      backgroundElevated: '#D4176B',
      surface: '#BF1259',
      midnight: '#5C0928',
      burgundy: '#8A0F3D',
      deepRed: '#7A0B36',
      gold: '#FFB0D2',
      cream: '#FFEFF6',
      pinkAccent: '#FF7FB8',

      textPrimary: '#FFEFF6',
      textSecondary: 'rgba(255, 239, 246, 0.8)',
      textMuted: 'rgba(255, 239, 246, 0.6)',

      border: 'rgba(255, 127, 184, 0.35)',
      overlay: 'rgba(92, 9, 40, 0.6)',

      success: '#5FE39A',
      error: '#FFB84D',
    },
  },
  roseGold: {
    id: 'roseGold',
    label: 'Rose Gold',
    description: 'Blush and champagne gold — soft, elegant, refined.',
    swatch: ['#1A130F', '#E8A0A0', '#D9A566'],
    colors: {
      background: '#1A130F',
      backgroundElevated: '#251B15',
      surface: '#2E221A',
      midnight: '#1D1611',
      burgundy: '#6E3327',
      deepRed: '#8A4230',
      gold: '#D9A566',
      cream: '#F5E6D8',
      pinkAccent: '#E8A0A0',

      textPrimary: '#F5E6D8',
      textSecondary: 'rgba(245, 230, 216, 0.65)',
      textMuted: 'rgba(245, 230, 216, 0.4)',

      border: 'rgba(217, 165, 102, 0.2)',
      overlay: 'rgba(0, 0, 0, 0.55)',

      success: '#8CAE87',
      error: '#C4676F',
    },
  },
  wineCream: {
    id: 'wineCream',
    label: 'Wine & Cream',
    description: 'The original luxury cinematic palette — burgundy and gold.',
    swatch: ['#0B0A0D', '#D8B26A', '#E7A9B4'],
    colors: {
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
    },
  },
  midnightElegance: {
    id: 'midnightElegance',
    label: 'Midnight Elegance',
    description: 'Deep indigo night with icy lavender-pink accents.',
    swatch: ['#0A0A16', '#C79AE8', '#8FB2E8'],
    colors: {
      background: '#0A0A16',
      backgroundElevated: '#141428',
      surface: '#1C1C34',
      midnight: '#0F0F22',
      burgundy: '#3C2A6E',
      deepRed: '#4B2E78',
      gold: '#8FB2E8',
      cream: '#EDEAF9',
      pinkAccent: '#C79AE8',

      textPrimary: '#EDEAF9',
      textSecondary: 'rgba(237, 234, 249, 0.65)',
      textMuted: 'rgba(237, 234, 249, 0.4)',

      border: 'rgba(199, 154, 232, 0.2)',
      overlay: 'rgba(0, 0, 0, 0.6)',

      success: '#7FAE9C',
      error: '#C4677E',
    },
  },
  blushMinimal: {
    id: 'blushMinimal',
    label: 'Blush Minimal',
    description: 'Soft, quiet, understated blush tones — least ornate.',
    swatch: ['#180F12', '#F4B8C6', '#E3B7A0'],
    colors: {
      background: '#180F12',
      backgroundElevated: '#20161A',
      surface: '#291D22',
      midnight: '#1B1215',
      burgundy: '#69283A',
      deepRed: '#7F3245',
      gold: '#E3B7A0',
      cream: '#FAF0EC',
      pinkAccent: '#F4B8C6',

      textPrimary: '#FAF0EC',
      textSecondary: 'rgba(250, 240, 236, 0.65)',
      textMuted: 'rgba(250, 240, 236, 0.4)',

      border: 'rgba(244, 184, 198, 0.18)',
      overlay: 'rgba(0, 0, 0, 0.5)',

      success: '#7FAE8C',
      error: '#C4676F',
    },
  },
};

export const themeList: ThemeDefinition[] = Object.values(themes);
