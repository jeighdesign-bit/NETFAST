import { MetadataRoute } from 'next';
import { fetchMovies } from '@/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://netfast.vercel.app';

  const routes = ['', '/movies', '/anime', '/ai-discover', '/my-list'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  try {
    const trending = await fetchMovies('/trending/movie/week');
    if (Array.isArray(trending)) {
      const movieRoutes = trending.slice(0, 20).map((movie) => ({
        url: `${baseUrl}/movie/${movie.id}`,
        lastModified: new Date().toISOString(),
      }));
      return [...routes, ...movieRoutes];
    }
  } catch (e) {
    console.error("Sitemap API error:", e);
  }

  return routes;
}
