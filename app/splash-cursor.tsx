'use client';

import { useEffect, useRef } from 'react';
import { startSplash } from './splash-fluid.js';

export default function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const printMedia = window.matchMedia('print');
    let stop: (() => void) | undefined;

    function synchronize() {
      stop?.();
      stop = undefined;
      if (reducedMotion.matches || printMedia.matches) return;
      try {
        stop = startSplash(canvas);
      } catch {
        // Decorative animation must never prevent reading or using the résumé.
        if (canvas) canvas.style.opacity = '0';
      }
    }

    synchronize();
    reducedMotion.addEventListener('change', synchronize);
    printMedia.addEventListener('change', synchronize);
    return () => {
      reducedMotion.removeEventListener('change', synchronize);
      printMedia.removeEventListener('change', synchronize);
      stop?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="splash-cursor" aria-hidden="true" />;
}
