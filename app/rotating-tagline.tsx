'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './rotating-tagline.css';

const phrases = [
  '把灵感做成作品。',
  '让画面替你说话。',
  '把复杂变得好用。',
  '让创意真正落地。',
];

function splitCharacters(text: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

type PhrasePhase = 'is-current' | 'is-entering' | 'is-leaving';

function Phrase({ text, phase }: { text: string; phase: PhrasePhase }) {
  return (
    <span className={`rotating-tagline-phrase ${phase}`} aria-hidden="true">
      {splitCharacters(text).map((character, index) => (
        <span
          className="rotating-tagline-character"
          key={`${character}-${index}`}
          style={{ '--character-index': index } as CSSProperties}
        >
          {character}
        </span>
      ))}
    </span>
  );
}

export function RotatingTagline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const currentIndexRef = useRef(0);
  const transitionRef = useRef(false);
  const finishTransitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const rotate = () => {
      if (preference.matches || document.hidden || transitionRef.current) return;

      const outgoingIndex = currentIndexRef.current;
      const nextIndex = (outgoingIndex + 1) % phrases.length;
      transitionRef.current = true;
      currentIndexRef.current = nextIndex;
      setPreviousIndex(outgoingIndex);
      setCurrentIndex(nextIndex);

      if (finishTransitionRef.current) clearTimeout(finishTransitionRef.current);
      finishTransitionRef.current = setTimeout(() => {
        setPreviousIndex(null);
        transitionRef.current = false;
      }, 760);
    };

    const intervalId = window.setInterval(rotate, 3200);
    return () => {
      window.clearInterval(intervalId);
      if (finishTransitionRef.current) clearTimeout(finishTransitionRef.current);
    };
  }, []);

  return (
    <h2 className="hero-tagline rotating-tagline">
      <span className="rotating-tagline-accessible">用 AI，{phrases[0]}</span>
      <span className="rotating-tagline-visual" aria-hidden="true">
        <span className="rotating-tagline-prefix">用 AI，</span>
        <span className="rotating-tagline-window">
          {previousIndex !== null && (
            <Phrase
              key={`leaving-${previousIndex}-${currentIndex}`}
              text={phrases[previousIndex]}
              phase="is-leaving"
            />
          )}
          <Phrase
            key={`current-${currentIndex}`}
            text={phrases[currentIndex]}
            phase={previousIndex === null ? 'is-current' : 'is-entering'}
          />
        </span>
      </span>
    </h2>
  );
}
