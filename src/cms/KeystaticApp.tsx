// The Keystatic admin UI. Vercel redirects every URL to a trailing-slash
// version (vercel.json trailingSlash: true), but Keystatic's router only
// matches paths without one, so a reload of /keystatic/collection/insights/
// would show "Not found". Strip the slash before Keystatic reads the URL.
import { makePage } from '@keystatic/astro/ui';
import config from '../../keystatic.config';

const Page = makePage(config);

export default function KeystaticApp() {
  if (typeof window !== 'undefined') {
    const { pathname, search, hash } = window.location;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      window.history.replaceState(window.history.state, '', pathname.replace(/\/+$/, '') + search + hash);
    }
  }
  return <Page />;
}
