/**
 * Static fallback palette — the default "Pink Romance" theme's colors,
 * for the handful of call sites that run outside React (no ThemeProvider
 * available). Everywhere inside a component should prefer
 * `useTheme().colors` from `@/context/ThemeContext` so the user's chosen
 * theme (constants/themes.ts) applies live.
 */
import { themes } from '@/constants/themes';

export const colors = themes.pinkRomance.colors;

export type ColorToken = keyof typeof colors;
