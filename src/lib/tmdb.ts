const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";
import { redis } from './redis';

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  name?: string; // For TV shows
  original_language?: string;
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
  similar: {
    results: Movie[];
  };
}

// Verified Mock Library with Real TMDB Paths
const mockMovies: Movie[] = [
  { id: 550, title: "Fight Club", poster_path: "/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg", backdrop_path: "/hZk9pYqZp7vMvM60S2uDkWAVqcy.jpg", overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.", vote_average: 8.4, vote_count: 1000, release_date: "1999-10-15", genre_ids: [18] },
  { id: 157336, title: "Interstellar", poster_path: "/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg", backdrop_path: "/xJHbt7uY8vUvMvM60S2uDkWAVqcy.jpg", overview: "The adventures of a group of explorers who make use of a newly discovered wormhole.", vote_average: 8.4, vote_count: 1000, release_date: "2014-11-05", genre_ids: [12, 18, 878] },
  { id: 27205, title: "Inception", poster_path: "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg", backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", overview: "Cobb, a skilled thief who steals secrets from deep within the subconscious during the dream state.", vote_average: 8.3, vote_count: 1000, release_date: "2010-07-15", genre_ids: [28, 878, 12] },
  { id: 155, title: "The Dark Knight", poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", backdrop_path: "/nMK9po96P0tWuzSdh176OOBqLyL.jpg", overview: "Batman raises the stakes in his war on crime.", vote_average: 8.5, vote_count: 1000, release_date: "2008-07-16", genre_ids: [18, 28, 80, 53] },
  { id: 603, title: "The Matrix", poster_path: "/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg", backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker.", vote_average: 8.2, vote_count: 1000, release_date: "1999-03-30", genre_ids: [28, 878] },
  { id: 118340, title: "Guardians of the Galaxy", poster_path: "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg", backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", overview: "Light years from Earth, a group of intergalactic outlaws.", vote_average: 7.9, vote_count: 1000, release_date: "2014-07-30", genre_ids: [28, 878, 12] },
  { id: 372058, title: "Your Name.", poster_path: "/q719jXXEzOoYaps6babgKnONONX.jpg", backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives.", vote_average: 8.5, vote_count: 1000, release_date: "2016-08-26", genre_ids: [16, 18, 10749] },
  { id: 129, title: "Spirited Away", poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits.", vote_average: 8.5, vote_count: 1000, release_date: "2001-07-20", genre_ids: [16, 14, 12] },
  { id: 19995, title: "Avatar", poster_path: "/kyeqWdyUXW6089Ym38h.jpg", backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora.", vote_average: 7.5, vote_count: 1000, release_date: "2009-12-10", genre_ids: [28, 12, 14, 878] } as any,
  { id: 299536, title: "Avengers: Infinity War", poster_path: "/7WsyChvqcSzzP1tHX79GkU9HbsO.jpg", backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", overview: "As the Avengers and their allies have continued to protect the world.", vote_average: 8.3, vote_count: 1000, release_date: "2018-04-25", genre_ids: [12, 28, 878] },
  { 
    id: 1399, 
    name: "Game of Thrones", 
    poster_path: "/1XS1oqLmxbrIlRvSklv61eGqTTm.jpg", 
    backdrop_path: "/7q3SgyS24v6T5phuC9ST3NZnnOx.jpg", 
    overview: "Seven noble families fight for control of the mythical land of Westeros.", 
    vote_average: 8.4, 
    vote_count: 1000,
    release_date: "2011-04-17", 
    genre_ids: [18, 10765],
    number_of_seasons: 8,
    number_of_episodes: 73,
    seasons: [
      { id: 1, season_number: 1, episode_count: 10, name: "Season 1" },
      { id: 2, season_number: 2, episode_count: 10, name: "Season 2" },
      { id: 3, season_number: 3, episode_count: 10, name: "Season 1" },
      { id: 4, season_number: 4, episode_count: 10, name: "Season 2" },
      { id: 5, season_number: 5, episode_count: 10, name: "Season 1" },
      { id: 6, season_number: 6, episode_count: 10, name: "Season 2" },
      { id: 7, season_number: 7, episode_count: 7, name: "Season 1" },
      { id: 8, season_number: 8, episode_count: 6, name: "Season 2" }
    ]
  } as any,
  { 
    id: 60625, 
    name: "Rick and Morty", 
    poster_path: "/cvChGrB3S34M0t6JMC9o9mU6qFL.jpg", 
    backdrop_path: "/8ZTVqvKDQ8PznTrSccS0pJu1nTV.jpg", 
    overview: "Rick is a mentally-unbalanced but scientifically gifted old man.", 
    vote_average: 8.7, 
    vote_count: 1000,
    release_date: "2013-12-02", 
    genre_ids: [16, 35, 10765],
    number_of_seasons: 7,
    number_of_episodes: 71,
    seasons: [
      { id: 1, season_number: 1, episode_count: 11, name: "Season 1" },
      { id: 2, season_number: 2, episode_count: 10, name: "Season 2" },
      { id: 3, season_number: 3, episode_count: 10, name: "Season 1" },
      { id: 4, season_number: 4, episode_count: 10, name: "Season 2" },
      { id: 5, season_number: 5, episode_count: 10, name: "Season 1" },
      { id: 6, season_number: 6, episode_count: 10, name: "Season 2" },
      { id: 7, season_number: 7, episode_count: 10, name: "Season 1" }
    ]
  } as any,
  { id: 1143183, title: "Rewind", poster_path: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop", backdrop_path: null, overview: "A husband gets a second chance to save his wife's life after a tragic accident.", vote_average: 8.2, vote_count: 50, release_date: "2023-12-25", genre_ids: [18, 10749], original_language: "tl" },
  { id: 614479, title: "Hello, Love, Goodbye", poster_path: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop", backdrop_path: null, overview: "Two Filipino workers in Hong Kong fall in love but face life choices.", vote_average: 8.4, vote_count: 80, release_date: "2019-07-31", genre_ids: [18, 10749], original_language: "tl" },
  { id: 138843, title: "The Conjuring", poster_path: "/wT1zg4L7S53sJkX1tqGfB3j1QJ9.jpg", backdrop_path: null, overview: "Paranormal investigators work to help a family terrorized by a dark presence.", vote_average: 7.5, vote_count: 1000, release_date: "2013-07-17", genre_ids: [27, 53] },
  { id: 447332, title: "A Quiet Place", poster_path: "/nAU74GmpUk7t5iklEp3bufwDq4n.jpg", backdrop_path: null, overview: "A family must navigate their lives in silence to avoid mysterious creatures.", vote_average: 7.4, vote_count: 1000, release_date: "2018-04-03", genre_ids: [27, 878, 18] },
  { id: 597, title: "Titanic", poster_path: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", backdrop_path: null, overview: "A seventeen-year-old aristocrat falls in love with a kind but poor artist.", vote_average: 7.9, vote_count: 2000, release_date: "1997-11-18", genre_ids: [18, 10749, 53] },
  { id: 8363, title: "Superbad", poster_path: "/xfWac8MTYDxujaxgPVcRD9yZaul.jpg", backdrop_path: null, overview: "Two high school seniors try to buy alcohol for a party.", vote_average: 7.6, vote_count: 1200, release_date: "2007-08-17", genre_ids: [35] }
];

const mockMovieDetail: MovieDetail = {
  ...mockMovies[0],
  genres: [{ id: 18, name: "Drama" }],
  runtime: 139,
  videos: { results: [] },
  similar: { results: mockMovies.slice(1) }
};

export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export async function fetchMovies(endpoint: string, params: Record<string, string> = {}): Promise<Movie[]> {
  const data = await fetchTMDB(endpoint, params);
  
  // If we have an API key and fetched actual results from the TMDB API, use them!
  if (data && data.results && data.results.length > 0 && TMDB_API_KEY) {
    return data.results;
  }
  
  // Dynamic mock filtering system when API key is missing or API fails
  let filtered = [...mockMovies];
  
  // 1. Filter by language (e.g. Pinoy "tl")
  if (params.with_original_language) {
    filtered = filtered.filter(m => m.original_language === params.with_original_language);
  }
  
  // 2. Filter by genre
  if (params.with_genres) {
    const genreId = Number(params.with_genres);
    filtered = filtered.filter(m => m.genre_ids.includes(genreId));
  }
  
  // 3. Filter by search query (e.g. Marvel)
  if (params.query) {
    const queryTerm = params.query.toLowerCase();
    filtered = filtered.filter(m => 
      m.title.toLowerCase().includes(queryTerm) || 
      (m.overview && m.overview.toLowerCase().includes(queryTerm))
    );
  }
  
  // 4. Special cases based on endpoint path
  const path = endpoint.toLowerCase();
  if (path.includes("/trending")) {
    filtered = filtered.sort((a, b) => b.vote_average - a.vote_average);
  } else if (path.includes("/top_rated")) {
    filtered = filtered.sort((a, b) => b.vote_average - a.vote_average);
  }
  
  // Return the filtered list, fallback to standard mock movies slice if empty
  return filtered.length > 0 ? filtered : mockMovies.slice(0, 10);
}

export async function fetchTMDB(endpoint: string, params: Record<string, string> = {}): Promise<TMDBResponse> {
  if (!TMDB_API_KEY) {
    return { results: mockMovies, total_pages: 1, total_results: mockMovies.length, page: 1 };
  }
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append("api_key", TMDB_API_KEY);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    // Changed cache key to v2 to forcefully bust the stale cache causing missing posters
    const cacheKey = `tmdb_v3:${endpoint}:${JSON.stringify(params)}`;
    
    // Check sa Upstash Redis kung naa na bay gi-save ani
    const cachedData = await redis.get<TMDBResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(url.toString(), { next: { revalidate: 21600 } }); // 6h ISR
    const data = await response.json();
    
    // I-save ang resulta sa Redis para sunod paspas na (6 Hour expiration)
    if (data && !data.success && data.success !== false) {
      await redis.set(cacheKey, data, { ex: 21600 }); // 6h
    }
    
    return data;
  } catch (error: any) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error("Error fetching TMDB:", error);
    return { results: mockMovies, total_pages: 1, total_results: mockMovies.length, page: 1 };
  }
}

export async function fetchMovieDetails(id: string): Promise<MovieDetail> {
  if (!TMDB_API_KEY || isNaN(Number(id))) {
    const found = mockMovies.find(m => m.id === Number(id));
    return { ...(found || mockMovies[0]), genres: [{ id: 18, name: "Drama" }], runtime: 120, videos: { results: [] }, similar: { results: mockMovies.slice(1) } } as MovieDetail;
  }
  try {
    const url = `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,similar`;
    const response = await fetch(url, { next: { revalidate: 86400 } }); // 24h — details rarely change
    const data = await response.json();
    if (data.success === false) return { ...mockMovieDetail, id: Number(id) };
    return data;
  } catch (error: any) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    return { ...mockMovieDetail, id: Number(id) };
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const term = query.toLowerCase();
  if (!TMDB_API_KEY) {
    return mockMovies.filter(m => 
      (m.title && m.title.toLowerCase().includes(term)) || 
      ((m as any).name && (m as any).name.toLowerCase().includes(term))
    );
  }
  return fetchMovies("/search/multi", { query, include_adult: "true" });
}

export async function getMoviesByGenre(genreId: string): Promise<Movie[]> {
  return fetchMovies("/discover/movie", { with_genres: genreId });
}

export async function getTrendingMovies(timeWindow: "day" | "week" = "day"): Promise<Movie[]> {
  return fetchMovies(`/trending/movie/${timeWindow}`);
}

export function getImageUrl(path: string | null, size: "w500" | "original" = "w500"): string | null {
  if (!path || path === "" || path === "null" || path === "undefined" || path === "false") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Ensure the path starts with a slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
}

/** Use this in metadata, OG images, and CSS backgrounds that require a real string URL */
export function getImageUrlSafe(path: string | null, size: "w500" | "original" = "w500"): string {
  return getImageUrl(path, size) ?? `https://netfast.stream/og-image.jpg`;
}


export async function getMovieVideos(id: string) {
  if (!TMDB_API_KEY) return { results: [] };
  try {
    const url = `${BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 86400 } }); // 24h — video keys don't change
    return await response.json();
  } catch (error: any) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    return { results: [] };
  }
}

export interface TVDetail extends Movie {
  name: string;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: { id: number; season_number: number; episode_count: number; name: string }[];
  similar?: { results: Movie[] };
}

export interface TVSeasonDetail {
  _id: string;
  air_date: string;
  episodes: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  }[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
}

export async function fetchTVDetails(id: string): Promise<TVDetail> {
  if (!TMDB_API_KEY || isNaN(Number(id))) {
    const found = mockMovies.find(m => m.id === Number(id));
    return { ...(found || mockMovies[0]), name: (found as any)?.name || "Mock TV", number_of_seasons: 1, number_of_episodes: 1, seasons: [{ id: 1, season_number: 1, episode_count: 24, name: "Season 1" }] } as any;
  }
  try {
    const url = `${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,similar`;
    const response = await fetch(url, { next: { revalidate: 86400 } }); // 24h — TV details are stable
    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    return { ...mockMovieDetail, id: Number(id), name: "Error TV", number_of_seasons: 0, number_of_episodes: 0, seasons: [] } as any;
  }
}

export async function fetchTVSeason(id: string, seasonNumber: number): Promise<TVSeasonDetail> {

  if (!TMDB_API_KEY || isNaN(Number(id))) {
    return { episodes: [] } as any;
  }
  try {
    const url = `${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 21600 } }); // 6h — season episode lists
    return await response.json();
  } catch (error: any) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    return { episodes: [] } as any;
  }
}
