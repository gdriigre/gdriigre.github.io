'use client';

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './stroke-text.css';

type StrokeTextProps = {
  text: string;
  className?: string;
  strokeColor?: string;
  fillColor?: string;
  accentColor?: string;
  accentLast?: boolean;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  delay?: number;
  interactive?: boolean;
};

type TextBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function StrokeText({
  text,
  className = '',
  strokeColor = '#a957ce',
  fillColor = '#292b32',
  accentColor = '#b95dde',
  accentLast = false,
  strokeWidth = 1.2,
  drawDuration = 1.15,
  fillDelay = 0.12,
  stagger = 0.045,
  delay = 0,
  interactive = false,
}: StrokeTextProps) {
  const interactiveRootRef = useRef<HTMLButtonElement>(null);
  const staticRootRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const lastReplayAtRef = useRef(Number.NEGATIVE_INFINITY);
  const [box, setBox] = useState<TextBox | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const rawId = useId();
  const clipId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const characters = useMemo(() => Array.from(text), [text]);

  useLayoutEffect(() => {
    const textNode = measureRef.current;
    if (!textNode) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled || !measureRef.current) return;

      const bounds = measureRef.current.getBBox();
      if (!bounds.width || !bounds.height) return;

      const pad = Math.max(strokeWidth * 2, bounds.height * 0.06);
      const nextBox = {
        x: bounds.x - pad,
        y: bounds.y - pad,
        width: bounds.width + pad * 2,
        height: bounds.height + pad * 2,
      };

      setBox((previous) => (
        previous
        && Math.abs(previous.x - nextBox.x) < 0.5
        && Math.abs(previous.y - nextBox.y) < 0.5
        && Math.abs(previous.width - nextBox.width) < 0.5
        && Math.abs(previous.height - nextBox.height) < 0.5
          ? previous
          : nextBox
      ));
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(textNode);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
    };
  }, [characters, replayKey, strokeWidth]);

  useEffect(() => {
    const root = interactive ? interactiveRootRef.current : staticRootRef.current;
    if (!root || !box) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsActive(true);
        observer.disconnect();
      },
      { threshold: 0.28 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [box, interactive]);

  const finalStrokeDelay = delay + Math.max(0, characters.length - 1) * stagger;
  const fillStart = finalStrokeDelay + drawDuration + fillDelay;
  const rootStyle = {
    '--stroke-color': strokeColor,
    '--stroke-fill': fillColor,
    '--stroke-accent': accentColor,
    '--stroke-width': strokeWidth,
    '--stroke-draw-duration': `${drawDuration}s`,
    '--stroke-start-delay': `${delay}s`,
    '--stroke-dash-size': Math.max(1200, characters.length * 160),
    '--stroke-fill-delay': `${fillStart}s`,
    width: box ? `${box.width}px` : undefined,
  } as CSSProperties;

  const textStyle = {
    fontFamily: "Arial, 'Microsoft YaHei', 'PingFang SC', sans-serif",
    fontSize: 'var(--stroke-text-font-size, 72px)',
    fontWeight: 'var(--stroke-text-font-weight, 800)',
    letterSpacing: 'var(--stroke-text-letter-spacing, -2px)',
  } as CSSProperties;

  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : '0 -100 640 140';
  const replayAnimation = () => {
    if (!interactive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const now = window.performance.now();
    if (now - lastReplayAtRef.current < 2400) return;
    lastReplayAtRef.current = now;
    setReplayKey((current) => current + 1);
  };

  const graphic = (
    <svg key={replayKey} className="stroke-text__svg" viewBox={viewBox} preserveAspectRatio="xMinYMid meet">
        {box && (
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <rect className="stroke-text__wipe" x={box.x} y={box.y} width={box.width} height={box.height} />
            </clipPath>
          </defs>
        )}

        <text
          ref={measureRef}
          className="stroke-text__stroke"
          x="0"
          y="0"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={textStyle}
        >
          {characters.map((character, index) => {
            const isAccent = accentLast && index === characters.length - 1;
            return (
              <tspan
                className="stroke-text__stroke-char"
                data-stroke-char
                key={`stroke-${index}`}
                style={{
                  '--stroke-char-delay': `${delay + index * stagger}s`,
                  stroke: isAccent ? accentColor : strokeColor,
                } as CSSProperties}
              >
                {character}
              </tspan>
            );
          })}
        </text>

        <text
          className="stroke-text__fill"
          x="0"
          y="0"
          fill={fillColor}
          stroke="none"
          style={textStyle}
          clipPath={box ? `url(#${clipId})` : undefined}
        >
          {characters.map((character, index) => {
            const isAccent = accentLast && index === characters.length - 1;
            return <tspan key={`fill-${index}`} fill={isAccent ? accentColor : fillColor}>{character}</tspan>;
          })}
        </text>
    </svg>
  );

  const rootClassName = `stroke-text${box ? ' is-measured' : ''}${isActive ? ' is-active' : ''}${interactive ? ' is-interactive' : ''}${className ? ` ${className}` : ''}`;

  if (interactive) {
    return (
      <button
        ref={interactiveRootRef}
        className={rootClassName}
        style={rootStyle}
        type="button"
        aria-label={`重新播放 ${text} 文字动画`}
        title="悬停或点击，重新播放文字动画"
        data-animation-run={replayKey}
        onPointerEnter={replayAnimation}
        onClick={replayAnimation}
      >
        {graphic}
      </button>
    );
  }

  return <span ref={staticRootRef} className={rootClassName} style={rootStyle} data-animation-run={replayKey} aria-hidden="true">{graphic}</span>;
}
