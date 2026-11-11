// Keystatic CMS: lets the Moksh team edit articles and add case studies at
// /keystatic without touching code. Every save is a Git commit to this repo,
// which triggers a normal Vercel deploy. See docs/CONTENT-AND-SEO.md → "Editing in the CMS".
//
// - `npm run dev` → http://localhost:4321/keystatic edits files on disk (local mode).
// - Production → GitHub mode. Needs the four KEYSTATIC_* env vars in Vercel (docs/DEPLOYMENT.md).
import { config, collection, fields } from '@keystatic/core';
import { topics } from './src/lib/topics';
import { services } from './src/site.config';
import { tools } from './src/lib/tools';

const audienceOptions = [
  { label: 'For MSPs', value: 'msp' },
  { label: 'For operations teams', value: 'operations' },
  { label: 'For any team', value: 'general' },
];
const serviceOptions = services.map((s) => ({ label: s.name, value: s.slug }));
const toolOptions = tools.map((t) => ({ label: t.name, value: t.slug }));
const topicOptions = topics.map((t) => ({ label: t.name, value: t.slug }));

// Body editor. Saved as plain Markdown (.md) with GitHub-style tables, so the
// site renders it exactly as before.
const body = (label: string, uploads: string) =>
  fields.mdx({
    label,
    extension: 'md',
    options: {
      image: { directory: `public/uploads/${uploads}`, publicPath: `/uploads/${uploads}/` },
      table: true,
    },
  });

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: { owner: 'praveen1743', name: 'mokshai-site' } },
  ui: {
    brand: { name: 'Moksh AI' },
    navigation: { Content: ['insights', 'caseStudies'] },
  },
  collections: {
    insights: collection({
      label: 'Articles (Insights)',
      path: 'src/content/insights/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'published'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { length: { min: 10 } } },
          slug: {
            label: 'Web address',
            description: 'The page lives at mokshai.net/<this>/. Do not change it on a published article: old links and search results would break.',
          },
        }),
        description: fields.text({ label: 'Search description', description: 'Shown in Google results. 170 characters at most.', multiline: true, validation: { length: { min: 50, max: 170 } } }),
        summary: fields.text({ label: 'Summary', description: 'Two or three sentences that answer the title. Used on listing cards and by answer engines.', multiline: true, validation: { length: { min: 50 } } }),
        published: fields.date({ label: 'Published', validation: { isRequired: true }, defaultValue: { kind: 'today' } }),
        updated: fields.date({ label: 'Last updated', validation: { isRequired: true }, defaultValue: { kind: 'today' } }),
        audience: fields.select({ label: 'Audience', options: audienceOptions, defaultValue: 'general' }),
        topic: fields.select({ label: 'Topic hub', options: topicOptions, defaultValue: topicOptions[0].value }),
        services: fields.multiselect({ label: 'Related services', description: 'Shown under "Put this into practice".', options: serviceOptions }),
        tools: fields.multiselect({ label: 'Related calculators', options: toolOptions }),
        takeaways: fields.array(fields.text({ label: 'Takeaway', multiline: true }), {
          label: 'Key takeaways',
          itemLabel: (p) => p.value || 'Takeaway',
        }),
        faqs: fields.array(
          fields.object({
            q: fields.text({ label: 'Question' }),
            a: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'Questions (FAQ)', itemLabel: (p) => p.fields.q.value || 'Question' },
        ),
        featured: fields.checkbox({ label: 'Feature on the homepage and Insights page', defaultValue: false }),
        draft: fields.checkbox({
          label: 'Draft (hidden on the live site)',
          description: 'Tick to keep this article off the live site while it is reviewed.',
          defaultValue: false,
        }),
        author: fields.object(
          {
            name: fields.text({ label: 'Name', description: 'Leave empty to show "By the Moksh AI team".' }),
            role: fields.text({ label: 'Role' }),
            url: fields.text({ label: 'LinkedIn or profile URL' }),
            photo: fields.image({ label: 'Photo', directory: 'public/uploads/authors', publicPath: '/uploads/authors/' }),
          },
          { label: 'Author' },
        ),
        content: body('Article', 'articles'),
      },
    }),

    caseStudies: collection({
      label: 'Case studies',
      path: 'src/content/case-studies/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'published'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', description: 'Say what changed, e.g. "Cutting password-reset tickets for a 40-engineer MSP".' },
          slug: { label: 'Web address', description: 'The page lives at mokshai.net/case-studies/<this>/.' },
        }),
        description: fields.text({ label: 'Search description', multiline: true, validation: { length: { min: 50, max: 170 } } }),
        client: fields.text({ label: 'Client', description: 'A name with their permission, or an anonymised description such as "40-engineer MSP, New Jersey".', validation: { length: { min: 3 } } }),
        industry: fields.text({ label: 'Industry', validation: { length: { min: 2 } } }),
        audience: fields.select({ label: 'Audience', options: audienceOptions, defaultValue: 'msp' }),
        baseline: fields.text({ label: 'Before', description: 'Where they started, with the measure (e.g. "About 300 password resets a month, 15 minutes each").', multiline: true, validation: { length: { min: 10 } } }),
        result: fields.text({ label: 'After', description: 'What changed, with the measure and how it was measured. No estimates presented as results.', multiline: true, validation: { length: { min: 10 } } }),
        timeframe: fields.text({ label: 'Timeframe', description: 'e.g. "6-week pilot, live since March".', validation: { length: { min: 2 } } }),
        published: fields.date({ label: 'Published', validation: { isRequired: true }, defaultValue: { kind: 'today' } }),
        updated: fields.date({ label: 'Last updated' }),
        services: fields.multiselect({ label: 'Related services', options: serviceOptions }),
        tools: fields.multiselect({ label: 'Related calculators', options: toolOptions }),
        quote: fields.object(
          {
            text: fields.text({ label: 'Quote', description: 'Only with the person’s written permission.', multiline: true }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role and company' }),
          },
          { label: 'Client quote (optional)' },
        ),
        cover: fields.image({ label: 'Cover image', description: 'A real screenshot or photo, with client data removed.', directory: 'public/uploads/case-studies', publicPath: '/uploads/case-studies/' }),
        coverAlt: fields.text({ label: 'Cover image description', description: 'What the image shows, for screen readers.' }),
        draft: fields.checkbox({
          label: 'Draft (hidden on the live site)',
          description: 'New case studies start as drafts. Untick only after the client has approved the text.',
          defaultValue: true,
        }),
        content: body('Story', 'case-studies'),
      },
    }),
  },
});
