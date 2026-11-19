// Encodes the rendered hero frames (PNG) to WebP for the site.
//   node scripts/hero/encode.mjs <render_dir>
// Uses every other rendered frame plus the last (f_000, f_002 … f_046, f_047),
// renumbered 0..n-1. Writes public/hero/d/ (900 px), public/hero/m/ (540 px)
// and public/hero/labels.json. Set FRAMES in HeroRender.astro to n.
import { mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/hero/encode.mjs <render_dir>'); process.exit(1); }
const all = readdirSync(src).filter((f) => /^f_\d{3}\.png$/.test(f)).map((f) => Number(f.slice(2, 5))).sort((a, b) => a - b);
const last = all[all.length - 1];
const pick = all.filter((i) => i % 2 === 0 || i === last);
for (const d of ['d', 'm']) mkdirSync(join('public/hero', d), { recursive: true });
const bytes = { d: 0, m: 0 };
for (const [k, i] of pick.entries()) {
  const inp = join(src, `f_${String(i).padStart(3, '0')}.png`);
  const out = `f_${String(k).padStart(3, '0')}.webp`;
  bytes.d += (await sharp(inp).resize(900, 900).webp({ quality: 74, alphaQuality: 80, effort: 6 }).toFile(join('public/hero/d', out))).size;
  bytes.m += (await sharp(inp).resize(540, 540).webp({ quality: 70, alphaQuality: 75, effort: 6 }).toFile(join('public/hero/m', out))).size;
}
copyFileSync(join(src, 'labels.json'), 'public/hero/labels.json');
console.log(`${pick.length} frames; desktop ${(bytes.d / 1024).toFixed(0)} KB, mobile ${(bytes.m / 1024).toFixed(0)} KB`);
