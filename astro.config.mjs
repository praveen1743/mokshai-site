import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';

const isDev = process.argv.includes('dev');
// The booking form POSTs to PUBLIC_FORM_ENDPOINT. Its origin is added to the
// CSP connect-src automatically so setting the env var is all that is needed.
const env = loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', process.cwd(), '');
const formOrigin = (() => {
  try { return new URL(env.PUBLIC_FORM_ENDPOINT).origin; } catch { return ''; }
})();

// Google tag (Site Kit + Google Ads) hosts, per Google's CSP guidance.
const google = {
  // *.doubleclick.net covers ad., td., googleads.g. and stats.g. (Google Ads).
  script: ['https://www.googletagmanager.com', 'https://www.googleadservices.com', 'https://*.doubleclick.net', 'https://www.google.com'],
  connect: ['https://*.google-analytics.com', 'https://analytics.google.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com', 'https://www.google.com', 'https://*.doubleclick.net'],
  img: ['https://*.google-analytics.com', 'https://analytics.google.com', 'https://*.googletagmanager.com', 'https://www.google.com', 'https://*.doubleclick.net'],
  frame: ['https://*.doubleclick.net', 'https://www.googletagmanager.com'],
};
// Keystatic admin (/keystatic) talks to GitHub from the browser.
const github = { connect: ['https://api.github.com'], img: ['https://avatars.githubusercontent.com', 'https://raw.githubusercontent.com'] };

// Keystatic's integration, with its admin page swapped for src/cms/KeystaticPage.astro,
// which copes with the trailing slash Vercel adds to every URL.
function keystaticCms() {
  const base = keystatic();
  const page = fileURLToPath(new URL('./src/cms/KeystaticPage.astro', import.meta.url));
  return {
    name: 'keystatic',
    hooks: {
      'astro:config:setup': (opts) => base.hooks['astro:config:setup']({
        ...opts,
        injectRoute: (route) => opts.injectRoute(route.entrypoint.endsWith('.astro') ? { ...route, entrypoint: page } : route),
      }),
    },
  };
}

// Wrap Markdown tables in a focusable, labelled scroll region so wide tables
// stay keyboard-accessible on small screens.
function rehypeTableScroll() {
  return (tree) => {
    let n = 0;
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type === 'element' && child.tagName === 'table') {
          n += 1;
          return { type: 'element', tagName: 'div', properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: `Table ${n} (scrolls sideways)` }, children: [child] };
        }
        return child;
      });
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://mokshai.net',
  // 'ignore' (not 'always') so the Keystatic admin's client-side URLs work in dev.
  // Public pages are unaffected: they are built as /page/index.html, canonicals
  // end in '/', and vercel.json (trailingSlash: true) redirects to the slashed URL.
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // Static fallbacks for old WordPress URLs. Real 301s are also shipped in
  // public/.htaccess, public/_redirects and vercel.json for each host type.
  redirects: {
    '/about-us/': '/about/',
    '/contact-us/': '/book/',
    '/blog/': '/insights/',
  },
  // Every public page is still prerendered to static HTML. The adapter is only
  // needed for the Keystatic CMS routes (/keystatic, /api/keystatic), which run
  // as Vercel functions, and to send the CSP as a real HTTP header.
  adapter: vercel({ staticHeaders: true }),
  integrations: [
    sitemap({
      filter: (page) => !/\/(about-us|contact-us|blog)\/$/.test(page) && !page.endsWith('/404/') && !page.includes('/keystatic'),
    }),
    react(),
    keystaticCms(),
  ],
  // Content Security Policy. Astro hashes every script it emits, so no inline
  // script is allowed unless Astro generated it. Styles allow 'unsafe-inline'
  // because components set CSS custom properties through style="" attributes.
  // Off in `astro dev` (Astro does not support CSP in dev, and React's dev
  // preamble is an inline script). Always on in production builds.
  security: isDev ? {} : {
    csp: {
      directives: [
        "default-src 'self'",
        `img-src 'self' data: blob: ${[...google.img, ...github.img].join(' ')}`,
        "font-src 'self'",
        "media-src 'self' data:", // data: for the Spline runtime's video support check on the homepage
        `connect-src 'self' ${[...google.connect, ...github.connect, formOrigin].filter(Boolean).join(' ')}`,
        `frame-src ${google.frame.join(' ')}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        'upgrade-insecure-requests',
      ],
      // 'wasm-unsafe-eval' lets the homepage Spline scene compile its self-hosted
      // WebAssembly (public/spline/). It does not allow eval() of JavaScript.
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'", ...google.script] },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  // Astro 7 defaults to the Sätteri Markdown pipeline. We stay on unified()
  // so the rehype table plugin above keeps working unchanged.
  // No article uses code blocks; Shiki's inline styles would also fight the CSP.
  markdown: { processor: unified({ rehypePlugins: [rehypeTableScroll] }), syntaxHighlight: false },
  // The Keystatic admin bundle is large; it only loads on /keystatic.
  vite: { build: { chunkSizeWarningLimit: 4000 } },
  // Astro 7 defaults to JSX whitespace rules ('jsx'), which drops spaces
  // between inline elements in our templates. Keep HTML-aware compression.
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
