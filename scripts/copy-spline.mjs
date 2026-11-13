// Copies the Spline runtime's WebAssembly files into public/spline so the hero
// scene loads them from mokshai.net instead of Spline's CDN (no third-party
// host in the CSP). Like the fonts, the binaries are not kept in git.
import { mkdirSync, copyFileSync, readdirSync } from 'node:fs';
const src = 'node_modules/@splinetool/runtime/build';
mkdirSync('public/spline', { recursive: true });
const files = readdirSync(src).filter((f) => f.endsWith('.wasm'));
for (const f of files) copyFileSync(`${src}/${f}`, `public/spline/${f}`);
console.log(`Copied ${files.length} Spline wasm files`);
