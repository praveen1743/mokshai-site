// Helpers for the Insights collection: sorting, related articles and reading time.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'insights'>;

/** Drafts show in `npm run dev` (and the CMS) but never in a production build. */
export const isPublished = (p: { data: { draft: boolean } }) => import.meta.env.DEV || !p.data.draft;

export async function allPosts(): Promise<Post[]> {
  return (await getCollection('insights', isPublished)).sort((a, b) => +b.data.published - +a.data.published);
}

/** Related articles: same topic first, then same audience, then newest. */
export function relatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const score = (p: Post) =>
    (p.data.topic === post.data.topic ? 4 : 0) +
    (p.data.audience === post.data.audience ? 2 : 0) +
    p.data.services.filter((s) => post.data.services.includes(s)).length;
  return posts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => score(b) - score(a) || +b.data.published - +a.data.published)
    .slice(0, limit);
}

export const postsForService = (posts: Post[], slug: string) => posts.filter((p) => p.data.services.includes(slug as never));
export const postsForTool = (posts: Post[], slug: string) => posts.filter((p) => p.data.tools.includes(slug as never));
export const postsForAudience = (posts: Post[], audience: 'msp' | 'operations') =>
  posts.filter((p) => p.data.audience === audience || p.data.audience === 'general');

export function readingMinutes(body = ''): number {
  const words = body.replace(/[#*_>`|\-[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const featuredPost = (posts: Post[]) => posts.find((p) => p.data.featured) ?? posts[0];

export const audienceLabel = (a: Post['data']['audience']) => (a === 'msp' ? 'For MSPs' : a === 'operations' ? 'For operations' : 'For any team');
export const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
