// The five layers as a Warp Carousel ring (components/ui/warp-carousel.tsx).
// The ring is decoration: the layer names, descriptions and links live in the
// HTML list beside it in index.astro, so search engines and screen readers read
// those. On pinned desktop (html.motion) scroll through [data-act="path"] picks
// the front card, and dragging the ring scrolls the page to match. Elsewhere it
// turns on a slow timer. Each change is announced to the page with a
// `layer-change` event so the HTML list can highlight the same layer.
import * as React from 'react';
import { WarpCarousel, type WarpCard } from './ui/warp-carousel';

const cards: WarpCard[] = [
  {
    title: 'Your\nsystems', value: '01', footer: 'Email · CRM · ERP · helpdesk', detail: 'wave',
    mesh: ['#04101f', '#061a33', '#0a2a52', '#0f3d7a', '#1a5bb0', '#2583db', '#0b2347', '#061a33', '#030b16'],
    numeral: ['#ffffff', '#8cc2f7'], accent: '#8cc2f7', glow: '#2583db',
  },
  {
    title: 'Knowledge\nand data', value: '02', footer: 'Answers with the source', detail: 'ring',
    mesh: ['#03181b', '#052326', '#0a3c42', '#0f6b72', '#16a3b0', '#5fd0d6', '#0b3b40', '#052326', '#021012'],
    numeral: ['#ffffff', '#5fd0d6'], accent: '#5fd0d6', glow: '#16a3b0',
  },
  {
    title: 'The AI\nlayer', value: '03', footer: 'Reads, drafts, checks, routes', detail: 'cross', labels: ['Agent', 'in', 'out'],
    mesh: ['#061a33', '#0a2a52', '#155ba6', '#2583db', '#16a3b0', '#1fa92f', '#0f5a1c', '#082f12', '#04140a'],
    numeral: ['#e9f1f7', '#7fdc8c'], accent: '#8cc2f7', glow: '#16a3b0',
  },
  {
    title: 'Human\nreview', value: '04', footer: 'A person approves', detail: 'none',
    mesh: ['#1e1204', '#2b1a06', '#5a3410', '#9a5306', '#f2b45c', '#ffd99a', '#7a420a', '#3b2208', '#140c03'],
    numeral: ['#fff6e6', '#f2b45c'], accent: '#f2b45c', glow: '#f2b45c',
  },
  {
    title: 'Business\noutcomes', value: '05', footer: 'Every action logged', detail: 'ring',
    mesh: ['#031a08', '#04210c', '#0b4018', '#157f28', '#1fa92f', '#7fdc8c', '#0e5220', '#062a10', '#020f05'],
    numeral: ['#ffffff', '#7fdc8c'], accent: '#7fdc8c', glow: '#1fa92f',
  },
];

const COUNT = cards.length;
const mod = (a: number, n: number) => ((a % n) + n) % n;
const isMotion = () => typeof document !== 'undefined' && document.documentElement.classList.contains('motion');

export default function LayersCarousel() {
  const [motion, setMotion] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const indexRef = React.useRef(0);

  const announce = React.useCallback((i: number) => {
    document.dispatchEvent(new CustomEvent('layer-change', { detail: mod(i, COUNT) }));
  }, []);

  React.useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-act="path"]');
    const update = () => {
      const m = isMotion();
      setMotion(m);
      if (!m || !section) return;
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      const next = Math.round(p * (COUNT - 1));
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
        announce(next);
      }
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => {
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
    };
  }, [announce]);

  // Dragging or clicking the ring while pinned: move the page to that layer's scroll position.
  const onPinnedChange = React.useCallback((i: number) => {
    const section = document.querySelector<HTMLElement>('[data-act="path"]');
    if (!section) return;
    // The ring reports indexes modulo five; ignore a wrap from the last layer to the first.
    if (Math.abs(i - indexRef.current) > COUNT / 2) return;
    const top = section.getBoundingClientRect().top + scrollY;
    const span = section.offsetHeight - innerHeight;
    const target = Math.min(COUNT - 1, Math.max(0, i));
    scrollTo({ top: top + span * (target / (COUNT - 1)), behavior: 'smooth' });
  }, []);

  const common = {
    cards,
    background: '#0c1826',
    font: '"Newsreader", "Iowan Old Style", Georgia, serif',
    ariaLabel: 'The five layers of a Moksh AI build',
    style: { width: '100%', height: '100%', minHeight: 360, borderRadius: 20, cursor: 'grab' } as React.CSSProperties,
  };

  return motion ? (
    <WarpCarousel {...common} index={index} autoplay={false} onIndexChange={onPinnedChange} />
  ) : (
    <WarpCarousel {...common} autoplay step={1} interval={4} onIndexChange={announce} />
  );
}
