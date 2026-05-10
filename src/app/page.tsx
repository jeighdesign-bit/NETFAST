import HeroBanner from "@/components/HeroBanner";
import AISearch from "@/components/AISearch";
import MovieRow from "@/components/MovieRow";
import ContinueWatching from "@/components/ContinueWatching";
import PersonalizedRow from "@/components/PersonalizedRow";
import { fetchMovies } from "@/lib/tmdb";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ExperienceNotice from "@/components/ExperienceNotice";

import NetworkRow from "@/components/NetworkRow";

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
        
        {/* Quick Category Bar */}
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3">
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
                className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-[#e50914] hover:text-white hover:border-[#e50914] transition-all duration-300"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        
        <ExperienceNotice />
        
        <ContinueWatching />
        
        <PersonalizedRow />

        <NetworkRow />
        
        <MovieRow title="Trending This Week" category="/movies?sort=trending" movies={trending.slice(0, 10)} variant="ranked" />
        
        <MovieRow title="Pinoy Blockbusters" category="/movies?lang=tl" highlight={true} movies={pinoy} />
        
        <MovieRow title="Top Rated & AI Recommended" category="/movies" movies={topRated} />
        
        <MovieRow title="Horror Nights" category="/movies?genre=27" movies={horror} />
        
        <MovieRow title="Popular Anime" category="/anime" movies={anime} />
        
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
