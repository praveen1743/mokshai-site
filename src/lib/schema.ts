import { site } from '../site.config';

const abs = (path: string) => new URL(path, site.url).toString();

export const orgId = `${site.url}/#organization`;

export function organization() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': orgId,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', url: abs('/logo-wordmark.svg') },
    image: abs('/og/default.jpg'),
    description: site.description,
    email: site.email,
    identifier: { '@type': 'PropertyValue', propertyID: 'CIN', value: site.cin },
    address: site.offices.map((o) => ({
      '@type': 'PostalAddress',
      streetAddress: o.street,
      addressLocality: o.locality,
      addressRegion: o.region,
      postalCode: o.postalCode,
      addressCountry: o.country,
    })),
    contactPoint: site.offices.map((o) => ({
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: o.phone,
      email: site.email,
      areaServed: o.country,
      availableLanguage: ['en'],
    })),
    areaServed: [{ '@type': 'Country', name: 'United States' }],
    knowsAbout: [
      'AI agents for managed service providers',
      'IT service management automation',
      'AI strategy consulting',
      'Workflow automation',
      'AI cost optimisation',
    ],
    parentOrganization: { '@type': 'Organization', name: 'Moksh Group', url: 'https://moksh-group.com/' },
    sameAs: Object.values(site.social),
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    publisher: { '@id': orgId },
    inLanguage: 'en-US',
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faq(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function service(s: { name: string; path: string; description: string; serviceType: string }) {
  return {
    '@type': 'Service',
    '@id': `${abs(s.path)}#service`,
    name: s.name,
    url: abs(s.path),
    serviceType: s.serviceType,
    description: s.description,
    provider: { '@id': orgId },
    areaServed: { '@type': 'Country', name: 'United States' },
  };
}

export function article(a: { title: string; description: string; path: string; published: Date; updated: Date; author?: { name: string; role: string; url?: string } }) {
  return {
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    url: abs(a.path),
    mainEntityOfPage: abs(a.path),
    datePublished: a.published.toISOString(),
    dateModified: a.updated.toISOString(),
    author: a.author ? { '@type': 'Person', name: a.author.name, jobTitle: a.author.role, ...(a.author.url ? { url: a.author.url, sameAs: [a.author.url] } : {}), worksFor: { '@id': orgId } } : { '@id': orgId },
    publisher: { '@id': orgId },
    image: abs('/og/default.jpg'),
    inLanguage: 'en-US',
  };
}

export function webApp(a: { name: string; path: string; description: string }) {
  return {
    '@type': 'WebApplication',
    name: a.name,
    url: abs(a.path),
    description: a.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (web browser)',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@id': orgId },
  };
}
