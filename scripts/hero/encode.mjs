// Encodes the rendered hero frames (PNG) to WebP for the site.
//   node scripts/hero/encode.mjs <render_dir>
// Uses every rendered frame, numbered 0..n-1. Writes public/hero/d/ (900 px),
// public/hero/m/ (480 px)
// and public/hero/labels.json. Set FRAMES in HeroRender.astro to n.
import { mkdirSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/hero/encode.mjs <render_dir>'); process.exit(1); }
const all = readdirSync(src).filter((f) => /^f_\d{3}\.png$/.test(f)).map((f) => Number(f.slice(2, 5))).sort((a, b) => a - b);
const pick = all; // every rendered frame; the player blends between neighbours
for (const d of ['d', 'm']) mkdirSync(join('public/hero', d), { recursive: true });
const bytes = { d: 0, m: 0 };
const track = []; // per frame: [centre x, bottom y, width] as fractions of the frame
// Soft round mask: the shadow catcher leaves a faint haze to the frame edges,
// which shows as a rectangle on the page. Fade the edges to fully transparent.
// Also strip the shadow-catcher shadow (near-black, partly transparent pixels):
// its render noise changes every frame and flickers in motion. HeroRender draws
// one smooth CSS shadow instead, placed from track.json.
const mask = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900"><defs><radialGradient id="g" cx="50%" cy="52%" r="50%"><stop offset="0.72" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="900" height="900" fill="url(#g)"/></svg>');
for (const [k, i] of pick.entries()) {
  const inp = join(src, `f_${String(i).padStart(3, '0')}.png`);
  const out = `f_${String(k).padStart(3, '0')}.webp`;
  const { data, info } = await sharp(inp).resize(900, 900).composite([{ input: mask, blend: 'dest-in' }]).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = 1e9, maxX = -1, maxY = -1;
  for (let p = 0; p < data.length; p += 4) {
    const a = data[p + 3];
    if (a === 0) continue;
    if (Math.max(data[p], data[p + 1], data[p + 2]) < 48 && a < 235) { data[p + 3] = 0; continue; }
    if (a > 200) { const px = (p / 4) % info.width, py = Math.floor(p / 4 / info.width); minX = Math.min(minX, px); maxX = Math.max(maxX, px); maxY = Math.max(maxY, py); }
  }
  track.push([+((minX + maxX) / 2 / info.width).toFixed(4), +(maxY / info.height).toFixed(4), +((maxX - minX) / info.width).toFixed(4)]);
  const img = await sharp(data, { raw: info }).png().toBuffer();
  bytes.d += (await sharp(img).webp({ quality: 74, alphaQuality: 80, effort: 6 }).toFile(join('public/hero/d', out))).size;
  bytes.m += (await sharp(img).resize(480, 480).webp({ quality: 66, alphaQuality: 70, effort: 6 }).toFile(join('public/hero/m', out))).size;
}
copyFileSync(join(src, 'labels.json'), 'public/hero/labels.json');
writeFileSync('public/hero/track.json', JSON.stringify(track));
console.log(`${pick.length} frames; desktop ${(bytes.d / 1024).toFixed(0)} KB, mobile ${(bytes.m / 1024).toFixed(0)} KB`);
