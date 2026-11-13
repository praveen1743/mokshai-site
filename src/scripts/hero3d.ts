// Homepage hero: documents from several industries flow into the Moksh agent
// (a glossy hexagon in the logo colours). Most leave as finished work; one in
// five is flagged and goes to the amber "person approves" node.
//
// Loaded with a dynamic import after first paint, so three.js never blocks the
// headline. Pauses off screen and in background tabs, renders a single still
// frame for prefers-reduced-motion, and leaves the static fallback in place if
// WebGL is unavailable.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Brand colours (logo palette, see global.css tokens).
const C = {
  blue: 0x2583db, teal: 0x16a3b0, green: 0x1fa92f,
  paper: 0xe9f1f7, done: 0x7fdc8c, amber: 0xf2b45c, deep: 0x0b2236,
};

type Lane = THREE.CatmullRomCurve3;

function hexShape(r: number) {
  const s = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3; // pointy-top, like the logo
    const x = r * Math.cos(a), y = r * Math.sin(a);
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

function hexPrism(r: number, depth: number, bevel: number) {
  const g = new THREE.ExtrudeGeometry(hexShape(r), { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 5, curveSegments: 1 });
  g.center();
  return g;
}

/** Logo-gradient face with the mark drawn in the middle. */
function faceTexture(logo: HTMLImageElement | null) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d')!;
  const g = x.createLinearGradient(0, 0, 512, 512);
  g.addColorStop(0, '#2583db'); g.addColorStop(0.5, '#16a3b0'); g.addColorStop(1, '#1fa92f');
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  // soft inner vignette for depth
  const v = x.createRadialGradient(256, 220, 40, 256, 256, 330);
  v.addColorStop(0, 'rgba(255,255,255,.18)'); v.addColorStop(1, 'rgba(3,11,20,.35)');
  x.fillStyle = v; x.fillRect(0, 0, 512, 512);
  if (logo) {
    x.fillStyle = 'rgba(255,255,255,.95)';
    roundRect(x, 176, 176, 160, 160, 34); x.fill();
    x.drawImage(logo, 196, 196, 120, 120);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Paper with a header bar and text lines, so documents read as documents. */
function paperTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 160;
  const x = c.getContext('2d')!;
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, 128, 160);
  x.fillStyle = '#9fb4c6'; x.fillRect(14, 16, 56, 10);
  x.fillStyle = '#c9d6df';
  [40, 54, 68, 82, 96, 110].forEach((y, i) => x.fillRect(14, y, i % 3 === 2 ? 64 : 100, 6));
  x.fillStyle = '#d7e3ea'; x.fillRect(14, 128, 40, 14);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(60,170,200,.55)'); g.addColorStop(0.45, 'rgba(37,131,219,.18)'); g.addColorStop(1, 'rgba(37,131,219,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function roundRect(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((res) => {
    const i = new Image();
    i.onload = () => res(i); i.onerror = () => res(null);
    i.src = src;
  });
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export async function mount(root: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return; // keep the static fallback
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'h3-canvas';

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(small ? 40 : 30, 1, 0.1, 100);
  const camBase = new THREE.Vector3(0, 0.4, small ? 11 : 17);
  camera.position.copy(camBase);
  camera.lookAt(0, 0, 0);

  // Lights: a cool key, brand-coloured rims.
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-3, 5, 6); scene.add(key);
  const rimB = new THREE.PointLight(C.blue, 30, 18); rimB.position.set(-4, 2, -2); scene.add(rimB);
  const rimG = new THREE.PointLight(C.green, 26, 18); rimG.position.set(4, -2, -1); scene.add(rimG);

  // Core: bevelled hexagon in dark lacquer, with the gradient face on the front.
  const logo = await loadImage('/favicon.svg');
  const core = new THREE.Group();
  const body = new THREE.Mesh(hexPrism(1.25, 0.55, 0.1), new THREE.MeshPhysicalMaterial({ color: C.deep, metalness: 0.55, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 }));
  core.add(body);
  const faceTex = faceTexture(logo);
  const faceGeo = new THREE.ShapeGeometry(hexShape(1.18));
  // map UVs from shape coords (-1.18..1.18) to 0..1
  const uv = faceGeo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 2.36 + 0.5, uv.getY(i) / 2.36 + 0.5);
  // The face keeps the exact logo gradient (not tone-mapped); a thin glossy
  // layer on top catches the reflections so it still reads as a solid object.
  const face = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({ map: faceTex, toneMapped: false }));
  face.position.z = 0.385;
  core.add(face);
  const gloss = new THREE.Mesh(faceGeo, new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false }));
  gloss.position.z = 0.39;
  core.add(gloss);
  core.scale.setScalar(small ? 1 : 1.15);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.012, 8, 120), new THREE.MeshBasicMaterial({ color: C.teal, transparent: true, opacity: 0.55 }));
  ring.rotation.x = Math.PI / 2.3;
  core.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.18, 0.01, 8, 120), new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0.3 }));
  ring2.rotation.set(Math.PI / 1.8, 0.4, 0);
  core.add(ring2);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  glow.scale.setScalar(7.5); glow.position.z = -0.6;
  scene.add(glow);
  scene.add(core);

  // The person: an amber hexagon the flagged documents travel to.
  const personPos = new THREE.Vector3(small ? 2.9 : 3.1, small ? -1.5 : -2.5, 0.4);
  const person = new THREE.Mesh(hexPrism(0.42, 0.22, 0.05), new THREE.MeshPhysicalMaterial({ color: 0xd98a1c, emissive: C.amber, emissiveIntensity: 0.12, metalness: 0.35, roughness: 0.28, clearcoat: 1 }));
  person.position.copy(personPos);
  scene.add(person);
  const personHalo = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.6, 6, 1), new THREE.MeshBasicMaterial({ color: C.amber, transparent: true, opacity: 0, side: THREE.DoubleSide }));
  personHalo.position.copy(personPos); personHalo.rotation.z = Math.PI / 6;
  scene.add(personHalo);

  // Lanes: three sources in, one "done" lane out, one lane to the person.
  const xIn = small ? -4.0 : -4.7, xOut = small ? 4.0 : 4.7;
  const inLanes: Lane[] = [2.1, 0, -2.1].map((y) => new THREE.CatmullRomCurve3([
    new THREE.Vector3(xIn, y, -1.2), new THREE.Vector3(xIn * 0.55, y * 0.75, 0.2), new THREE.Vector3(-1.6, y * 0.25, 0.5), new THREE.Vector3(0, 0, 0),
  ]));
  const doneLane = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.7, 0.45, 0.5), new THREE.Vector3(xOut * 0.6, 1.3, 0.2), new THREE.Vector3(xOut, 1.7, -1.2),
  ]);
  const flagLane = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.4, -0.6, 0.6), new THREE.Vector3(personPos.x - 0.7, personPos.y + 0.25, 0.5), personPos.clone(),
  ]);
  const laneMat = (color: number, opacity: number) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  [...inLanes.map((l) => [l, laneMat(C.blue, 0.35)] as const), [doneLane, laneMat(C.green, 0.4)] as const, [flagLane, laneMat(C.amber, 0.45)] as const]
    .forEach(([curve, mat]) => scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.01, 6, false), mat)));

  // Documents: one instanced mesh, recycled along the lanes.
  const N = small ? 12 : 18;
  const docs = new THREE.InstancedMesh(
    new RoundedBoxGeometry(0.36, 0.46, 0.02, 2, 0.025),
    new THREE.MeshPhysicalMaterial({ map: paperTexture(), roughness: 0.5, clearcoat: 0.25, emissive: 0xffffff, emissiveIntensity: 0.06 }),
    N,
  );
  docs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(docs);
  const cycle = 7.2;                          // seconds per document
  const tIn = 3.0, tHold = 0.7, tOut = 3.0;   // phases within a cycle
  const cIn = new THREE.Color(C.paper), cDone = new THREE.Color(C.done), cFlag = new THREE.Color(C.amber);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), e = new THREE.Euler(), col = new THREE.Color();
  let lastFlagHit = -10;

  function placeDocs(time: number) {
    for (let i = 0; i < N; i++) {
      const flagged = i % 5 === 2;
      const local = ((time + (i / N) * cycle) % cycle + cycle) % cycle;
      let scale = 1;
      if (local < tIn) {
        const t = smooth(local / tIn);
        inLanes[i % 3].getPointAt(t, p);
        scale = t > 0.82 ? 1 - (t - 0.82) / 0.18 : Math.min(1, local / 0.4);
        col.copy(cIn);
      } else if (local < tIn + tHold) {
        p.set(0, 0, 0); scale = 0; col.copy(cIn);
      } else {
        const t = smooth(Math.min(1, (local - tIn - tHold) / tOut));
        (flagged ? flagLane : doneLane).getPointAt(t, p);
        scale = t < 0.18 ? t / 0.18 : flagged && t > 0.9 ? 1 - (t - 0.9) / 0.1 : 1;
        if (!flagged && t > 0.85) scale = 1 - (t - 0.85) / 0.15;
        col.copy(flagged ? cFlag : cDone);
        if (flagged && t > 0.97) lastFlagHit = time;
      }
      e.set(0.15 * Math.sin(time * 0.8 + i), -0.35 + 0.25 * Math.sin(time * 0.6 + i * 1.7), 0.1 * Math.cos(time + i));
      q.setFromEuler(e);
      s.setScalar(Math.max(0.0001, scale));
      m.compose(p, q, s);
      docs.setMatrixAt(i, m);
      docs.setColorAt(i, col);
    }
    docs.instanceMatrix.needsUpdate = true;
    if (docs.instanceColor) docs.instanceColor.needsUpdate = true;
  }

  // Labels: HTML in the overlay, pinned to points in the scene.
  const labels = Array.from(root.querySelectorAll<HTMLElement>('[data-anchor]'));
  const anchors: Record<string, THREE.Vector3> = {
    in: new THREE.Vector3(xIn + 0.9, 3.0, -1.2),
    core: new THREE.Vector3(small ? -0.4 : 0, small ? -1.75 : -2.1, 0),
    done: new THREE.Vector3(xOut - 0.6, 2.6, -1.2),
    person: personPos.clone().add(new THREE.Vector3(0, -0.8, 0)),
  };
  function placeLabels(w: number, h: number) {
    const v = new THREE.Vector3();
    labels.forEach((l) => {
      const a = anchors[l.dataset.anchor ?? ''];
      if (!a) return;
      v.copy(a).project(camera);
      // keep every label fully inside the stage
      const half = l.offsetWidth / 2 + 4, halfH = l.offsetHeight / 2 + 4;
      l.style.left = `${Math.min(w - half, Math.max(half, ((v.x + 1) / 2) * w))}px`;
      l.style.top = `${Math.min(h - halfH, Math.max(halfH, ((1 - v.y) / 2) * h))}px`;
    });
  }

  // Size to the container (its aspect ratio is fixed in CSS, so no layout shift).
  const stage = root.querySelector<HTMLElement>('.h3-stage')!;
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    placeLabels(w, h);
  }
  stage.prepend(canvas);
  // Labels are placed from the observer's measurement (final layout) and only
  // then made visible, so they never move after they appear.
  new ResizeObserver(() => {
    resize();
    if (!running) frame(performance.now());
    root.classList.add('labels-ready');
  }).observe(stage);

  // Gentle pointer parallax on devices with a fine pointer.
  const target = new THREE.Vector2();
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    root.addEventListener('pointermove', (ev) => {
      const r = root.getBoundingClientRect();
      target.set(((ev.clientX - r.left) / r.width - 0.5) * 2, ((ev.clientY - r.top) / r.height - 0.5) * 2);
    });
    root.addEventListener('pointerleave', () => target.set(0, 0));
  }

  const clock0 = performance.now();
  let running = false, raf = 0;
  function frame(now: number) {
    const time = reduced ? 2.4 : (now - clock0) / 1000;
    core.rotation.y = reduced ? -0.25 : Math.sin(time * 0.35) * 0.35;
    core.rotation.x = reduced ? 0.08 : Math.sin(time * 0.27) * 0.08;
    ring.rotation.z = time * 0.25;
    ring2.rotation.z = -time * 0.18;
    person.rotation.y = Math.sin(time * 0.6) * 0.4;
    const since = time - lastFlagHit;
    (personHalo.material as THREE.MeshBasicMaterial).opacity = since < 1.2 ? 0.7 * (1 - since / 1.2) : 0;
    personHalo.scale.setScalar(1 + Math.max(0, Math.min(1, since / 1.2)) * 0.6);
    placeDocs(time);
    camera.position.x += (camBase.x + target.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (camBase.y - target.y * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }
  function start() { if (running || reduced) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // Swap the static fallback for the canvas; labels are still invisible here.
  root.classList.add('is-live');
  resize();
  frame(performance.now());

  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden || !visible ? stop() : start()));
}
