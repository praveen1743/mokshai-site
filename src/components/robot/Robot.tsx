import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import type * as THREE from 'three';
import { RobotController, type Clip, type ControllerOptions, type Gesture } from './robotController';

export const ROBOT_URL = '/models/moksh-robot.glb';
export type { Gesture };

export interface RobotProps extends ControllerOptions {
  /** Called once the first posed frame has rendered. */
  onReady?: () => void;
  /** Lets the page (CTA buttons) ask for a gesture. */
  gestureRef?: React.RefObject<((g: Gesture) => void) | null>;
}

export function Robot({ lite, still, onReady, gestureRef }: RobotProps) {
  const group = useRef<THREE.Group>(null);
  // Meshopt-compressed GLB; Draco off, so drei never fetches a decoder from a CDN.
  const { scene, animations } = useGLTF(ROBOT_URL, false, true);
  // drei binds the clips to the model and advances the mixer every frame.
  const { actions, mixer } = useAnimations(animations, group);
  const ctl = useRef<RobotController | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const announced = useRef(false);

  useEffect(() => {
    const c = new RobotController(scene, mixer, actions as Partial<Record<Clip, THREE.AnimationAction | null>>, { lite, still });
    c.start();
    ctl.current = c;
    // On-demand rendering (reduced motion) needs an explicit frame once the pose is set.
    invalidate();
    if (gestureRef) gestureRef.current = (g) => c.gesture(g);
    return () => {
      if (gestureRef) gestureRef.current = null;
      ctl.current = null;
      c.dispose();
      useGLTF.clear(ROBOT_URL);
    };
  }, [scene, mixer, actions, lite, still, gestureRef, invalidate]);

  // Registered after useAnimations, so it runs after the mixer has posed the rig.
  useFrame((_, delta) => {
    ctl.current?.update(delta);
    if (!announced.current && ctl.current) {
      announced.current = true;
      onReady?.();
    }
  });

  return (
    // Desktop: right of centre, leaving room for the Present gesture towards the headline.
    <group ref={group} position={[lite ? 0 : 0.22, -0.02, 0]} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
