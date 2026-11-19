// Encodes the rendered hero frames (PNG) to WebP for the site.
//   node scripts/hero/encode.mjs <render_dir>
// Writes public/hero/d/ (900 px, every frame), public/hero/m/ (540 px, every
// other frame plus the last) and public/hero/labels.json.
import { mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/hero/encode.mjs <render_dir>'); process.exit(1); }
const frames = readdirSync(src).filter((f) => /^f_\d{3}\.png$/.test(f)).sort();
for (const d of ['d', 'm']) mkdirSync(join('public/hero', d), { recursive: true });
let bytes = { d: 0, m: 0 };
for (const [i, f] of frames.entries()) {
  const out = f.replace('.png', '.webp');
  const d = await sharp(join(src, f)).resize(900, 900).webp({ quality: 74, alphaQuality: 80, effort: 6 }).toFile(join('public/hero/d', out));
  bytes.d += d.size;
  if (i % 2 === 0 || i === frames.length - 1) {
    const m = await sharp(join(src, f)).resize(540, 540).webp({ quality: 70, alphaQuality: 75, effort: 6 }).toFile(join('public/hero/m', out));
    bytes.m += m.size;
  }
}
copyFileSync(join(src, 'labels.json'), 'public/hero/labels.json');
console.log(`${frames.length} frames; desktop ${(bytes.d / 1024).toFixed(0)} KB, mobile ${(bytes.m / 1024).toFixed(0)} KB`);
