'use client';

import { useCallback } from 'react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

/*
 * The Lux Fidei candle (candle.lottie), played as Lux Fidei plays it: looped,
 * autoplaying, with @lottiefiles/dotlottie-react. Loaded only in the browser,
 * and only when motion is welcome; `onReady` fires once the first frame is
 * drawn so the still frame beneath can step aside.
 */

export default function LiveFlame({ className, onReady }: { className?: string; onReady?: () => void }) {
  const ref = useCallback(
    (player: DotLottie | null) => {
      if (!player || !onReady) return;
      if (player.isLoaded) onReady();
      else player.addEventListener('load', () => onReady());
    },
    [onReady],
  );

  return (
    <DotLottieReact
      className={className}
      src="/exhibitions/great-war/candle.lottie"
      loop
      autoplay
      dotLottieRefCallback={ref}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
