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

function Phrase({ text, phase }: { text: string; phase: 'is-entering' | 'is-leaving' }) {
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
  const [phase, setPhase] = useState<'is-entering' | 'is-leaving'>('is-entering');
  const currentIndexRef = useRef(0);
  const switchPhraseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const rotate = () => {
      if (preference.matches || document.hidden) return;

      setPhase('is-leaving');
      if (switchPhraseRef.current) clearTimeout(switchPhraseRef.current);
      switchPhraseRef.current = setTimeout(() => {
        const previousIndex = currentIndexRef.current;
        const offset = 1 + Math.floor(Math.random() * (phrases.length - 1));
        const nextIndex = (previousIndex + offset) % phrases.length;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        setPhase('is-entering');
      }, 560);
    };

    const intervalId = window.setInterval(rotate, 2800);
    return () => {
      window.clearInterval(intervalId);
      if (switchPhraseRef.current) clearTimeout(switchPhraseRef.current);
    };
  }, []);

  return (
    <h2 className="hero-tagline rotating-tagline">
      <span className="rotating-tagline-accessible">用 AI，{phrases[0]}</span>
      <span className="rotating-tagline-visual" aria-hidden="true">
        <span className="rotating-tagline-prefix">用 AI，</span>
        <span className="rotating-tagline-window">
          <Phrase key={currentIndex} text={phrases[currentIndex]} phase={phase} />
        </span>
      </span>
    </h2>
  );
}
