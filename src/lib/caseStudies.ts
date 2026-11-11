import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './insights';

// Checking the folder first avoids Astro's "collection is empty" warning on
// every page while no case study has been written yet.
const files = import.meta.glob('/src/content/case-studies/*.md');

export type CaseStudy = CollectionEntry<'caseStudies'>;

/** Published case studies, newest first. Drafts appear only in `npm run dev`. */
export async function publishedCaseStudies(): Promise<CaseStudy[]> {
  if (Object.keys(files).length === 0) return [];
  return (await getCollection('caseStudies', isPublished)).sort((a, b) => +b.data.published - +a.data.published);
}
