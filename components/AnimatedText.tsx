import type { TextStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { duration as durationTokens } from '@/constants/animation';

type Props = {
  text: string;
  style?: TextStyle | TextStyle[];
  /**
   * 'fade': the whole string fades in/out as one block.
   * 'sequence': reveals word by word. Word-level, not character-level —
   * a per-character reveal risks slicing a Bangla conjunct or matra mid-glyph
   * (SPEC.md Section 35), so word boundaries are the smallest safe unit.
   */
  mode?: 'fade' | 'sequence';
  delay?: number;
  wordStagger?: number;
  fadeDuration?: number;
  exitDuration?: number;
  onRevealComplete?: () => void;
};

/**
 * Mount this with a unique `key` per phrase (e.g. key={phraseId}) so React
 * treats each phrase as a distinct instance — Reanimated's entering/exiting
 * animations only fire on actual mount/unmount, not on text prop changes.
 */
export function AnimatedText({
  text,
  style,
  mode = 'fade',
  delay = 0,
  wordStagger = 220,
  fadeDuration = durationTokens.slow,
  exitDuration = durationTokens.base,
  onRevealComplete,
}: Props) {
  if (mode === 'fade') {
    return (
      <Animated.Text
        style={style}
        entering={FadeIn.delay(delay)
          .duration(fadeDuration)
          .withCallback((finished) => {
            if (finished && onRevealComplete) onRevealComplete();
          })}
        exiting={FadeOut.duration(exitDuration)}
      >
        {text}
      </Animated.Text>
    );
  }

  const words = text.split(' ');

  return (
    <Animated.Text style={style} exiting={FadeOut.duration(exitDuration)}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        const wordDelay = delay + index * wordStagger;
        return (
          <Animated.Text
            key={`${word}-${index}`}
            entering={FadeIn.delay(wordDelay)
              .duration(fadeDuration)
              .withCallback((finished) => {
                if (finished && isLast && onRevealComplete) onRevealComplete();
              })}
          >
            {word}
            {isLast ? '' : ' '}
          </Animated.Text>
        );
      })}
    </Animated.Text>
  );
}
