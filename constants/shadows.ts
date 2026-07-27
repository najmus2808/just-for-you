import type { ViewStyle } from 'react-native';

/**
 * Native shadow props render on iOS; Android only respects `elevation`
 * (and renders it as a flat grey, not a colored glow). Colored glow effects
 * are built separately with layered gradients/blur, not with these tokens.
 */
export const shadows: Record<'soft' | 'card' | 'floating', ViewStyle> = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 10,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 16,
  },
};
