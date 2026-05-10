import { MetadataRoute } from 'next';
import { fetchMovies } from '@/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://netfast.vercel.app';

  // Base routes
  const routes = ['', '/movies', '/anime', '/ai-discover', '/my-list'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add trending movies to sitemap (top 50)
  try {
    const trending = await fetchMovies('/trending/movie/week');
    const movieRoutes = trending.slice(0, 50).map((movie) => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...movieRoutes];
  } catch (error) {
    return routes;
  }
}
