import { useFonts } from 'expo-font';
// Each font is imported from its specific weight subpath rather than the
// package barrel — the barrel's index.js unconditionally requires every
// weight file in the family, which would bundle weights we never use.
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display/600SemiBold';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display/700Bold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes/400Regular';
import { HindSiliguri_400Regular } from '@expo-google-fonts/hind-siliguri/400Regular';
import { HindSiliguri_500Medium } from '@expo-google-fonts/hind-siliguri/500Medium';
import { HindSiliguri_600SemiBold } from '@expo-google-fonts/hind-siliguri/600SemiBold';
import { NotoSerifBengali_500Medium } from '@expo-google-fonts/noto-serif-bengali/500Medium';
import { NotoSerifBengali_600SemiBold } from '@expo-google-fonts/noto-serif-bengali/600SemiBold';
import { NotoSerifBengali_700Bold } from '@expo-google-fonts/noto-serif-bengali/700Bold';

/**
 * Loads every typeface the design system references (constants/typography.ts).
 * English: Playfair Display (serif headings), Inter (sans UI/body), Great Vibes (script).
 * Bangla: Hind Siliguri (body/UI), Noto Serif Bengali (emotional headings) — both have
 * full conjunct/matra glyph coverage, unlike most non-Bengali-focused fonts.
 */
export function useAppFonts() {
  return useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    GreatVibes_400Regular,
    HindSiliguri_400Regular,
    HindSiliguri_500Medium,
    HindSiliguri_600SemiBold,
    NotoSerifBengali_500Medium,
    NotoSerifBengali_600SemiBold,
    NotoSerifBengali_700Bold,
  });
}
