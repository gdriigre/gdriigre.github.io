'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import './gooey-nav.css';

type NavItem = { label: string; href: string };
type Particle = { id: number; style: CSSProperties };
const items: NavItem[] = [
  { label: '首页', href: '#home' },
  { label: '创作方向', href: '#creative' },
  { label: '作品', href: '#projects' },
  { label: '关于我', href: '#about' },
  { label: '联系我', href: '#contact' },
];
const animationTime = 600;
const timeVariance = 300;
const particleCount = 15;
const colors = [1, 2, 3, 1, 2, 3, 1, 4];
const noise = (n = 1) => n / 2 - Math.random() * n;
function getXY(distance: number, index: number) {
  const angle = ((360 + noise(8)) / particleCount) * index * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
}

export default function GooeyNav() {
  const containerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstRef = useRef(0);
  const reducedMotion = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [box, setBox] = useState<CSSProperties | null>(null);
  const [effectKey, setEffectKey] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const filterId = `nav-goo-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches) {
        setParticles([]);
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };
    const syncHash = () => {
      const index = items.findIndex(item => item.href === window.location.hash);
      setActiveIndex(index < 0 ? 0 : index);
    };
    updatePreference();
    syncHash();
    preference.addEventListener('change', updatePreference);
    window.addEventListener('hashchange', syncHash);
    return () => {
      preference.removeEventListener('change', updatePreference);
      window.removeEventListener('hashchange', syncHash);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    const updateEffectPosition = () => {
      if (disposed) return;
      const container = containerRef.current;
      const link = linksRef.current[activeIndex];
      if (!container || !link) return;
      const root = container.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      setBox({ left: rect.left - root.left, top: rect.top - root.top, width: rect.width, height: rect.height });
    };
    updateEffectPosition();
    const observer = new ResizeObserver(updateEffectPosition);
    if (containerRef.current) observer.observe(containerRef.current);
    linksRef.current.forEach(link => { if (link) observer.observe(link); });
    window.addEventListener('resize', updateEffectPosition);
    document.fonts.ready.then(updateEffectPosition).catch(() => {});
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', updateEffectPosition);
    };
  }, [activeIndex]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, index: number) {
    // Leave modified clicks and native anchor navigation intact.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (activeIndex === index) return;

    const container = containerRef.current;
    if (container) {
      const root = container.getBoundingClientRect();
      const rect = event.currentTarget.getBoundingClientRect();
      setBox({
        left: rect.left - root.left,
        top: rect.top - root.top,
        width: rect.width,
        height: rect.height,
      });
    }

    setActiveIndex(index);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (reducedMotion.current) { setParticles([]); return; }
    const burst = ++burstRef.current;
    setEffectKey(burst);
    setParticles(Array.from({ length: particleCount }, (_, i) => {
      const start = getXY(90, particleCount - i);
      const end = getXY(10 + noise(7), particleCount - i);
      const rotate = noise(10);
      return {
        id: burst * particleCount + i,
        style: {
          '--start-x': `${start[0]}px`, '--start-y': `${start[1]}px`,
          '--end-x': `${end[0]}px`, '--end-y': `${end[1]}px`,
          '--time': `${animationTime * 2 + noise(timeVariance * 2)}ms`,
          '--scale': 1 + noise(0.2),
          '--color': `var(--goo-color-${colors[Math.floor(Math.random() * colors.length)]})`,
          '--rotate': `${rotate > 0 ? (rotate + 5) * 10 : (rotate - 5) * 10}deg`,
        } as CSSProperties,
      };
    }));
    timerRef.current = setTimeout(() => setParticles([]), animationTime * 2 + timeVariance);
  }

  return (
    <nav ref={containerRef} className="main-nav gooey-nav-container" aria-label="主导航">
      <svg className="gooey-nav-filter-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} x="-150%" y="-300%" width="400%" height="700%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7" />
          </filter>
        </defs>
      </svg>
      <span key={effectKey} className="gooey-effect" aria-hidden="true" style={{ ...box, opacity: box ? 1 : 0, filter: `url(#${filterId})` }}>
        <span className="gooey-pill" />
        {particles.map(particle => <span key={particle.id} className="gooey-particle" style={particle.style}><span className="gooey-point" /></span>)}
      </span>
      <ul>
        {items.map((item, index) => (
          <li key={item.href} className={activeIndex === index ? 'active' : ''}>
            <a ref={element => { linksRef.current[index] = element; }} href={item.href}
              aria-current={activeIndex === index ? 'location' : undefined}
              onClick={event => handleClick(event, index)}
              onKeyDown={event => { if (event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
