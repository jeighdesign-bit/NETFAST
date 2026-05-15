import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import ContinueWatching from "@/components/ContinueWatching";
import { fetchMovies } from "@/lib/tmdb";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ExperienceNotice from "@/components/ExperienceNotice";
import NetworkRow from "@/components/NetworkRow";
import ExoclickBanner from "@/components/ExoclickBanner";

export default async function Home() {
  // Fetch all data in parallel — dramatically faster than sequential awaits
  const [trending, topRated, anime, action, horror, romance, comedy, pinoy] = await Promise.all([
    fetchMovies("/trending/movie/day"),
    fetchMovies("/movie/top_rated"),
    fetchMovies("/discover/movie", { with_genres: "16", sort_by: "popularity.desc" }),
    fetchMovies("/discover/movie", { with_genres: "28" }),
    fetchMovies("/discover/movie", { with_genres: "27" }),
    fetchMovies("/discover/movie", { with_genres: "10749" }),
    fetchMovies("/discover/movie", { with_genres: "35" }),
    fetchMovies("/discover/movie", { with_original_language: "tl", sort_by: "revenue.desc" }),
  ]);

  const heroMovies = trending.slice(0, 5);

  return (
    <main className="relative min-h-screen">
      <HeroBanner movies={heroMovies} />
      
      <div className="relative z-40 pb-20 -mt-6 md:-mt-12 space-y-10 md:space-y-32 pt-4">
        
        {/* Quick Category Bar */}
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory gap-3 pb-4 md:pb-0 md:flex-wrap md:justify-center">
            {[
              { name: "Action", id: "28" },
              { name: "Sci-Fi", id: "878" },
              { name: "Horror", id: "27" },
              { name: "Romance", id: "10749" },
              { name: "Comedy", id: "35" },
              { name: "Anime", id: "16" },
              { name: "Pinoy", lang: "tl" }
            ].map((cat) => (
              <Link 
                key={cat.name} 
                href={cat.lang ? `/movies?lang=${cat.lang}` : `/movies?genre=${cat.id}`}
                className="snap-start shrink-0 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] hover:bg-[#e50914] hover:text-white hover:border-[#e50914] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        
        <NetworkRow />
        
        <ExperienceNotice />
        
        <ContinueWatching />
        
        <MovieRow title="Trending This Week" category="/movies?sort=trending" movies={trending.slice(0, 10)} variant="ranked" />
        
        <MovieRow title="Pinoy Blockbusters" category="/movies?lang=tl" highlight={true} movies={pinoy} />
        
        <MovieRow title="Top Rated & AI Recommended" category="/movies" movies={topRated} />

        <MovieRow title="Marvel Cinematic Universe" category="/movies?search=Marvel" movies={action.slice(0, 10)} highlight={true} />
        
        <MovieRow title="Horror Nights" category="/movies?genre=27" movies={horror} />
        
        {/* Single mid-page ad — keeps revenue without overwhelming mobile users */}
        <ExoclickBanner zoneId="5926632" />
        
        <MovieRow title="Anime Masterpieces" category="/anime" movies={anime.slice(0, 10)} highlight={true} />
        
        <MovieRow title="Action & Adventure" category="/movies?genre=28" movies={action} />
        
        <MovieRow title="Romance & Drama" category="/movies?genre=10749" movies={romance} />
        
        <MovieRow title="Comedy Central" category="/movies?genre=35" movies={comedy} />

        {/* Final CTA */}
        <div className="container mx-auto px-6 py-10 flex justify-center">
          <Link 
            href="/movies"
            className="group flex items-center gap-4 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#e50914] hover:text-white transition-all shadow-2xl"
          >
            Explore More Blockbusters
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
