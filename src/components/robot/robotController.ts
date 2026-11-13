import * as THREE from 'three';

/** Clip names authored in scripts/blender/build_robot.py. */
export type Clip = 'Idle' | 'Float' | 'HeadLook' | 'Blink' | 'Present' | 'Approve';
export type Gesture = 'Present' | 'Approve';

export interface ControllerOptions {
  /** Mobile: no cursor tracking, no idle head look-around. */
  lite: boolean;
  /** prefers-reduced-motion: hold one still pose, no clips run. */
  still: boolean;
}

const UP = new THREE.Vector3(0, 1, 0);
const SIDE = new THREE.Vector3(1, 0, 0);
const LOOK_WEIGHT = 0.6;

/**
 * Drives the robot's authored clips (from drei's useAnimations) and layers
 * cursor tracking on top. Kept outside React: everything here mutates three.js
 * objects every frame.
 */
export class RobotController {
  private readonly timers: number[] = [];
  private busy = false;
  private readonly pointer = new THREE.Vector2();
  private readonly aim = new THREE.Vector2();
  private readonly q = new THREE.Quaternion();
  private readonly qy = new THREE.Quaternion();
  private readonly qx = new THREE.Quaternion();
  private readonly pw = new THREE.Quaternion();
  private readonly w = new THREE.Quaternion();
  // What the clip left on each bone, and what we wrote on top. If no clip wrote
  // the bone this frame, the clip pose is restored first so offsets never accumulate.
  private readonly memo = new Map<THREE.Object3D, { base: THREE.Quaternion; written: THREE.Quaternion }>();
  private readonly head?: THREE.Object3D;
  private readonly neck?: THREE.Object3D;
  private readonly onPointer = (e: PointerEvent) => {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  };

  constructor(
    private readonly root: THREE.Object3D,
    private readonly mixer: THREE.AnimationMixer,
    private readonly actions: Partial<Record<Clip, THREE.AnimationAction | null>>,
    private readonly opts: ControllerOptions,
  ) {
    this.head = root.getObjectByName('Head');
    this.neck = root.getObjectByName('Neck');
    // Skinned meshes move outside their bind-pose bounds; skip culling so a
    // raised arm never disappears at the canvas edge.
    root.traverse((o) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh) o.frustumCulled = false;
    });
  }

  start() {
    const { Idle: idle, Float: float, HeadLook: look, Blink: blink } = this.actions;
    if (!idle) return;
    if (this.opts.still) {
      idle.play();
      this.mixer.update(0);
      idle.paused = true; // one calm pose; nothing loops
      return;
    }
    idle.play();
    float?.play();
    if (look && !this.opts.lite) look.setEffectiveWeight(LOOK_WEIGHT).play();
    if (!this.opts.lite) window.addEventListener('pointermove', this.onPointer, { passive: true });

    const blinkLoop = () => {
      blink?.reset().setLoop(THREE.LoopOnce, 1).play();
      this.later(blinkLoop, 2500 + Math.random() * 3500); // every 2.5–6 s
    };
    this.later(blinkLoop, 1800);
    this.later(() => this.gesture('Present'), 1400); // introduce the headline once
  }

  /** Present or Approve: replaces Idle on the upper body and HeadLook on the head, then hands back. */
  gesture(name: Gesture) {
    const g = this.actions[name];
    const idle = this.actions.Idle;
    const look = this.actions.HeadLook;
    if (!g || !idle || this.busy || this.opts.still) return;
    this.busy = true;
    g.reset().setLoop(THREE.LoopOnce, 1);
    g.clampWhenFinished = true;
    idle.crossFadeTo(g, 0.35, false);
    g.play();
    look?.fadeOut(0.3);
    const done = (e: { action: THREE.AnimationAction }) => {
      if (e.action !== g) return;
      this.mixer.removeEventListener('finished', done);
      idle.reset().play();
      g.crossFadeTo(idle, 0.5, false);
      if (look && !this.opts.lite) look.reset().setEffectiveWeight(LOOK_WEIGHT).fadeIn(0.6).play();
      this.later(() => { this.busy = false; }, 500);
    };
    this.mixer.addEventListener('finished', done);
  }

  /** Call every frame after the mixer has advanced. */
  update(delta: number) {
    if (this.opts.lite || this.opts.still) return;
    // The robot stands right of centre; bias so it looks into the page.
    const k = 1 - Math.exp(-delta * 4);
    this.aim.x += (this.pointer.x - 0.25 - this.aim.x) * k;
    this.aim.y += (this.pointer.y - this.aim.y) * k;
    const yaw = THREE.MathUtils.clamp(this.aim.x * 0.45, -0.5, 0.5);
    const pitch = THREE.MathUtils.clamp(-this.aim.y * 0.25, -0.3, 0.25);
    this.turn(this.neck, yaw * 0.35, pitch * 0.35);
    this.turn(this.head, yaw * 0.65, pitch * 0.65);
  }

  /** A small world-space turn added on top of whatever the clip posed. */
  private turn(bone: THREE.Object3D | undefined, yaw: number, pitch: number) {
    if (!bone?.parent) return;
    let m = this.memo.get(bone);
    if (!m) {
      m = { base: new THREE.Quaternion(), written: new THREE.Quaternion(NaN, NaN, NaN, NaN) };
      this.memo.set(bone, m);
    }
    if (bone.quaternion.equals(m.written)) bone.quaternion.copy(m.base);
    m.base.copy(bone.quaternion);
    bone.updateWorldMatrix(true, false);
    bone.parent.getWorldQuaternion(this.pw);
    bone.getWorldQuaternion(this.w);
    this.qy.setFromAxisAngle(UP, yaw);
    this.qx.setFromAxisAngle(SIDE, pitch);
    this.q.multiplyQuaternions(this.qy, this.qx);
    this.w.premultiply(this.q);
    bone.quaternion.copy(this.pw.invert().multiply(this.w));
    m.written.copy(bone.quaternion);
  }

  private later(fn: () => void, ms: number) {
    this.timers.push(window.setTimeout(fn, ms));
  }

  /** Stops clips and timers and frees GPU resources held by the model. */
  dispose() {
    this.timers.forEach((t) => window.clearTimeout(t));
    window.removeEventListener('pointermove', this.onPointer);
    this.mixer.stopAllAction();
    this.root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        for (const v of Object.values(mat)) if ((v as THREE.Texture)?.isTexture) (v as THREE.Texture).dispose();
        mat.dispose();
      }
    });
  }
}
