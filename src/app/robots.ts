import { MetadataRoute } from 'next';

// FIX: sin trailing slash para evitar //sitemap.xml
const baseUrl = 'https://mascotiq.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}