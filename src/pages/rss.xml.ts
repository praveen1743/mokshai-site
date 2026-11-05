import { getCollection } from 'astro:content';
import { site } from '../site.config';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const posts = (await getCollection('insights')).sort((a, b) => +b.data.updated - +a.data.updated);
  const items = posts
    .map((p) => {
      const url = `${site.url}/${p.id}/`;
      return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${p.data.published.toUTCString()}</pubDate><description>${esc(p.data.summary)}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)} insights</title><link>${site.url}/insights/</link><description>${esc(site.description)}</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
