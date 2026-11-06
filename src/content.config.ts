import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { topicSlugs } from './lib/topics';

const serviceSlugs = ['ai-consulting', 'custom-ai-development', 'ai-implementation-training', 'ai-cost-optimization'] as const;
const toolSlugs = ['msp-ticket-roi', 'back-office-hours', 'ai-spend-audit', 'ai-budget-planner', 'ai-readiness-scorecard'] as const;

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    summary: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    audience: z.enum(['msp', 'operations', 'general']),
    topic: z.enum(topicSlugs),
    // Internal links rendered around the article
    services: z.array(z.enum(serviceSlugs)).default([]),
    tools: z.array(z.enum(toolSlugs)).default([]),
    takeaways: z.array(z.string()).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    featured: z.boolean().default(false),
    // Named author. Leave out to show "By the Moksh AI team". photo is a path under public/.
    author: z.object({ name: z.string(), role: z.string(), url: z.string().url().optional(), photo: z.string().optional() }).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), updated: z.coerce.date() }),
});

export const collections = { insights, pages };
