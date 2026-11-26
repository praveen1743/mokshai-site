// Site-wide smooth scrolling (Lenis). Wheel and trackpad scrolling gets a short
// eased glide instead of jumping by the wheel step; touch scrolling stays
// native. Off for visitors who ask for reduced motion. Pages that animate on
// scroll (the homepage) read the instance from `window.mokshLenis` and keep
// GSAP ScrollTrigger in step with it.
import Lenis from 'lenis';

declare global {
  interface Window { mokshLenis?: Lenis }
}

export function startSmoothScroll(): Lenis | undefined {
  if (typeof window === 'undefined' || window.mokshLenis) return window.mokshLenis;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: { offset: -84 }, autoRaf: true });
  window.mokshLenis = lenis;
  return lenis;
}
