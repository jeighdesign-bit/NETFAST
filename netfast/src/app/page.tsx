import HeroBanner from "@/components/HeroBanner";
import AISearch from "@/components/AISearch";
import MovieRow from "@/components/MovieRow";
import ContinueWatching from "@/components/ContinueWatching";
import PersonalizedRow from "@/components/PersonalizedRow";
import { fetchMovies } from "@/lib/tmdb";

export default async function Home() {
  const trending = await fetchMovies("/trending/movie/day");
  const topRated = await fetchMovies("/movie/top_rated");
  const anime = await fetchMovies("/discover/movie", { with_genres: "16", sort_by: "popularity.desc" });
  const action = await fetchMovies("/discover/movie", { with_genres: "28" });
  const horror = await fetchMovies("/discover/movie", { with_genres: "27" });
  const romance = await fetchMovies("/discover/movie", { with_genres: "10749" });
  const comedy = await fetchMovies("/discover/movie", { with_genres: "35" });
  const pinoy = await fetchMovies("/discover/movie", { with_original_language: "tl", sort_by: "revenue.desc" });

  const heroMovie = trending[Math.floor(Math.random() * Math.min(trending.length, 5))];

  return (
    <main className="relative min-h-screen">
      <HeroBanner movie={heroMovie} />
      
      <div className="relative z-10 pb-20 -mt-32 space-y-16">
        <AISearch />
        
        <ContinueWatching />
        
        <PersonalizedRow />
        
        <MovieRow title="Trending Now" category="trending" movies={trending} />
        
        <MovieRow title="Pinoy Blockbusters" category="movies?lang=tl" highlight={true} movies={pinoy} />
        
        <MovieRow title="Top Rated & AI Recommended" category="ai-discover" movies={topRated} />
        
        <MovieRow title="Horror Nights" category="movies?genre=27" movies={horror} />
        
        <MovieRow title="Popular Anime" category="anime" movies={anime} />
        
        <MovieRow title="Action & Adventure" category="movies?genre=28" movies={action} />
        
        <MovieRow title="Romance & Drama" category="movies?genre=10749" movies={romance} />
        
        <MovieRow title="Comedy Central" category="movies?genre=35" movies={comedy} />
      </div>
    </main>
  );
}
