import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Gesture } from './Robot';

// three.js, R3F and the model load in their own chunk, only after this island
// hydrates (client:idle) and only where WebGL exists.
const RobotScene = lazy(() => import('./RobotScene'));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

interface Env { gl: boolean; lite: boolean; still: boolean }
let cachedEnv: Env | null = null;
// Read once on the client; the server snapshot is null, so hydration matches.
const readEnv = () => (cachedEnv ??= {
  gl: hasWebGL(),
  lite: !matchMedia('(pointer: fine) and (min-width: 761px)').matches,
  still: matchMedia('(prefers-reduced-motion: reduce)').matches,
});
const noSubscribe = () => () => {};

/**
 * Mounts the robot over the static poster in RobotHero.astro. The poster stays
 * for no-WebGL visitors and until the first 3D frame is drawn.
 */
export default function RobotIsland() {
  const env = useSyncExternalStore(noSubscribe, readEnv, () => null);
  const [active, setActive] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<((g: Gesture) => void) | null>(null);

  // Pause rendering off screen and in background tabs.
  useEffect(() => {
    const el = host.current?.closest<HTMLElement>('[data-robot-hero]');
    if (!el) return;
    let onScreen = true;
    const update = () => setActive(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update(); });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [env]);

  // CTA buttons in the hero ask for a gesture: data-robot="Approve" | "Present".
  useEffect(() => {
    if (!env?.gl || env.still) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-robot]'));
    const handlers = targets.map((t) => {
      const fn = () => gestureRef.current?.(t.dataset.robot as Gesture);
      t.addEventListener('pointerenter', fn);
      t.addEventListener('focus', fn);
      return () => { t.removeEventListener('pointerenter', fn); t.removeEventListener('focus', fn); };
    });
    return () => handlers.forEach((off) => off());
  }, [env]);

  const ready = () => host.current?.closest('[data-robot-hero]')?.classList.add('is-live');

  return (
    <div ref={host} className="robot-canvas">
      {env?.gl && (
        <Suspense fallback={null}>
          <RobotScene active={active} lite={env.lite} still={env.still} onReady={ready} gestureRef={gestureRef} />
        </Suspense>
      )}
    </div>
  );
}
