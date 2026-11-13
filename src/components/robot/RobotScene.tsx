import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { Robot, type RobotProps } from './Robot';

interface SceneProps extends RobotProps {
  /** false while the hero is off screen or the tab is hidden: no frames are drawn. */
  active: boolean;
}

/**
 * Transparent WebGL stage for the robot. Lighting is procedural (Lightformers
 * baked into a small environment map once), so nothing is fetched from a CDN.
 */
/** Light colours come from the site's design tokens (src/styles/global.css). */
function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function RobotScene({ active, lite, still, onReady, gestureRef }: SceneProps) {
  const cyan = token('--teal-on-dark');
  const blue = token('--blue');
  const shadow = token('--ink-deep');
  return (
    <Canvas
      // Reduced motion renders on demand (a still); otherwise run while visible.
      frameloop={!active ? 'never' : still ? 'demand' : 'always'}
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: lite ? 'low-power' : 'high-performance' }}
      camera={{ fov: lite ? 20 : 24, position: [0, 1.16, 3.35], near: 0.1, far: 20 }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
        camera.lookAt(0, 1.16, 0);
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.18} />
      {/* key light, front-left, soft and slightly warm-neutral */}
      <directionalLight position={[-2.2, 3.2, 3.6]} intensity={2.2} />
      {/* restrained cyan rim from behind-right, logo teal-blue from behind-left */}
      <spotLight position={[2.4, 2.4, -2.2]} angle={0.5} penumbra={0.9} intensity={34} color={cyan} />
      <spotLight position={[-2.6, 1.6, -2.4]} angle={0.55} penumbra={0.9} intensity={14} color={blue} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[-3, 3, 3]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[3, 1.5, 2]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.4} color={cyan} position={[2, 2, -3]} scale={2.5} />
        <Lightformer form="rect" intensity={0.6} position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Robot lite={lite} still={still} onReady={onReady} gestureRef={gestureRef} />
      </Suspense>
      {!lite && <ContactShadows position={[0.22, 0, 0]} opacity={0.4} scale={2.4} blur={2.4} far={1.2} resolution={256} frames={1} color={shadow} />}
    </Canvas>
  );
}
