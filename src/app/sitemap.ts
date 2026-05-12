import { MetadataRoute } from 'next';
import { fetchMovies } from '@/lib/tmdb';

const BASE_URL = 'https://netfast.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/movies',
    '/tv',
    '/anime',
    '/trending',
    '/ai-discover',
    '/my-list',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch a variety of content to populate the sitemap
    const [trendingMovies, trendingTV, popularMovies] = await Promise.all([
      fetchMovies('/trending/movie/week'),
      fetchMovies('/trending/tv/week'),
      fetchMovies('/movie/popular'),
    ]);

    const movieRoutes = [...trendingMovies, ...popularMovies]
      .filter((movie, index, self) => self.findIndex(m => m.id === movie.id) === index)
      .slice(0, 100)
      .map((movie) => ({
        url: `${BASE_URL}/movie/${movie.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

    const tvRoutes = trendingTV.slice(0, 50).map((show) => ({
      url: `${BASE_URL}/tv/${show.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...movieRoutes, ...tvRoutes];
  } catch (e) {
    console.error("Sitemap generation error:", e);
    return staticRoutes;
  }
}

