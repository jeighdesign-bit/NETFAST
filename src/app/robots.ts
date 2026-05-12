import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://netfast.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
          '/my-list', // Prevent crawling private/user-specific pages if they exist
        ],
      },
      {
        userAgent: 'GPTBot', // Specifically handle AI crawlers if desired
        disallow: ['/api/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

