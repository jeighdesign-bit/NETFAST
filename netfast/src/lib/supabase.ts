import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WatchHistoryEntry = {
  id: string;
  user_id: string;
  movie_id: string;
  movie_title: string;
  progress_seconds: number;
  duration_seconds: number;
  last_watched_at: string;
};

export type FavoriteMovie = {
  id: string;
  user_id: string;
  movie_id: string;
  movie_title: string;
  poster_path: string;
  added_at: string;
};

export type TrendingMovie = {
  id: string;
  movie_id: string;
  movie_title: string;
  view_count: number;
  trending_score: number;
  updated_at: string;
};

export type AIRecommendation = {
  id: string;
  user_id: string;
  recommended_movie_ids: string[]; // Array of TMDB movie IDs
  reason: string;
  generated_at: string;
};
