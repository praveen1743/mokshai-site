import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // Static fallbacks for old WordPress URLs. Real 301s are also shipped in
  // public/.htaccess, public/_redirects and vercel.json for each host type.
  redirects: {
    '/about-us/': '/about/',
    '/contact-us/': '/book/',
    '/blog/': '/insights/',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(about-us|contact-us|blog)\/$/.test(page) && !page.endsWith('/404/'),
    }),
  ],
  markdown: { rehypePlugins: [rehypeTableScroll] },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
