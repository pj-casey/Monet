/**
 * MonetWordmark — living, breathing wordmark that reflects app activity.
 *
 * Uses Fraunces variable font axes (wght, opsz) to animate the "Monet"
 * wordmark based on the current activity state. Each letter is wrapped
 * in a <span> with a --i index for staggered wave animations.
 *
 * States: idle (subtle breathing), loading (gentle wave), processing
 * (stronger wave + glow), success (flash + settle), error (danger flash).
 */

import { useActivityStore } from '../stores/activity-store';

const LETTERS = ['M', 'o', 'n', 'e', 't'];

export function MonetWordmark() {
  const activity = useActivityStore((s) => s.activity);

  const stateClass =
    activity === 'loading'    ? 'wordmark-loading' :
    activity === 'processing' ? 'wordmark-processing' :
    activity === 'success'    ? 'wordmark-success' :
    activity === 'error'      ? 'wordmark-error' :
                                'wordmark-idle';

  return (
    <span
      className={`monet-wordmark inline-flex select-none font-display text-base font-semibold text-text-primary ${stateClass}`}
      aria-label="Monet"
    >
      {LETTERS.map((letter, i) => (
        <span
          key={i}
          className="monet-letter inline-block"
          style={{ '--i': i } as React.CSSProperties}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
