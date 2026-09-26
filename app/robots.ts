import { SITE_URL } from '@/lib/site';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /_next/ must stay crawlable: it serves the CSS and JavaScript Google
      // needs to render the pages. Blocking it makes pages look empty to Google.
      disallow: ['/api/', '/private/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
