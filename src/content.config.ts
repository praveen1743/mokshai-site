import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { topicSlugs } from './lib/topics';
import { serviceSlugs } from './site.config';
import { toolSlugs } from './lib/tools';

// Fields the Keystatic CMS may write as empty strings are accepted here and
// treated as "not set" by the pages (see author, quote, cover).
const optionalUrl = z.union([z.url(), z.literal('')]).nullish();
// An empty optional date from the CMS must stay empty, not become 1 January 1970.
const optionalDate = z.preprocess((v) => (v === null || v === '' ? undefined : v), z.coerce.date().optional());

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
    // Drafts are visible in `npm run dev` and the CMS, never in production builds.
    draft: z.boolean().default(false),
    // Named author. Leave the name empty to show "By the Moksh AI team". photo is a path under public/.
    author: z.object({ name: z.string().default(''), role: z.string().default(''), url: optionalUrl, photo: z.string().nullish() }).optional(),
  }),
});

// Case studies: every field that makes one credible is required.
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    client: z.string(),          // a name, or an anonymised description ("40-engineer MSP, New Jersey")
    industry: z.string(),
    audience: z.enum(['msp', 'operations', 'general']),
    baseline: z.string(),        // where they started, with the measure
    result: z.string(),          // what changed, with the measure
    timeframe: z.string(),       // how long it took
    published: z.coerce.date(),
    updated: optionalDate,
    services: z.array(z.enum(serviceSlugs)).default([]),
    tools: z.array(z.enum(toolSlugs)).default([]),
    quote: z.object({ text: z.string().default(''), name: z.string().default(''), role: z.string().default('') }).optional(),
    cover: z.string().nullish(),
    coverAlt: z.string().nullish(),
    draft: z.boolean().default(true),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), updated: z.coerce.date() }),
});

export const collections = { insights, caseStudies, pages };
