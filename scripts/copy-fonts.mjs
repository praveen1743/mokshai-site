// Copies the self-hosted font files from the installed @fontsource packages
// into public/fonts before each build, so the binaries don't live in git.
import { mkdirSync, copyFileSync } from 'node:fs';
const map = {
  'archivo-var.woff2': '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2',
  'ibm-plex-sans-latin-400-normal.woff2': '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2',
  'ibm-plex-sans-latin-400-italic.woff2': '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-italic.woff2',
  'ibm-plex-sans-latin-500-normal.woff2': '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2',
  'ibm-plex-sans-latin-600-normal.woff2': '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2',
  'ibm-plex-mono-latin-400-normal.woff2': '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
  'ibm-plex-mono-latin-500-normal.woff2': '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
};
mkdirSync('public/fonts', { recursive: true });
for (const [dest, src] of Object.entries(map)) copyFileSync(`node_modules/${src}`, `public/fonts/${dest}`);
console.log(`Copied ${Object.keys(map).length} font files`);
