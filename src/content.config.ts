import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    audience: z.enum(['msp', 'operations', 'general']),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), updated: z.coerce.date() }),
});

export const collections = { insights, pages };
