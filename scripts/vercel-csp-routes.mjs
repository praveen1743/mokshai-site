// Post-build fix for @astrojs/vercel 11 with `staticHeaders: true`.
//
// The adapter turns Astro's CSP into one Vercel route per page, but:
//   1. the route `src` is the raw pathname, without a trailing slash for
//      static pages ("/about") while every real URL here ends in "/"
//      (trailingSlash: 'always'), so the header would never be sent there;
//   2. the routes have no `continue: true`, so a matching CSP route could stop
//      Vercel from applying later header routes (security headers, noindex on
//      *.vercel.app).
// This rewrites each CSP route to match the path with or without the slash and
// to continue routing. Safe to run repeatedly; does nothing without the file.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../.vercel/output/config.json', import.meta.url);
if (!existsSync(file)) {
  console.log('[vercel-csp-routes] no .vercel/output/config.json, skipping');
  process.exit(0);
}
const config = JSON.parse(readFileSync(file, 'utf8'));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let fixed = 0;
for (const route of config.routes ?? []) {
  const csp = route.headers && route.headers['content-security-policy'];
  if (!csp || typeof route.src !== 'string' || route.src.startsWith('^')) continue;
  const path = route.src.replace(/\/+$/, '');
  route.src = path === '' ? '^/$' : `^${esc(path)}/?$`;
  route.continue = true;
  fixed += 1;
}
writeFileSync(file, JSON.stringify(config, null, 2));
console.log(`[vercel-csp-routes] normalised ${fixed} CSP routes`);
